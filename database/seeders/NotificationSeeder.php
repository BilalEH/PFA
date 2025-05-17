<?php

namespace Database\Seeders;

use App\Models\Notification;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        Notification::create([
            'user_id' => 1,
            'title' => 'Application Submitted',
            'message' => 'Your application to Robotics Club has been submitted.',
            'type' => 'application',
            'link' => '/applications/1',
            'is_read' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Notification::create([
            'user_id' => 2,
            'title' => 'Event Registration',
            'message' => 'You are registered for CodeFest 2025.',
            'type' => 'event',
            'link' => '/events/1',
            'is_read' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}