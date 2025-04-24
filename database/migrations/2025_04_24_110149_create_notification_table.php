<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('Notification', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('utilisateur_id');
            $table->text('message');
            $table->timestamp('date_notification')->useCurrent();
            $table->boolean('lu')->default(false);
            
            $table->foreign('utilisateur_id')->references('id')->on('Utilisateur');
        });
    }

    public function down()
    {
        Schema::dropIfExists('Notification');
    }
};