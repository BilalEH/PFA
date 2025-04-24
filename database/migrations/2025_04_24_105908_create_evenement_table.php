<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('Evenement', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('club_id');
            $table->string('titre', 150);
            $table->text('description');
            $table->date('date_evenement');
            $table->timestamp('date_creation')->useCurrent();
            
            $table->foreign('club_id')->references('id')->on('Club');
        });
    }

    public function down()
    {
        Schema::dropIfExists('Evenement');
    }
};