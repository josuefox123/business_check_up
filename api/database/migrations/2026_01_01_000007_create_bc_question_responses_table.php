<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bc_question_responses', function (Blueprint $table) {
            $table->uuid('response_id')->primary();
            $table->uuid('diagnostic_run_id');
            $table->string('module_code', 20);
            $table->string('question_id', 50);
            $table->string('question_version', 10);
            $table->string('question_dimension', 50);
            $table->string('answer_type', 50);
            $table->text('answer_value')->nullable();
            $table->longText('answer_text')->nullable();
            $table->boolean('answer_ia')->nullable();
            $table->text('answer_label')->nullable();
            $table->decimal('score_1_5', 3, 2)->nullable();
            $table->decimal('weight', 3, 2)->default(1.0);
            $table->boolean('is_critical_question')->default(false);
            $table->boolean('red_flag_triggered')->default(false);
            $table->string('red_flag_code', 100)->nullable();
            $table->boolean('followup_triggered')->default(false);
            $table->string('followup_question_id', 50)->nullable();
            $table->string('response_confidence_user', 50)->nullable();
            $table->timestamp('answered_at');
            $table->timestamps();

            $table->index('diagnostic_run_id');
            $table->index('question_id');
            $table->index('module_code');

            $table->unique(['diagnostic_run_id', 'question_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bc_question_responses');
    }
};
