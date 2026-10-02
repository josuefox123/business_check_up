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
        Schema::create('bc_appointments', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('diagnostic_run_id')->constrained('bc_diagnostic_runs')->cascadeOnDelete();

            $table->uuid('user_id');

            $table->string('rdv_type');              // orientation, urgent_stabilization, finance_viability…
            $table->string('priority')->default('normal');   // normal | urgent
            $table->string('status')->default('requested');  // requested | confirmed | cancelled | completed

            // Ce que l'utilisateur a demandé
            $table->dateTime('requested_starts_at');         // créneau choisi parmi les dispos affichées
            // $table->string('mode');                          // visio | phone | in_person
            $table->string('main_question', 500)->nullable();

            // Ce que l'admin confirme
            $table->dateTime('confirmed_starts_at')->nullable();
            $table->string('meeting_link')->nullable();
            $table->string('location')->nullable();
            $table->text('admin_notes')->nullable();

            $table->timestamps();

            $table->index(['status', 'requested_starts_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bc_appointments');
    }
};
