<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bc_scoring_results', function (Blueprint $table) {
            $table->uuid('scoring_id')->primary();
            $table->uuid('diagnostic_run_id');
            $table->string('module_code', 20);
            $table->decimal('raw_score_1_5', 3, 2);
            $table->integer('converted_score_0_100');
            $table->decimal('adjusted_score_1_5', 3, 2)->nullable();
            $table->decimal('credibility_score_0_1', 3, 2);
            $table->integer('credibilized_score_0_100')->nullable();
            $table->string('score_band', 50);
            $table->string('evidence_band', 50)->nullable();
            $table->integer('red_flag_count')->default(0);
            $table->boolean('critical_red_flag_present')->default(false);
            $table->string('dominant_strength_code', 100)->nullable();
            $table->string('dominant_weakness_code', 100)->nullable();
            $table->string('priority_1_code', 100)->nullable();
            $table->string('priority_2_code', 100)->nullable();
            $table->string('priority_3_code', 100)->nullable();
            $table->string('next_module_code', 20)->nullable();
            $table->timestamp('score_calculated_at');
            $table->timestamps();

            $table->index('diagnostic_run_id');
            $table->index('module_code');
            $table->index('score_band');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bc_scoring_results');
    }
};
