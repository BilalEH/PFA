<?php

namespace Database\Seeders;

use App\Enums\ClubUserRole;
use App\Models\ClubUser;
use Illuminate\Database\Seeder;

class ClubUserSeeder extends Seeder
{
    public function run(): void
    {
        ClubUser::create([
            'club_id' => 1,
            'user_id' => 1,
            'role' => ClubUserRole::MEMBER,
            'joined_at' => '2025-01-01',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        ClubUser::create([
            'club_id' => 1,
            'user_id' => 2,
            'role' => ClubUserRole::PRESIDENT,
            'joined_at' => '2025-01-01',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        ClubUser::create([
            'club_id' => 2,
            'user_id' => 1,
            'role' => ClubUserRole::MEMBER,
            'joined_at' => '2025-02-01',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}