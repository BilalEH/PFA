<?php

namespace Database\Seeders;

use App\Enums\ApplicationStatus;
use App\Models\application;
use Illuminate\Database\Seeder;

class ApplicationSeeder extends Seeder
{
    public function run(): void
    {
        Application::create([
            'user_id' => 1,
            'club_id' => 2,
            'motivation' => 'Excited to join the Robotics Club to learn more about automation.',
            'answers' => ['question1' => 'Answer 1', 'question2' => 'Answer 2'],
            'status' => ApplicationStatus::PENDING,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Application::create([
            'user_id' => 3,
            'club_id' => 1,
            'motivation' => 'Interested in contributing to the Coding Club.',
            'answers' => ['question1' => 'Answer A', 'question2' => 'Answer B'],
            'status' => ApplicationStatus::INTERVIEW_SCHEDULED,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}