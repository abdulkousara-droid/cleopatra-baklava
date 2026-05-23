<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('settings')->insert([
            [
                'key' => 'email_heading',
                'value' => 'Welcome to the Inner Circle.',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'key' => 'email_body',
                'value' => "Dear Connoisseur,\n\nWe are delighted to welcome you into the heart of Cleopatra Baklava — where centuries-old recipes meet European artistry. From the pistachio-laden valleys of Gaziantep to the sun-drenched workshops of Barcelona, every piece we craft is a quiet act of devotion.\n\nAs a treasured member of our Inner Circle, you will be the first to receive exclusive invitations, seasonal collection reveals, and tastings.",
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'key' => 'email_features',
                'value' => json_encode([
                    ['icon' => '🌿', 'title' => 'All-Natural Ingredients', 'text' => 'We source only organic wildflower honey, first-harvest Gaziantep pistachios, and pure cultured butter — never shortcuts.'],
                    ['icon' => '🏛️', 'title' => 'Ancient Techniques', 'text' => 'Our master pastry chefs hand-roll each layer of phyllo to translucent perfection — a tradition unchanged for four centuries.'],
                    ['icon' => '📦', 'title' => 'Express Delivery', 'text' => 'Same-day delivery available in Barcelona. Every order ships in our signature collector\'s gift box, ready to impress.'],
                ]),
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'key' => 'email_cta_text',
                'value' => 'Explore the Collection',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'key' => 'email_footer_address',
                'value' => "Carrer de les Flors 14, Barcelona, Spain\nhello@cleopatrabaklava.com · +34 93 123 4567",
                'created_at' => now(), 'updated_at' => now(),
            ],
        ]);

        DB::table('settings')->where('key', 'welcome_email_template')->delete();
    }

    public function down(): void
    {
        DB::table('settings')->whereIn('key', [
            'email_heading', 'email_body', 'email_features',
            'email_cta_text', 'email_footer_address',
        ])->delete();

        $template = '<!DOCTYPE html>...';
        DB::table('settings')->insert([
            'key' => 'welcome_email_template',
            'value' => $template,
            'created_at' => now(), 'updated_at' => now(),
        ]);
    }
};
