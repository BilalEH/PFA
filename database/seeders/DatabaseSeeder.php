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
            ApplicationSeeder::class,
            EventSeeder::class,
            FeedbackSeeder::class,
            InterviewSeeder::class,
            NotificationSeeder::class,
        ]);
    }
}