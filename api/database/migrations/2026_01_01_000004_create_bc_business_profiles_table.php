<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bc_business_profiles', function (Blueprint $table) {
            $table->uuid('business_id')->primary();
            $table->uuid('user_id');
            $table->string('business_name', 255)->nullable();
            $table->boolean('has_business_name')->default(true);
            $table->string('country', 10)->default('BJ');
            $table->string('region', 100);
            $table->string('commune', 100)->nullable();
            $table->string('sector', 100);
            $table->string('sub_sector', 100)->nullable();
            $table->string('activity_stage', 50);
            $table->string('maturity_phase', 50)->nullable();
            $table->string('legal_status', 50)->nullable();
            $table->boolean('ifu_available')->nullable();
            $table->boolean('rccm_available')->nullable();
            $table->boolean('bank_account_available')->nullable();
            $table->integer('years_in_activity')->nullable();
            $table->string('year_created')->nullable();
            $table->string('ca_n_1')->nullable();
            $table->string('ca_m_1')->nullable();
            $table->longText('description')->nullable();
            $table->string('employee_count_range', 50)->nullable();
            $table->string('monthly_revenue_range_xof', 50)->nullable();
            $table->string('customer_type', 50)->nullable();
            $table->string('sales_channel_main', 50)->nullable();
            $table->json('business_context_flags')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('region');
            $table->index('sector');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bc_business_profiles');
    }
};
