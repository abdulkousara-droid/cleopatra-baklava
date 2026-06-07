<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        // Create admin user
        User::create([
            'name' => 'Admin',
            'email' => 'admin@cleopatrabaklava.com',
            'password' => 'azeAZE12',
            'email_verified_at' => now(),
        ]);

       $categories = ['Baklava', 'Kunafa', 'Mamoul', 'Traditional', 'Gift Boxes'];

       foreach ($categories as $category) {
            Category::firstOrCreate(['name' => $category]);
       }

       //Product::factory(20)->create();


    }
}
