<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'users'; // Table associée

    /**
     * Les attributs assignables en masse.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'date_creation',
    ];

    /**
     * Les attributs cachés pour les tableaux.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Les attributs castés.
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'date_creation' => 'datetime',
    ];

    /**
     * 🔗 Relations :
     */

    public function sessions()
    {
        return $this->hasMany(Session::class, 'user_id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class, 'utilisateur_id');
    }

    public function candidatures()
    {
        return $this->hasMany(Candidature::class, 'utilisateur_id');
    }

    public function inscriptions()
    {
        return $this->hasMany(InscriptionEvenement::class, 'utilisateur_id');
    }
}
