<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'date_of_birth',
        'address',
        'allergies',
        'medical_conditions',
        'maintenance',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
    ];

    public function treatments()
    {
        return $this->hasMany(Treatment::class);
    }
}
