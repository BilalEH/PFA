<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Club extends Model
{
    use HasFactory;

    /**
     * Nom de la table (correspond exactement à la migration)
     */
    protected $table = 'Club';

    /**
     * Désactive les timestamps automatiques
     */
    public $timestamps = false;

    /**
     * Attributs modifiables
     */
    protected $fillable = [
        'nom',
        'description',
        'date_creation'
    ];

    /**
     * Conversions de type
     */
    protected $casts = [
        'date_creation' => 'datetime',
    ];

    /**
     * Clé primaire configurée selon la migration
     */
    protected $primaryKey = 'id';
    protected $keyType = 'integer';
    public $incrementing = true;
}