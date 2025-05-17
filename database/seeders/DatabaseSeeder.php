<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            ClubSeeder::class,
            ClubUserSeeder::class,
            ApplicationSeeder::class,
            EventSeeder::class,
            EventUserSeeder::class,
            FeedbackSeeder::class,
            InterviewSlotSeeder::class,
            InterviewSeeder::class,
            NotificationSeeder::class,
        ]);
    }
}