<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Candidature_table extends Model
{
    protected $table = 'Candidature'; // Nom exact de la table (avec majuscule)
    public $timestamps = false; // car pas de champs created_at / updated_at

    protected $fillable = [
        'utilisateur_id',
        'club_id',
        'date_candidature',
        'statut',
    ];

    /**
     * Relation vers le modèle Utilisateur
     */
    public function utilisateur(): BelongsTo
    {
        return $this->belongsTo(Utilisateur::class, 'utilisateur_id');
    }

    /**
     * Relation vers le modèle Club
     */
    public function club(): BelongsTo
    {
        return $this->belongsTo(Club::class, 'club_id');
    }
}