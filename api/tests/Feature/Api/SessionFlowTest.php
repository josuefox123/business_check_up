<?php

namespace Tests\Feature\Api;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SessionFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_session(): void
    {
        $response = $this->postJson('/api/bc/sessions', [
            'entry_source' => 'direct',
            'entry_mode' => 'assisted',
            'device_type' => 'mobile',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'data' => ['session_id', 'user_id', 'started_at', 'status'],
            ]);
    }

    public function test_user_must_consent_before_diagnostic(): void
    {
        $session = UserSession::factory()->create();

        $response = $this->postJson("/api/bc/sessions/{$session->session_id}/consent", [
            'consent_diagnostic' => true,
            'consent_aggregate' => true,
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.consent_diagnostic', true);
    }

    public function test_diagnostic_blocked_without_consent(): void
    {
        $session = UserSession::factory()->create();

        $response = $this->postJson("/api/bc/sessions/{$session->session_id}/triage", [
            'user_profile_type' => 'active_entrepreneur',
            'region' => 'littoral',
            'sector' => 'commerce',
            'activity_stage' => 'regular_sales',
            'entry_mode' => 'assisted',
            'primary_need' => 'understand_finance',
            'time_available' => '8_15_min',
        ]);

        $response->assertStatus(403)
            ->assertJsonPath('message', 'Diagnostic consent required');
    }

    public function test_critical_risk_routes_to_difficulty(): void
    {
        $session = UserSession::factory()->create();

        ConsentRecord::factory()->create([
            'session_id' => $session->session_id,
            'consent_diagnostic' => true,
        ]);

        $response = $this->postJson("/api/bc/sessions/{$session->session_id}/triage", [
            'user_profile_type' => 'active_entrepreneur',
            'region' => 'littoral',
            'sector' => 'commerce',
            'activity_stage' => 'regular_sales',
            'entry_mode' => 'assisted',
            'primary_need' => 'assess_opportunity',
            'risk_flags' => ['cannot_pay_current_expenses'],
            'time_available' => '8_15_min',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.recommended_module.code', 'DIF-03')
            ->assertJsonPath('data.override_required', true);
    }
}
