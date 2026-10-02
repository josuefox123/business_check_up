<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bc_follow_up_leads', function (Blueprint $table) {
            $table->uuid('lead_id')->primary();
            $table->uuid('user_id');
            $table->uuid('business_id')->nullable();
            $table->uuid('diagnostic_run_id');
            $table->boolean('follow_up_requested')->default(false);
            $table->string('follow_up_need_type', 50)->nullable();
            $table->string('lead_priority', 50);
            $table->string('lead_reason_code', 100)->nullable();
            $table->string('assigned_to', 255)->nullable();
            $table->string('lead_status', 50)->default('new');
            $table->integer('contact_attempt_count')->default(0);
            $table->timestamp('last_contacted_at')->nullable();
            $table->text('follow_up_notes')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('diagnostic_run_id');
            $table->index('lead_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bc_follow_up_leads');
    }
};
