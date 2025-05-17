<?php

namespace Database\Seeders;

use App\Models\Event;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        Event::create([
            'club_id' => 1,
            'title' => 'CodeFest 2025',
            'description' => 'A coding competition for all students.',
            'start_date' => '2025-06-01 10:00:00',
            'end_date' => '2025-06-01 16:00:00',
            'location' => 'Campus Hall A',
            'meeting_link' => null,
            'cover_image' => 'codefest_cover.jpg',
            'max_participants' => 50,
            'is_public' => true,
            'requires_registration' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Event::create([
            'club_id' => 2,
            'title' => 'Robotics Workshop',
            'description' => 'Hands-on robotics building session.',
            'start_date' => '2025-06-15 14:00:00',
            'end_date' => '2025-06-15 17:00:00',
            'location' => null,
            'meeting_link' => 'https://zoom.us/j/123456789',
            'cover_image' => 'robotics_workshop_cover.jpg',
            'max_participants' => 30,
            'is_public' => false,
            'requires_registration' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}