<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification_table extends Model
{
    protected $table = 'Notification'; // Nom de la table avec majuscule
    public $timestamps = false; // Pas de created_at / updated_at

    protected $fillable = [
        'utilisateur_id',
        'message',
        'date_notification',
        'lu',
    ];

    /**
     * Relation avec le modèle Utilisateur
     */
    public function utilisateur(): BelongsTo
    {
        return $this->belongsTo(Utilisateur::class, 'utilisateur_id');
    }
}