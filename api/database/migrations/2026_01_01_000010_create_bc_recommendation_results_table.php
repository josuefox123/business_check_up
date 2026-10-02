<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bc_recommendation_results', function (Blueprint $table) {
            $table->uuid('recommendation_id')->primary();
            $table->uuid('diagnostic_run_id');
            $table->string('module_code', 20);
            $table->string('summary_text_key', 100);
            $table->text('summary_text_rendered');
            $table->text('interpretation_text');
            $table->json('strengths_codes')->nullable();
            $table->json('weaknesses_codes')->nullable();
            $table->json('priority_actions_codes')->nullable();
            $table->json('typical_fragilities');
            $table->json('typical_strengths');
            $table->string('orientation_text_key', 100);
            $table->text('orientation_text');
            $table->string('next_module_code', 20)->nullable();
            $table->boolean('follow_up_recommended')->default(false);
            $table->boolean('urgent_attention_recommended')->default(false);
            $table->string('disclaimer_version', 50);
            $table->boolean('pdf_generated')->default(false);
            $table->string('pdf_url', 500)->nullable();
            $table->timestamps();

            $table->index('diagnostic_run_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bc_recommendation_results');
    }
};
