<?php

namespace App\Models;

use App\Enums\ApplicationStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Application extends Model
{
    protected $table = 'applications';

    protected $fillable = [
        'user_id',
        'club_id',
        'motivation',
        'status',
    ];

    protected $casts = [
        'status' => ApplicationStatus::class,
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function club(): BelongsTo
    {
        return $this->belongsTo(Club::class);
    }

    public function interviews()
    {
        return $this->hasMany(Interview::class, 'application_id');
    }
}