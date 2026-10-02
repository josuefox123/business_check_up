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
        Schema::create('bc_questions', function (Blueprint $table) {
            // $table->id('question_db_id');          // ID interne auto-incrémenté
            $table->string('question_id', 50)->primary();       // ID technique ex: FIN-07-Q01
            $table->string('module_code', 20);         // Module associé
            $table->integer('order')->default(0);      // Ordre d'affichage
            $table->string('role', 50);                // Rôle métier
            $table->string('dimension', 50)->nullable(); // Dimension analysée
            $table->text('text');                      // Texte de la question
            $table->text('helper_text')->nullable();   // Texte d'aide
            $table->string('answer_type', 50);         // single_choice, multi_choice, scale_1_5, etc.
            $table->boolean('answer_ia')->default(false);
            $table->json('options');                   // Options de réponse
            $table->string('score_logic', 50)->nullable(); // direct, inverse, no_score, etc.
            $table->decimal('weight', 3, 2)->default(1.0); // Pondération
            $table->boolean('evidence_required')->default(false);
            $table->text('evidence_prompt')->nullable();
            $table->string('default_evidence_level', 20)->nullable();
            $table->json('red_flag_conditions')->nullable(); // Conditions de red flag
            $table->json('followup_trigger')->nullable();    // Déclencheur de relance
            $table->string('next_question_logic', 50)->default('sequential'); // sequential, route_by_value, end_diagnostic
            $table->string('next_module_hint', 20)->nullable(); // Module recommandé ensuite
            $table->string('version', 10)->default('v1.0');
            $table->boolean('is_active')->default(true);
            $table->boolean('is_required')->default(true);


            $table->string('question_kind', 20)->default('diagnostic')->index(); // 'diagnostic' | 'enrichment'
            $table->string('req_level', 20)->nullable(); // 'core' | 'conditional' (REQ uniquement)

            $table->timestamps();

            $table->unique(['question_id', 'version']);
            $table->index('module_code');
            $table->index('order');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bc_questions');
    }
};
