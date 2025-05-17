<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Personal_access_tokens_table extends Model
{
    protected $table = 'personal_access_tokens';
    
    protected $fillable = [
        'tokenable_type',
        'tokenable_id',
        'name',
        'token',
        'abilities',
        'last_used_at',
        'expires_at',
    ];

    /**
     * Relation polymorphe vers les entités "tokenables"
     */
    public function tokenable(): MorphTo
    {
        return $this->morphTo();
    }
}