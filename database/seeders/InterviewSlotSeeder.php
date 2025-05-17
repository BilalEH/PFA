<?php

namespace Database\Seeders;

use App\Models\InterviewSlot;
use Illuminate\Database\Seeder;

class InterviewSlotSeeder extends Seeder
{
    public function run(): void
    {
        InterviewSlot::create([
            'club_id' => 1,
            'start_time' => '2025-06-10 09:00:00',
            'end_time' => '2025-06-10 10:00:00',
            'max_interviews' => 2,
            'booked_interviews' => 1,
            'location' => 'Club Office',
            'is_online' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        InterviewSlot::create([
            'club_id' => 2,
            'start_time' => '2025-06-12 14:00:00',
            'end_time' => '2025-06-12 15:00:00',
            'max_interviews' => 1,
            'booked_interviews' => 0,
            'location' => null,
            'is_online' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}