<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Club extends Model
{
    protected $table = 'clubs';

    protected $fillable = [
        'name',
        'description',
        'rules',
        'logo',
        'cover_image',
        'is_active',
        'foundation_date',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'foundation_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }

    public function clubUsers(): HasMany
    {
        return $this->hasMany(ClubUser::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }

    public function interviewSlots(): HasMany
    {
        return $this->hasMany(InterviewSlot::class);
    }
}