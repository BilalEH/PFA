<?php

namespace App\Models;

use App\Enums\UserType;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Contracts\Auth\MustVerifyEmail;

class User extends Authenticatable implements MustVerifyEmail
{
    protected $table = 'users';
    
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'user_type',
        'profile_image',
        'student_id',
        'branch',
        'year_of_study',
        'phone_number',
        'bio',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }

    public function clubUsers(): HasMany
    {
        return $this->hasMany(ClubUser::class);
    }

    public function eventUsers(): HasMany
    {
        return $this->hasMany(EventUser::class);
    }

    public function feedback(): HasMany
    {
        return $this->hasMany(Feedback::class);
    }

    public function interviews(): HasMany
    {
        return $this->hasMany(Interview::class, 'interviewer_id');
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }
}