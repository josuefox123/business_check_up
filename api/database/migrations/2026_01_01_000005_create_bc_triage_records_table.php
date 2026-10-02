<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bc_triage_records', function (Blueprint $table) {
            $table->uuid('triage_id')->primary();
            $table->uuid('session_id');
            $table->uuid('user_id');
            $table->uuid('business_id');
            $table->string('entry_mode', 50);
            $table->string('declared_profile', 50);
            $table->string('activity_stage_declared', 50);
            $table->string('primary_need', 50);
            $table->json('risk_flags')->nullable();
            $table->string('risk_level', 50);
            $table->string('opportunity_type', 50)->nullable();
            $table->string('dominant_topic', 50)->nullable();
            $table->string('time_available', 50)->nullable();
            $table->string('main_offer_type')->nullable();
            $table->string('recommended_module_code', 20)->nullable();
            $table->string('recommendation_reason_code', 50)->nullable();
            $table->text('recommendation_reason_text')->nullable();
            $table->boolean('user_confirmed_recommendation')->default(false);
            $table->boolean('override_choice')->default(false);
            $table->string('override_module_code', 20)->nullable();
            $table->timestamp('triage_completed_at');
            $table->timestamps();

            $table->index('session_id');
            $table->index('user_id');
            $table->index('recommended_module_code');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bc_triage_records');
    }
};
