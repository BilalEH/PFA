<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobSystem extends Model
{
    // Configuration pour gérer les 3 tables en un seul modèle (non conventionnel)
    protected $table = null; // Sera dynamique
    
    public function __construct(array $attributes = [], $table = null)
    {
        parent::__construct($attributes);
        $this->setTable($table);
    }

    // Configuration commune
    public $timestamps = false;
    
    // Maps les colonnes pour chaque table
    protected static $tableSchemas = [
        'jobs' => [
            'fillable' => ['queue', 'payload', 'attempts', 'reserved_at', 'available_at', 'created_at'],
            'casts' => [
                'payload' => 'array',
                'reserved_at' => 'datetime',
                'available_at' => 'datetime',
                'created_at' => 'datetime'
            ]
        ],
        
        'job_batches' => [
            'fillable' => ['id', 'name', 'total_jobs', 'pending_jobs', 'failed_jobs', 
                         'failed_job_ids', 'options', 'cancelled_at', 'created_at', 'finished_at'],
            'casts' => [
                'options' => 'array',
                'failed_job_ids' => 'array',
                'created_at' => 'datetime',
                'finished_at' => 'datetime'
            ],
            'incrementing' => false,
            'keyType' => 'string'
        ],
        
        'failed_jobs' => [
            'fillable' => ['uuid', 'connection', 'queue', 'payload', 'exception', 'failed_at'],
            'casts' => [
                'payload' => 'array',
                'failed_at' => 'datetime'
            ]
        ]
    ];

    // Surcharge dynamique
    public function setTable($table)
    {
        if (array_key_exists($table, self::$tableSchemas)) {
            $this->table = $table;
            $this->fillable = self::$tableSchemas[$table]['fillable'];
            $this->casts = self::$tableSchemas[$table]['casts'] ?? [];
            
            if (isset(self::$tableSchemas[$table]['incrementing'])) {
                $this->incrementing = self::$tableSchemas[$table]['incrementing'];
            }
            
            if (isset(self::$tableSchemas[$table]['keyType'])) {
                $this->keyType = self::$tableSchemas[$table]['keyType'];
            }
        }
        
        return $this;
    }
}