<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Métadonnées spécifiques aux questions d'enrichissement (REQ).
     * Relation 1-1 avec bc_questions — n'existe que pour question_kind = 'enrichment'.
     * Ces champs décrivent COMMENT la réponse alimente le rapport augmenté
     * et la préparation du RDV, sans jamais toucher au scoring ni au routage.
     */
    public function up(): void
    {
        Schema::create('bc_question_enrichment_meta', function (Blueprint $table) {
            $table->id();
            $table->string('question_db_id'); // ID bc_question

            // Affichage
            $table->string('display_moment', 150)->nullable();      // ex. "Avant la génération du rapport"
            $table->text('display_condition')->nullable();          // ex. "Afficher si demande de suivi"

            // Rapport augmenté
            $table->text('report_sections')->nullable();            // sections alimentées, séparées par |
            $table->text('ai_usage')->nullable();                   // angle narratif pour l'IA
            $table->text('recommendation_effect')->nullable();      // effet autorisé (formulation, ordre…)

            // Rendez-vous
            $table->text('rdv_trigger')->nullable();                // déclencheur de RDV
            $table->string('rdv_type', 150)->nullable();            // type de RDV suggéré
            $table->text('data_to_prepare')->nullable();            // données/pièces à préparer

            // Gouvernance donnée
            $table->string('sensitivity', 20)->nullable();          // faible | moyenne | élevée
            $table->text('ux_note')->nullable();
            $table->string('dev_field', 100)->nullable();           // ex. "field: req_tri_trigger_reason"

            $table->timestamps();

            $table->unique('question_db_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bc_question_enrichment_meta');
    }
};
