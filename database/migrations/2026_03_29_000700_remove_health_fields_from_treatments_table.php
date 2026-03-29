<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('treatments', function (Blueprint $table) {
            $table->dropColumn([
                'allergies',
                'medical_conditions',
                'maintenance',
            ]);
        });
    }

    public function down(): void
    {
        Schema::table('treatments', function (Blueprint $table) {
            $table->text('allergies')->nullable()->after('description');
            $table->text('medical_conditions')->nullable()->after('allergies');
            $table->text('maintenance')->nullable()->after('medical_conditions');
        });
    }
};
