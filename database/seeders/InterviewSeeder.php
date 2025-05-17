<?php

namespace Database\Seeders;

use App\Enums\InterviewStatus;
use App\Models\Interview;
use Illuminate\Database\Seeder;

class InterviewSeeder extends Seeder
{
    public function run(): void
    {
        Interview::create([
            'application_id' => 2,
            'interviewer_id' => 2,
            'scheduled_at' => '2025-06-10 09:30:00',
            'location' => 'Club Office',
            'meeting_link' => null,
            'status' => InterviewStatus::SCHEDULED,
            'feedback' => null,
            'rating' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Interview::create([
            'application_id' => 1,
            'interviewer_id' => 2,
            'scheduled_at' => '2025-06-12 14:30:00',
            'location' => null,
            'meeting_link' => 'https://zoom.us/j/987654321',
            'status' => InterviewStatus::SCHEDULED,
            'feedback' => null,
            'rating' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}