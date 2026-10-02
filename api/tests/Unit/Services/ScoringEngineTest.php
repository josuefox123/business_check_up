<?php

namespace Tests\Unit\Services;

use FundLab\BusinessCheckup\Services\Scoring\ScoringEngine;
use FundLab\BusinessCheckup\Enums\ScoreBand;
use FundLab\BusinessCheckup\Enums\EvidenceLevel;
use PHPUnit\Framework\TestCase;

class ScoringEngineTest extends TestCase
{
    private ScoringEngine $engine;

    protected function setUp(): void
    {
        $this->engine = new ScoringEngine();
    }

    public function test_scr01_conversion_formula(): void
    {
        // score_0_100 = ROUND(((score_1_5 - 1) / 4) * 100, 0)
        $this->assertEquals(0, $this->engine->convertToDisplayScore(1.0));
        $this->assertEquals(25, $this->engine->convertToDisplayScore(2.0));
        $this->assertEquals(50, $this->engine->convertToDisplayScore(3.0));
        $this->assertEquals(75, $this->engine->convertToDisplayScore(4.0));
        $this->assertEquals(100, $this->engine->convertToDisplayScore(5.0));
    }

    public function test_scr14_banding(): void
    {
        $this->assertEquals(ScoreBand::CRITICAL, $this->engine->determineScoreBand(35));
        $this->assertEquals(ScoreBand::FRAGILE, $this->engine->determineScoreBand(36));
        $this->assertEquals(ScoreBand::STABLE, $this->engine->determineScoreBand(56));
        $this->assertEquals(ScoreBand::SOLID, $this->engine->determineScoreBand(71));
        $this->assertEquals(ScoreBand::ADVANCED, $this->engine->determineScoreBand(86));
    }

    public function test_scr12_credibility_calculation(): void
    {
        // score_credible = score_declared * evidence_factor
        $this->assertEquals(3.5, $this->engine->calculateCredibilizedScore(5.0, EvidenceLevel::E0_DECLARATIVE));
        $this->assertEquals(4.25, $this->engine->calculateCredibilizedScore(5.0, EvidenceLevel::E1_CONCRETE_INDICE));
        $this->assertEquals(4.75, $this->engine->calculateCredibilizedScore(5.0, EvidenceLevel::E2_DOCUMENT_AVAILABLE));
        $this->assertEquals(5.0, $this->engine->calculateCredibilizedScore(5.0, EvidenceLevel::E3_VERIFIABLE_DATA));
    }
}
