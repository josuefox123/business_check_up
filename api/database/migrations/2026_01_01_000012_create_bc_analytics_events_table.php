<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bc_analytics_events', function (Blueprint $table) {
            $table->uuid('event_id')->primary();
            $table->uuid('session_id');
            $table->uuid('user_id')->nullable();
            $table->string('event_type', 50);
            $table->string('screen_id', 50)->nullable();
            $table->string('module_code', 20)->nullable();
            $table->string('question_id', 50)->nullable();
            $table->timestamp('event_timestamp');
            $table->json('event_metadata')->nullable();
            $table->timestamps();

            $table->index('session_id');
            $table->index('event_type');
            $table->index('event_timestamp');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bc_analytics_events');
    }
};
