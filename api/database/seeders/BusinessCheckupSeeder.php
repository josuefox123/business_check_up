<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BusinessCheckupSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedSampleDiagnostics();
    }

    private function seedSampleDiagnostics(): void
    {
        // Session exemple
        $sessionId = (string) Str::uuid();
        $userId = (string) Str::uuid();
        $businessId = (string) Str::uuid();
        $triageId = (string) Str::uuid();

        DB::table('bc_user_sessions')->insert([
            'session_id' => $sessionId,
            'user_id' => $userId,
            'started_at' => now(),
            'entry_source' => 'direct',
            'entry_mode' => 'assisted',
            'device_type' => 'mobile',
            'session_status' => 'completed',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('bc_user_profiles')->insert([
            'user_id' => $userId,
            'user_profile_type' => 'active_entrepreneur',
            'full_name' => 'Jean Dupont',
            'phone_number' => '+22990123456',
            'email' => 'jean@example.com',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('bc_business_profiles')->insert([
            'business_id' => $businessId,
            'user_id' => $userId,
            'business_name' => 'Ma Société',
            'region' => 'littoral',
            'sector' => 'commerce_distribution',
            'activity_stage' => 'regular_sales',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('bc_triage_records')->insert([
            'triage_id' => $triageId,
            'session_id' => $sessionId,
            'user_id' => $userId,
            'business_id' => $businessId,
            'entry_mode' => 'assisted',
            'declared_profile' => 'active_entrepreneur',
            'activity_stage_declared' => 'regular_sales',
            'primary_need' => 'understand_finance',
            'risk_flags' => json_encode(['none']),
            'risk_level' => 'none',
            'time_available' => '8_15_min',
            'recommended_module_code' => 'FIN-07',
            'recommendation_reason_code' => 'need_fit',
            'recommendation_reason_text' => 'Vos réponses indiquent que votre priorité actuelle semble être: Comprendre trésorerie et rentabilité.',
            'user_confirmed_recommendation' => true,
            'triage_completed_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
