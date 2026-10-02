<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('bc_diagnostic_runs', function (Blueprint $table) {
            $table->string('report_status', 20)->default('pending');
            $table->timestamp('report_sent_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bc_diagnostic_runs', function (Blueprint $table) {
            $table->dropColumn([
                'report_status',
                'report_sent_at',
            ]);
        });
    }
};
