<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentRole extends Model
{
    use HasFactory;

    protected $table = 'student_roles';

    protected $fillable = [
        'first_name',
        'last_name',
        'username',
        'password',
        'age',
        'course',
        'email',
        'goal',
    ];

    protected $hidden = [
        'password', // Hide password from JSON responses
    ];
}
