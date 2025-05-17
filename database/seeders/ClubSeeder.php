<?php

namespace Database\Seeders;

use App\Models\Club;
use Illuminate\Database\Seeder;

class ClubSeeder extends Seeder
{
    public function run(): void
    {
        Club::create([
            'name' => 'Coding Club',
            'description' => 'A club for coding enthusiasts.',
            'rules' => 'Respect others, attend meetings.',
            'logo' => 'coding_club_logo.png',
            'cover_image' => 'coding_club_cover.jpg',
            'is_active' => true,
            'foundation_date' => '2023-01-15',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Club::create([
            'name' => 'Robotics Club',
            'description' => 'Building the future with robotics.',
            'rules' => 'Safety first, collaboration required.',
            'logo' => 'robotics_club_logo.png',
            'cover_image' => 'robotics_club_cover.jpg',
            'is_active' => true,
            'foundation_date' => '2022-09-10',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}