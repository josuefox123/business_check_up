<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;

class ModuleController extends BaseController
{
    /**
     * Liste tous les modules disponibles
     * GET /api/bc/modules
     */
    public function index(): JsonResponse
    {
        $modules = config('business-checkup.modules');

        $formatted = [];
        foreach ($modules as $code => $module) {
            $formatted[] = [
                'code' => $code,
                'name' => $module['name'],
                'family' => $module['family'],
                'status' => $module['status'],
                'target_duration' => $module['target_duration'],
                'target_duration_formatted' => $module['target_duration'],
                'question_count' => $module['question_count'],
                'scoring_type' => $module['scoring_type'],
                'is_available' => in_array($module['status'], ['mvp', 'mvp_recommended']),
            ];
        }

        return $this->respondSuccess([
            'modules' => $formatted,
            'total' => count($formatted),
            'available_mvp' => count(array_filter($formatted, fn($m) => $m['is_available'])),
        ]);
    }

    /**
     * Détails d'un module spécifique 
     * GET /api/bc/modules/{code}
     */
    public function show(string $code): JsonResponse
    {
        $module = config("business-checkup.modules.{$code}");

        if (!$module) {
            return $this->respondNotFound('Module not found');
        }

        return $this->respondSuccess([
            'code' => $code,
            'name' => $module['name'],
            'family' => $module['family'],
            'status' => $module['status'],
            'target_duration' => $module['target_duration'],
            'target_duration_formatted' => $module['target_duration'],
            'question_count' => $module['question_count'],
            'scoring_type' => $module['scoring_type'],
            'evidence_level' => $module['evidence_level'],
            'output_type' => $module['output_type'],
        ]);
    }

    private function formatDuration(string $seconds): string
    {
        if ($seconds < 60) {
            return "{$seconds}s";
        }
        $minutes = round($seconds / 60);
        return "{$minutes} min";
    }
}
