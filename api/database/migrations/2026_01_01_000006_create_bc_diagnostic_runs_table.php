<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bc_diagnostic_runs', function (Blueprint $table) {
            $table->uuid('diagnostic_run_id')->primary();
            $table->uuid('session_id');
            $table->uuid('user_id');
            $table->uuid('business_id')->nullable();
            $table->uuid('triage_id')->nullable();
            $table->string('module_code', 20);
            $table->string('module_family', 50);
            $table->string('module_version', 10);
            $table->timestamp('started_at');
            $table->timestamp('completed_at')->nullable();
            $table->string('completion_status', 50);
            $table->integer('question_count_expected');
            $table->integer('question_count_answered')->default(0);
            $table->integer('followup_count')->default(0);
            $table->integer('duration_seconds')->nullable();
            $table->string('abandon_screen_id', 50)->nullable();
            $table->string('abandon_question_id', 50)->nullable();
            $table->boolean('is_recommended_module')->default(false);
            $table->boolean('is_user_override')->default(false);
            $table->timestamps();

            $table->index('session_id');
            $table->index('user_id');
            $table->index('module_code');
            $table->index('completion_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bc_diagnostic_runs');
    }
};
