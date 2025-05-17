<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Inscription_evenement_table extends Model
{
    protected $table = 'InscriptionEvenement'; // Nom exact de la table
    public $timestamps = false;

    protected $fillable = [
        'utilisateur_id',
        'evenement_id',
        'date_inscription',
    ];

    /**
     * Relation avec le modèle Utilisateur
     */
    public function utilisateur(): BelongsTo
    {
        return $this->belongsTo(Utilisateur::class, 'utilisateur_id');
    }

    /**
     * Relation avec le modèle Evenement
     */
    public function evenement(): BelongsTo
    {
        return $this->belongsTo(Evenement::class, 'evenement_id');
    }
}