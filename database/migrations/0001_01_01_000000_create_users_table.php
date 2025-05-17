<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\BluePrint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id(); // Primary key (auto-incrementing)
            $table->string('name', 100); // From 'nom' in Utilisateur
            $table->string('email', 100)->unique(); // From both tables
            $table->timestamp('email_verified_at')->nullable(); // From default users
            $table->string('password', 255); // From both (mot_de_passe renamed to password)
            $table->enum('role', ['utilisateur', 'candidat', 'adminClub', 'adminSysteme'])->default('utilisateur'); // From Utilisateur
            $table->timestamp('date_creation')->useCurrent(); // From Utilisateur
            $table->rememberToken(); // For Laravel authentication
            $table->timestamps(); // created_at and updated_at

            // Optional: Indexes for performance
            $table->index('email');
            $table->index('role');
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index()->constrained()->onDelete('cascade');
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};