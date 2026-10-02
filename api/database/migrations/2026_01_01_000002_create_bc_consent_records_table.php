<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bc_consent_records', function (Blueprint $table) {
            $table->uuid('consent_id')->primary();
            $table->uuid('session_id');
            $table->boolean('consent_diagnostic');
            $table->boolean('consent_aggregate');
            $table->boolean('consent_contact')->default(false);
            $table->boolean('consent_pdf_email')->default(false);
            $table->string('consent_version', 50);
            $table->timestamp('consent_timestamp');
            $table->string('privacy_notice_url', 500)->nullable();
            $table->timestamps();

            $table->index('session_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bc_consent_records');
    }
};
