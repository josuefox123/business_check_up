<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bc_user_sessions', function (Blueprint $table) {
            $table->uuid('session_id')->primary();
            $table->uuid('user_id');
            $table->timestamp('started_at');
            $table->timestamp('ended_at')->nullable();
            $table->string('entry_source', 50)->nullable();
            $table->string('entry_mode', 50);
            $table->string('device_type', 50)->default('unknown');
            $table->string('browser_language', 10)->nullable();
            $table->string('session_status', 50);
            $table->string('last_screen_id', 50)->nullable();
            $table->string('utm_campaign', 255)->nullable();
            $table->string('utm_channel', 255)->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('session_status');
            $table->index('started_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bc_user_sessions');
    }
};
