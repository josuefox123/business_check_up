<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bc_user_profiles', function (Blueprint $table) {
            $table->uuid('user_id')->primary();
            $table->string('user_profile_type', 50);
            $table->string('full_name', 255)->nullable();
            $table->string('phone_number', 50)->nullable();
            $table->string('whatsapp_number', 50)->nullable();
            $table->string('email', 191)->nullable();
            $table->string('preferred_contact_channel', 50)->nullable();
            $table->string('role_in_business', 50)->nullable();
            $table->string('gender_optional', 50)->nullable();
            $table->string('age_range_optional', 50)->nullable();
            $table->string('institution_name', 255)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bc_user_profiles');
    }
};
