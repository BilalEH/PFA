<?php

namespace Database\Seeders;

use App\Models\Feedback;
use Illuminate\Database\Seeder;

class FeedbackSeeder extends Seeder
{
    public function run(): void
    {
        Feedback::create([
            'event_id' => 1,
            'user_id' => 2,
            'rating' => 5,
            'comment' => 'Amazing event, learned a lot!',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Feedback::create([
            'event_id' => 1,
            'user_id' => 1,
            'rating' => 4,
            'comment' => 'Great competition, but needed more time.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}