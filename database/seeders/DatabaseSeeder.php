<?php

namespace Database\Seeders;

use App\Models\Categories;
use App\Models\Products;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $categories = ['Baklava', 'Kunafa', 'Mamoul', 'Traditional', 'Gift Boxes'];

        foreach ($categories as $category) {
            Categories::firstOrCreate(['name' => $category]);
        }

        Products::factory(20)->create();

        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@cleopatrabaklava.com',
            'password' => bcrypt('azeAZE12'),
        ]);
    }
}
