<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Treatment extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'type',
        'date',
        'description',
        'total_cost',
        'amount_paid',
        'notes',
    ];

    protected $casts = [
        'date' => 'date',
        'total_cost' => 'decimal:2',
        'amount_paid' => 'decimal:2',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
