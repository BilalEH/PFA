<?php

namespace Database\Seeders;

use App\Enums\EventUserStatus;
use App\Models\EventUser;
use Illuminate\Database\Seeder;

class EventUserSeeder extends Seeder
{
    public function run(): void
    {
        EventUser::create([
            'event_id' => 1,
            'user_id' => 1,
            'status' => EventUserStatus::REGISTERED,
            'registered_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        EventUser::create([
            'event_id' => 1,
            'user_id' => 2,
            'status' => EventUserStatus::ATTENDED,
            'registered_at' => now()->subDays(2),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        EventUser::create([
            'event_id' => 2,
            'user_id' => 1,
            'status' => EventUserStatus::REGISTERED,
            'registered_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}