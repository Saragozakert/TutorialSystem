<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('tutor_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('student_roles');
            $table->foreignId('tutor_id')->constrained('tutors');
            $table->string('subject');
            $table->dateTime('schedule');
            $table->text('notes')->nullable();
            $table->string('status')->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tutor_requests');
    }
};
