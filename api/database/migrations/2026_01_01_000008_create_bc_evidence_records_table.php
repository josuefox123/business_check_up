<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bc_evidence_records', function (Blueprint $table) {
            $table->uuid('evidence_id')->primary();
            $table->uuid('diagnostic_run_id');
            $table->uuid('response_id')->nullable();
            $table->string('question_id', 50)->nullable();
            $table->string('evidence_level', 50);
            $table->string('evidence_label', 255)->nullable();
            $table->string('evidence_type', 50)->nullable();
            $table->boolean('document_uploaded')->default(false);
            $table->string('document_url', 500)->nullable();
            $table->string('evidence_recency', 50)->nullable();
            $table->text('evidence_note')->nullable();
            $table->timestamps();

            $table->index('diagnostic_run_id');
            $table->index('response_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bc_evidence_records');
    }
};
