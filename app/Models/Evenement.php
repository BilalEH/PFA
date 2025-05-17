<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evenement extends Model
{
    use HasFactory;

    /**
     * Nom de la table (respecte la casse exacte)
     */
    protected $table = 'Evenement';

    /**
     * Désactive les timestamps automatiques
     */
    public $timestamps = false;

    /**
     * Attributs modifiables
     */
    protected $fillable = [
        'club_id',
        'titre',
        'description',
        'date_evenement',
        'date_creation'
    ];

    /**
     * Conversions de type
     */
    protected $casts = [
        'date_evenement' => 'date',
        'date_creation' => 'datetime'
    ];

    /**
     * Relation avec le modèle Club
     */
    public function club()
    {
        return $this->belongsTo(Club::class, 'club_id');
    }
}