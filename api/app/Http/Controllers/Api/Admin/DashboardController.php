<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\CompletionStatus;
use App\Enums\SessionStatus;
use App\Http\Controllers\Api\BaseController;
use App\Models\BusinessProfile;
use App\Models\DiagnosticRun;
use App\Models\FollowUpLead;
use App\Models\ScoringResult;
use App\Models\UserProfile;
use App\Models\UserSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Enums\ScoreBand;


class DashboardController extends BaseController
{
    /**
     * Vue d'ensemble du dashboard
     * GET /api/bc/admin/dashboard
     */
    public function overview(): JsonResponse
    {
        $sessions = UserSession::query();
        $diagnostics = DiagnosticRun::where('module_code', '!=', 'TRI-00');
        
        $total = ScoringResult::count();

        $stats = collect(ScoreBand::cases())->mapWithKeys(function ($band) use ($total) {
            $count = ScoringResult::where('score_band', $band)->count();

            return [
                $band->value => [
                    'count' => $count,
                    'percentage' => $total > 0
                        ? round(($count / $total) * 100, 2)
                        : 0,
                ],
            ];
        });

        $diagsCount = $diagnostics->count();
        $diagsCompleted = (clone $diagnostics)->where('completion_status', CompletionStatus::COMPLETED->value)->count();
        $diagsInProgress = (clone $diagnostics)
            ->where('completion_status', '!=', CompletionStatus::COMPLETED->value)
            ->where('question_count_answered', '>', 0)
            ->count();
        $diagsNotStarted = (clone $diagnostics)
            ->where('completion_status', '!=', CompletionStatus::COMPLETED->value)
            ->where(function ($q) {
                $q->whereNull('question_count_answered')->orWhere('question_count_answered', 0);
            })
            ->count();
        $diagsAbandoned = (clone $diagnostics)->where('completion_status', CompletionStatus::ABANDONED->value)->count();

        return $this->respondSuccess([
            'traffic' => [
                'total_visitors' => $sessions->count(),
                'new_sessions' => (clone $sessions)->where('session_status', SessionStatus::STARTED->value)->count(),
                'completed_sessions' => (clone $sessions)->where('session_status', SessionStatus::COMPLETED->value)->count(),
                'abandoned_sessions' => (clone $sessions)->where('session_status', SessionStatus::ABANDONED->value)->count(),
            ],
            'diagnostics' => [
                'total' => $diagsCount,
                'started' => $diagsCount,
                'completed' => $diagsCompleted,
                'in_progress' => $diagsInProgress,
                'not_started' => $diagsNotStarted,
                'abandoned' => $diagsAbandoned,
                'completion_rate' => $diagsCount > 0 ? round(($diagsCompleted / $diagsCount) * 100, 2) : 0,
            ],
            'follow_ups' => [
                'total_requests' => FollowUpLead::count(),
                'urgent' => FollowUpLead::where('lead_priority', 'urgent')->count(),
                'high' => FollowUpLead::where('lead_priority', 'high')->count(),
                'new' => FollowUpLead::where('lead_status', 'new')->count(),
            ],
            'pme' => BusinessProfile::with('user')
                ->get()
                ->pluck('user.email')
                ->filter()
                ->unique()
                ->count(),
            'score_band' => $stats,
        ]);
    }

    /**
     * Répartition par module
     * GET /api/bc/admin/dashboard/modules
     */
    public function modules(): JsonResponse
    {
        $modules = DiagnosticRun::where('module_code', '!=', 'TRI-00')
            ->select('module_code')
            ->selectRaw('COUNT(*) as count')
            ->selectRaw('SUM(CASE WHEN completion_status = ? THEN 1 ELSE 0 END) as completed', [CompletionStatus::COMPLETED->value])
            ->groupBy('module_code')
            ->orderByDesc('count')
            ->get();

        return $this->respondSuccess([
            'modules' => $modules,
        ]);
    }

    /**
     * Les diagnostics paginés avec filtres, recherche et synthèse globale
     */
    public function diagnostics(Request $request): JsonResponse
    {
        $query = DiagnosticRun::query();

        // Filtre par module
        if ($request->filled('module_code')) {
            $query->where('module_code', $request->input('module_code'));
        }

        // Filtre par statut d'achèvement
        if ($request->filled('completion_status')) {
            $status = $request->input('completion_status');
            if ($status === 'completed') {
                $query->where('completion_status', 'completed');
            } elseif ($status === 'in_progress') {
                $query->where('completion_status', '!=', 'completed');
            } else {
                $query->where('completion_status', $status);
            }
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->input('user_id'));
        }

        // Recherche par mot-clé (PME, déclarant, code module, ID diagnostic)
        if ($request->filled('search')) {
            $search = '%' . trim($request->input('search')) . '%';
            $query->where(function ($q) use ($search) {
                $q->where('module_code', 'like', $search)
                  ->orWhere('diagnostic_run_id', 'like', $search)
                  ->orWhereHas('business', function ($bq) use ($search) {
                      $bq->where('business_name', 'like', $search)
                         ->orWhere('sector', 'like', $search);
                  })
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('full_name', 'like', $search)
                         ->orWhere('email', 'like', $search)
                         ->orWhere('phone_number', 'like', $search);
                  });
            });
        }

        // Tri par date de début décroissante par défaut
        $query->orderBy('started_at', 'desc');

        // Pagination
        $perPage = (int) $request->input('per_page', 30);
        $diagnostics = $query->with([
            'business:business_id,business_name,sector,sub_sector,description',
            'user:user_id,full_name,phone_number,whatsapp_number,email'
        ])->paginate($perPage);

        // Synthèse globale rapide en direct de la base
        $summary = [
            'total' => DiagnosticRun::count(),
            'completed' => DiagnosticRun::where('completion_status', 'completed')->count(),
            'in_progress' => DiagnosticRun::where('completion_status', '!=', 'completed')->count(),
        ];

        $responseArray = $diagnostics->toArray();
        $responseArray['summary'] = $summary;

        return response()->json($responseArray);
    }

    /**
     * Scores moyens par module
     *  GET /api/bc/admin/dashboard/scores
     */
    public function scores(): JsonResponse
    {
        $scores = ScoringResult::select('module_code')
            ->selectRaw('AVG(converted_score_0_100) as avg_score')
            ->selectRaw('AVG(credibilized_score_0_100) as avg_credibilized_score')
            ->selectRaw('COUNT(*) as total')
            ->groupBy('module_code')
            ->get();

        return $this->respondSuccess([
            'scores_by_module' => $scores,
        ]);
    }

    /**
     * Répartition territoriale
     *  GET /api/bc/admin/dashboard/territory
     */
    public function territory(): JsonResponse
    {
        $regions = DB::table('bc_business_profiles as bp')
            ->join('bc_diagnostic_runs as dr', 'bp.business_id', '=', 'dr.business_id')
            ->where('dr.module_code', '!=', 'TRI-00')
            ->select('bp.region')
            ->selectRaw('COUNT(*) as diagnostic_count')
            ->groupBy('bp.region')
            ->orderByDesc('diagnostic_count')
            ->get();

        return $this->respondSuccess([
            'regions' => $regions,
        ]);
    }

    private function calculateCompletionRate($diagnostics): float
    {
        $total = $diagnostics->count();
        if ($total === 0) return 0.0;

        $completed = $diagnostics->clone()->where('completion_status', CompletionStatus::COMPLETED->value)->count();
        return round(($completed / $total) * 100, 2);
    }

    /**
     * Liste des PMES
     */
    public function pmes(): JsonResponse
    {
    $pmes = BusinessProfile::with(['diagnosticRuns', 'user'])
        ->withCount('diagnosticRuns')
        ->get()
        ->filter(fn ($business) => filled($business->user?->email))
        ->unique(fn ($business) => $business->user->email)
        ->values();

        return response()->json($pmes);
    }

    /**
     * Historique d'un utilisateur (profil inscrit ou session libre)
     */
    public function historical(string $userProfile): JsonResponse
    {
        $profile = UserProfile::where('user_id', $userProfile)->orWhere('id', $userProfile)->first();

        $query = DiagnosticRun::query();
        if ($profile) {
            $query->where('user_id', $profile->user_id);
        } else {
            $query->where('user_id', $userProfile);
        }

        $h = $query->with([
            'business',
            'questionResponses.question:question_id,text'
        ])->get();

        return response()->json($h);
    }
}
