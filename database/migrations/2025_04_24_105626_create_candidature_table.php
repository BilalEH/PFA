<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('Candidature', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('utilisateur_id');
            $table->unsignedInteger('club_id');
            $table->timestamp('date_candidature')->useCurrent();
            $table->enum('statut', ['en_attente', 'acceptee', 'refusee'])->default('en_attente');
            
            $table->foreign('utilisateur_id')->references('id')->on('Utilisateur');
            $table->foreign('club_id')->references('id')->on('Club');
        });
    }

    public function down()
    {
        Schema::dropIfExists('Candidature');
    }
};