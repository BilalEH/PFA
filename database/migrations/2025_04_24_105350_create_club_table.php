<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('Club', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nom', 100);
            $table->text('description');
            $table->timestamp('date_creation')->useCurrent();
        });
    }

    public function down()
    {
        Schema::dropIfExists('Club');
    }
};