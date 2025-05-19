<?php

namespace Database\Seeders;

use App\Enums\UserType;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john.doe@example.com',
            'password' => Hash::make('password'),
            'user_type' => UserType::STUDENT,
            'student_id' => 'STU001',
            'branch' => 'Computer Science',
            'year_of_study' => 2,
            'phone_number' => '1234567890',
            'bio' => 'Passionate about coding and clubs.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        User::create([
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'email' => 'jane.smith@example.com',
            'password' => Hash::make('password'),
            'user_type' => UserType::CLUB_ADMIN,
            'student_id' => 'STU002',
            'branch' => 'Engineering',
            'year_of_study' => 3,
            'phone_number' => '0987654321',
            'bio' => 'Club administrator and event organizer.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        User::create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'user_type' => UserType::SYSTEM_ADMIN,
            'phone_number' => '5555555555',
            'bio' => 'System administrator.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}