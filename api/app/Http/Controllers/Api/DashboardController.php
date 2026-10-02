<?php

namespace App\Http\Controllers\Api;

use App\Enums\CompletionStatus;
use App\Http\Controllers\Api\BaseController;
use App\Models\DiagnosticRun;
use App\Models\FollowUpLead;
use App\Models\UserSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends BaseController
{
    /**
     * GET /api/bc/dashboard/overview
     * Vue d'ensemble du dashboard
     */
    public function overview(): JsonResponse
    {
        $totalSessions = UserSession::count();
        $totalDiagnostics = DiagnosticRun::count();
        $completedDiagnostics = DiagnosticRun::where('completion_status', CompletionStatus::COMPLETED)->count();
        $totalLeads = FollowUpLead::where('follow_up_requested', true)->count();

        $completionRate = $totalDiagnostics > 0
            ? round(($completedDiagnostics / $totalDiagnostics) * 100, 2)
            : 0;

        $abandonedDiagnostics = DiagnosticRun::where('completion_status', CompletionStatus::ABANDONED)->count();
        $abandonRate = $totalDiagnostics > 0
            ? round(($abandonedDiagnostics / $totalDiagnostics) * 100, 2)
            : 0;

        return $this->respondSuccess([
            'overview' => [
                'total_sessions' => $totalSessions,
                'total_diagnostics' => $totalDiagnostics,
                'completed_diagnostics' => $completedDiagnostics,
                'completion_rate' => $completionRate,
                'abandon_rate' => $abandonRate,
                'total_leads' => $totalLeads,
            ],
        ]);
    }

    /**
     * GET /api/bc/dashboard/metrics
     * Métriques détaillées
     */
    public function metrics(Request $request): JsonResponse
    {
        $startDate = $request->input('start_date', now()->subDays(30)->toDateString());
        $endDate = $request->input('end_date', now()->toDateString());

        // Répartition par région
        $regionDistribution = DB::table('bc_business_profiles')
            ->select('region', DB::raw('COUNT(*) as count'))
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('region')
            ->orderByDesc('count')
            ->get();

        // Répartition par secteur
        $sectorDistribution = DB::table('bc_business_profiles')
            ->select('sector', DB::raw('COUNT(*) as count'))
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('sector')
            ->orderByDesc('count')
            ->get();

        // Répartition par module
        $moduleDistribution = DB::table('bc_diagnostic_runs')
            ->select('module_code', DB::raw('COUNT(*) as count'))
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('module_code')
            ->orderByDesc('count')
            ->get();

        // Score moyen par module
        $avgScores = DB::table('bc_scoring_results')
            ->select('module_code', DB::raw('AVG(converted_score_0_100) as avg_score'))
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('module_code')
            ->get();

        return $this->respondSuccess([
            'period' => [
                'start' => $startDate,
                'end' => $endDate,
            ],
            'region_distribution' => $regionDistribution,
            'sector_distribution' => $sectorDistribution,
            'module_distribution' => $moduleDistribution,
            'average_scores_by_module' => $avgScores,
        ]);
    }

    /**
     * GET /api/bc/dashboard/diagnostics
     * Liste des diagnostics avec filtres
     */
    public function diagnostics(Request $request): JsonResponse
    {
        $query = DiagnosticRun::with(['user', 'business', 'scoringResult']);

        if ($request->has('module_code')) {
            $query->where('module_code', $request->input('module_code'));
        }

        if ($request->has('status')) {
            $query->where('completion_status', $request->input('status'));
        }

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('created_at', [
                $request->input('start_date'),
                $request->input('end_date'),
            ]);
        }

        $diagnostics = $query->orderByDesc('created_at')
            ->paginate($request->input('per_page', 50));

        return $this->respondSuccess([
            'diagnostics' => $diagnostics->items(),
            'pagination' => [
                'current_page' => $diagnostics->currentPage(),
                'total_pages' => $diagnostics->lastPage(),
                'total_items' => $diagnostics->total(),
                'per_page' => $diagnostics->perPage(),
            ],
        ]);
    }

    /**
     * GET /api/bc/dashboard/leads
     * Leads de suivi
     */
    public function leads(Request $request): JsonResponse
    {
        $query = FollowUpLead::with(['user', 'business', 'diagnosticRun'])
            ->where('follow_up_requested', true);

        if ($request->has('status')) {
            $query->where('lead_status', $request->input('status'));
        }

        if ($request->has('priority')) {
            $query->where('lead_priority', $request->input('priority'));
        }

        $leads = $query->orderByDesc('created_at')
            ->paginate($request->input('per_page', 50));

        return $this->respondSuccess([
            'leads' => $leads->items(),
            'pagination' => [
                'current_page' => $leads->currentPage(),
                'total_pages' => $leads->lastPage(),
                'total_items' => $leads->total(),
                'per_page' => $leads->perPage(),
            ],
        ]);
    }

    /**
     * GET /api/bc/dashboard/analytics
     * Événements analytics
     */
    public function analytics(Request $request): JsonResponse
    {
        $startDate = $request->input('start_date', now()->subDays(7)->toDateString());
        $endDate = $request->input('end_date', now()->toDateString());

        // Écrans d'abandon les plus fréquents
        $topAbandonScreens = DB::table('bc_diagnostic_runs')
            ->select('abandon_screen_id', DB::raw('COUNT(*) as count'))
            ->where('completion_status', CompletionStatus::ABANDONED->value)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->whereNotNull('abandon_screen_id')
            ->groupBy('abandon_screen_id')
            ->orderByDesc('count')
            ->limit(10)
            ->get();

        // Taux de conversion par étape
        $conversionFunnel = [
            'sessions_created' => UserSession::whereBetween('created_at', [$startDate, $endDate])->count(),
            'consent_given' => DB::table('bc_consent_records')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->where('consent_diagnostic', true)
                ->count(),
            'triage_completed' => DB::table('bc_triage_records')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->count(),
            'diagnostics_started' => DiagnosticRun::whereBetween('created_at', [$startDate, $endDate])->count(),
            'diagnostics_completed' => DiagnosticRun::where('completion_status', CompletionStatus::COMPLETED)
                ->whereBetween('created_at', [$startDate, $endDate])
                ->count(),
        ];

        return $this->respondSuccess([
            'period' => [
                'start' => $startDate,
                'end' => $endDate,
            ],
            'top_abandon_screens' => $topAbandonScreens,
            'conversion_funnel' => $conversionFunnel,
        ]);
    }

    /**
     * GET /api/bc/dashboard/exports/diagnostics
     * Export CSV des diagnostics
     */
    public function exportDiagnostics(Request $request)
    {
        $startDate = $request->input('start_date', now()->subDays(30)->toDateString());
        $endDate = $request->input('end_date', now()->toDateString());

        $diagnostics = DiagnosticRun::with(['user', 'business', 'scoringResult'])
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="diagnostics_export.csv"',
        ];

        $callback = function () use ($diagnostics) {
            $file = fopen('php://output', 'w');
            fputcsv($file, [
                'Diagnostic ID',
                'Module',
                'Status',
                'Score',
                'Band',
                'Region',
                'Sector',
                'Started At',
                'Completed At',
                'Duration (s)'
            ]);

            foreach ($diagnostics as $diag) {
                fputcsv($file, [
                    $diag->diagnostic_run_id,
                    $diag->module_code,
                    $diag->completion_status->value,
                    $diag->scoringResult?->converted_score_0_100 ?? 'N/A',
                    $diag->scoringResult?->score_band->value ?? 'N/A',
                    $diag->business?->region ?? 'N/A',
                    $diag->business?->sector ?? 'N/A',
                    $diag->started_at?->toDateTimeString() ?? 'N/A',
                    $diag->completed_at?->toDateTimeString() ?? 'N/A',
                    $diag->duration_seconds ?? 'N/A',
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * GET /api/bc/dashboard/exports/leads
     * Export CSV des leads
     */
    public function exportLeads(Request $request)
    {
        $startDate = $request->input('start_date', now()->subDays(30)->toDateString());
        $endDate = $request->input('end_date', now()->toDateString());

        $leads = FollowUpLead::with(['user', 'business'])
            ->where('follow_up_requested', true)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="leads_export.csv"',
        ];

        $callback = function () use ($leads) {
            $file = fopen('php://output', 'w');
            fputcsv($file, [
                'Lead ID',
                'Name',
                'Phone',
                'Email',
                'Region',
                'Sector',
                'Need Type',
                'Priority',
                'Status',
                'Created At'
            ]);

            foreach ($leads as $lead) {
                fputcsv($file, [
                    $lead->lead_id,
                    $lead->user?->full_name ?? 'N/A',
                    $lead->user?->phone_number ?? 'N/A',
                    $lead->user?->email ?? 'N/A',
                    $lead->business?->region ?? 'N/A',
                    $lead->business?->sector ?? 'N/A',
                    $lead->follow_up_need_type ?? 'N/A',
                    $lead->lead_priority ?? 'N/A',
                    $lead->lead_status ?? 'N/A',
                    $lead->created_at?->toDateTimeString() ?? 'N/A',
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
