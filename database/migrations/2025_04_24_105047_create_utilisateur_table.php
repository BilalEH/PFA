<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('Utilisateur', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nom', 100);
            $table->string('email', 100)->unique();
            $table->string('mot_de_passe', 255);
            $table->enum('role', ['utilisateur', 'candidat', 'adminClub', 'adminSysteme'])->default('utilisateur');
            $table->timestamp('date_creation')->useCurrent();
        });
    }

    public function down()
    {
        Schema::dropIfExists('Utilisateur');
    }
};