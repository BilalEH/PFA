<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->enum('user_type', ['student', 'club_admin', 'system_admin'])->default('student');
            $table->string('student_id')->nullable();
            $table->string('profile_image')->nullable();
            $table->string('branch')->nullable(); // Changed from 'major' to match frontend
            $table->string('year_of_study')->nullable(); // Changed to string to match frontend dropdown
            $table->string('phone_number')->nullable();
            $table->text('bio')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('users');
    }
}