<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Instructor;
use App\Models\Learner;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::create([
            'fname' => 'Super',
            'mname' => '',
            'lname' => 'Admin',
            'email' => 'super.admin@gmail.com',
            'password' => bcrypt('password'),
            'bday' => '1990-01-01',
            'phone' => '1234567890',
            'status' => 'active',
            'category' => 'admin',
            'username' => 'superadmin',
            'profile_picture' => null,

        ]);

        $learner = User::create([
            'fname' => 'User',
            'mname' => '',
            'lname' => 'Learner',
            'email' => 'learner1@gmail.com',
            'password' => bcrypt('password'),
            'bday' => '2000-01-01',
            'phone' => '0987654321',
            'category' => 'learner',
            'username' => 'learner1',
            'profile_picture' => null,
            'status' => 'active',
        ]);

        $instructor = User::create([
            'fname' => 'User',
            'mname' => '',
            'lname' => 'Instructor',
            'email' => 'instructor1@gmail.com',
            'bday' => '1990-01-01',
            'password' => bcrypt('password'),
            'phone' => '12345690800',
            'category' => 'instructor',
            'username' => 'instructor1',
            'profile_picture' => null,
            'status' => 'active',
        ]);


        $learnerDetails = Learner::create([
            'user_id' => $learner->id,
            'course' => 'Computer Science',
            'enrollment_date' => now(),
            'student_number' => 'CS2025001',
        ]);

        $instructorDetails = Instructor::create([
            'user_id' => $instructor->id,
            'instructor_code' => 'INS2025001',
            'date_started' => now(),
            'instructor_type' => 'full-time',
        ]);

        $adminDetails = Admin::create([
            'user_id' => $admin->id,
            'admin_code' => 'ADM2025001',
        ]);
    }
}
