<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('InscriptionEvenement', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('utilisateur_id');
            $table->unsignedInteger('evenement_id');
            $table->timestamp('date_inscription')->useCurrent();
            
            $table->foreign('utilisateur_id')->references('id')->on('Utilisateur');
            $table->foreign('evenement_id')->references('id')->on('Evenement');
        });
    }

    public function down()
    {
        Schema::dropIfExists('InscriptionEvenement');
    }
};