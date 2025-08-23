<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Instructor extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'instructor_code',
        'date_started',
        'instructor_type',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
