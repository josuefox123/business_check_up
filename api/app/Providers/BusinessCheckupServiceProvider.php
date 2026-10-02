<?php

namespace App\Providers;

use App\Services\Restitution\RestitutionEngine;
use App\Services\Routing\TriageRouter;
use App\Services\Scoring\ScoringEngine;
use Illuminate\Support\ServiceProvider;


class BusinessCheckupServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->mergeConfigFrom(
            config_path('business-checkup.php'),
            'business-checkup'
        );

        $this->app->singleton(ScoringEngine::class, function ($app) {
            return new ScoringEngine(config('business-checkup.scoring'));
        });

        $this->app->singleton(TriageRouter::class, function ($app) {
            return new TriageRouter(config('business-checkup.routing'));
        });

        $this->app->singleton(RestitutionEngine::class, function ($app) {
            return new RestitutionEngine(config('business-checkup.restitution'));
        });
    }

    public function boot(): void
    {
        // $this->loadMigrationsFrom(__DIR__ . '/../database/migrations');
        // $this->loadRoutesFrom(__DIR__ . '/../routes/api.php');

        // if ($this->app->runningInConsole()) {
        //     $this->publishes([
        //         __DIR__ . '/../config/business-checkup.php' => config_path('business-checkup.php'),
        //     ], 'business-checkup-config');

        //     $this->publishes([
        //         __DIR__ . '/../database/migrations' => database_path('migrations'),
        //     ], 'business-checkup-migrations');

        //     $this->publishes([
        //         __DIR__ . '/../database/seeders' => database_path('seeders'),
        //     ], 'business-checkup-seeders');
        // }
    }
}
