<?php

namespace App\Http\Controllers;

use App\Enums\ActivityStage;
use App\Enums\AnswerType;
use App\Enums\CompletionStatus;
use App\Enums\DominantTopic;
use App\Enums\EntryMode;
use App\Enums\EntrySource;
use App\Enums\EvidenceLevel;
use App\Enums\EvidenceType;
use App\Enums\ModuleFamily;
use App\Enums\ModuleStatus;
use App\Enums\OpportunityType;
use App\Enums\PrimaryNeed;
use App\Enums\RiskFlag;
use App\Enums\ScoreBand;
use App\Enums\SessionStatus;
use App\Enums\TimeAvailable;
use App\Enums\UserProfileType;
use App\Http\Controllers\Api\BaseController;
use Illuminate\Http\Request;

class ReferenceListeController extends BaseController
{
    public function referenceList(Request $request)
    {

        $data = [
            'activity_stage' => ActivityStage::optionsEndLabel(),
            'Answer_type' => AnswerType::optionsEndLabel(),
            'completion_status' => CompletionStatus::optionsEndLabel(),
            'dominant_topic' => DominantTopic::optionsEndLabel(),
            'entry_mode' => EntryMode::optionsEndLabel(),
            'entry_source' => EntrySource::optionsEndLabel(),
            'evidence_level' => EvidenceLevel::optionsEndLabel(),
            'evidence_type' => EvidenceType::optionsEndLabel(),
            'module_family' => ModuleFamily::optionsEndLabel(),
            'module_status' => ModuleStatus::optionsEndLabel(),
            'opporttunity_type' => OpportunityType::optionsEndLabel(),
            'primary_need' => PrimaryNeed::optionsEndLabel(),
            'risk_flag' => RiskFlag::optionsEndLabel(),
            'score_bang' => ScoreBand::optionsEndLabel(),
            'session_status' => SessionStatus::optionsEndLabel(),
            'tume_available' => TimeAvailable::optionsEndLabel(),
            'user_profile_type' => UserProfileType::optionsEndLabel(),
        ];

        return $data;
    }
}
