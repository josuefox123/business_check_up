<?php

namespace App\Services\Ia;

use App\Models\DiagnosticRun;
use App\Models\Question;
use App\Models\QuestionResponse;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class AnswerClassifierService
{


    /**
     * Envoie TOUTES les réponses IA d'un diagnostic en un seul appel.
     * Retourne : [question_id => ['chosen_values' => [...], 'confidence' => ..., 'reasoning' => ...]]
     *
     * @throws RuntimeException si l'API IA est indisponible
     */
    public function classifyBatch(DiagnosticRun $diagnostic, Collection $responses): array
    {
        $items = $responses->map(function (QuestionResponse $response) {
            $question = $response->question;

            return [
                'question_id'   => $question->question_id,
                'question_text' => $question->text,
                'helper_text'   => $question->helper_text,
                'answer_mode'   => $question->answer_type->value,
                'options'       => collect($question->options)->map(fn($o) => [
                    'value' => $o['value'],
                    'label' => $o['label'],
                ])->values()->all(),
                'user_answer'   => $response->answer_free_text ?? $response->answer_value,
            ];
        })->values()->all();

        $http = Http::timeout(90)      // batch -> généreux, mais borné
            ->acceptJson()
            ->post(config('business-checkup.answer_ai.endpoint'), [
                'diagnostic_run_id' => $diagnostic->id,
                'context'           => [
                    'sector'      => $diagnostic->business?->sector ?? null,
                    'module_code' => $diagnostic->module_code,
                ],
                'items' => $items,
            ]);

        if ($http->failed()) {
            throw new RuntimeException('API IA indisponible (HTTP ' . $http->status() . ')');
        }

        return collect($http->json('results', []))->keyBy('question_id')->all();
    }

















    /**
     * Envoie le texte libre à l'IA et retourne la classification validée.
     *
     * @return array{chosen_values: array, confidence: string, reasoning: ?string}
     * @throws RuntimeException si l'IA est indisponible ou renvoie une réponse invalide
     */
    public function classify(Question $question, string $freeText, array $context = []): array
    {
        $options = collect($question->options)->map(fn($o) => [
            'value' => $o['value'],
            'label' => $o['label'],
        ])->values()->all();

        $payload = [
            'question_id'   => $question->question_id,
            'diagnostic_id' => '',
            'question_text' => $question->text,
            'helper_text'   => $question->helper_text,
            'answer_mode'   => $question->answer_type->value === 'multi_choice' ? 'multi' : 'single',
            'options'       => $options,
            'user_answer'   => $freeText,
            // 'context'       => array_merge(['module_code' => $question->module_code, 'locale' => 'fr-BJ'], $context),
        ];

        $response = Http::timeout(12)
            ->retry(2, 500)          // 2 tentatives en cas de timeout réseau
            ->acceptJson()
            ->post(config('business-checkup.answer_ai.endpoint'), $payload);

        if ($response->failed()) {
            throw new RuntimeException('IA indisponible (HTTP ' . $response->status() . ')');
        }

        $data = $response->json();

        // Validation stricte : les valeurs choisies doivent exister dans les options
        $validValues   = collect($options)->pluck('value')->all();
        $chosenValues  = array_values(array_intersect($data['chosen_values'] ?? [], $validValues));

        if (empty($chosenValues)) {
            throw new RuntimeException('L\'IA n\'a retourné aucune option valide.');
        }

        return [
            'chosen_values' => $chosenValues,
            'confidence'    => in_array($data['confidence'] ?? null, ['high', 'medium', 'low'])
                ? $data['confidence'] : 'low',
            'reasoning'     => $data['reasoning'] ?? null,
        ];
    }
}
