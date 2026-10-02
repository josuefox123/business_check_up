<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ─── 1. Utilisateur Admin par defaut ───
        User::create([
            'id'                 => (string) Str::uuid(),
            'first_name'         => 'Yanick',
            'last_name'          => 'AKOHA',
            'email'              => 'nicktep519@gmail.com',
            'phone'              => '+2290191092037',
            'email_verified_at'  => now(),
            'password'           => Hash::make('password'),
        ]);

        // ─── 2. Utilisateur de test ───
        User::create([
            'id'                 => (string) Str::uuid(),
            'first_name'         => 'Jean',
            'last_name'          => 'Dupont',
            'email'              => 'jean.dupont@example.com',
            'phone'              => '+2290165372714',
            'email_verified_at'  => now(),
            'password'           => Hash::make('password'),
        ]);

        // ─── 3. Utilisateurs aleatoires via Faker ───
        // $faker = \Faker\Factory::create();

        // for ($i = 0; $i < 20; $i++) {
        //     User::create([
        //         'id'                 => (string) Str::uuid(),
        //         'first_name'         => $faker->firstName(),
        //         'last_name'          => $faker->lastName(),
        //         'email'              => $faker->unique()->safeEmail(),
        //         'phone'              => $faker->unique()->phoneNumber(),
        //         'email_verified_at'  => $faker->optional(0.8)->dateTimeBetween('-1 year', 'now'),
        //         'password'           => Hash::make('password'),
        //     ]);
        // }
    }
}
