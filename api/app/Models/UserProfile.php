<?php

namespace App\Models;

use App\Enums\UserProfileType;
use App\Models\BusinessProfile;
use App\Models\DiagnosticRun;
use App\Models\FollowUpLead;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UserProfile extends Model
{
    protected $table = 'bc_user_profiles';

    protected $primaryKey = 'user_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'user_id',
        'user_profile_type',
        'full_name',
        'phone_number',
        'whatsapp_number',
        'email',
        'preferred_contact_channel',
        'role_in_business',
        'gender_optional',
        'age_range_optional',
        'institution_name',
    ];

    protected $casts = [
        'user_profile_type' => UserProfileType::class,
    ];

    public function businessProfiles(): HasMany
    {
        return $this->hasMany(BusinessProfile::class, 'user_id', 'user_id');
    }

    public function diagnosticRuns(): HasMany
    {
        return $this->hasMany(DiagnosticRun::class, 'user_id', 'user_id');
    }

    public function followUpLeads(): HasMany
    {
        return $this->hasMany(FollowUpLead::class, 'user_id', 'user_id');
    }

    public function isEntrepreneur(): bool
    {
        return $this->user_profile_type !== UserProfileType::INSTITUTIONAL_CURIOUS;
    }
}
