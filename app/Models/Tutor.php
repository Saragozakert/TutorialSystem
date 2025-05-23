<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Tutor extends Authenticatable
{
    use HasFactory;

    protected $fillable = [
        'full_name', 'age', 'course', 'year_level',
        'subjects', 'payment_method', 'email',
        'teaching_method', 'goal', 'username', 'password'
    ];

    protected $hidden = ['password'];

    protected $casts = [
        'subjects' => 'array',
    ];
}
