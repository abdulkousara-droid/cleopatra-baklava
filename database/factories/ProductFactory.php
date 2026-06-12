<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    private static array $imageMap = [
        'Gift Boxes'  => 'https://lh3.googleusercontent.com/aida-public/AB6AXuAI2c3WNcm5Mbi8S6fE11yJC21B4uurKolTmvEwohxNHO5SyvrpUp0lcCV2APb2odMrng9glfWc_EovgzjZ8NvVoa7oMGk0etoA4dsXg6KQeWRkfEuwWglmDs_SkoEp1BUdFf7hgssyY3npobonNDcLHji2GUByEsl6u2g5sddaeaZi0swt-yxyg5XWh4PACQZXWPUkDM_JuQ-UcDn79WDb8J71vZhu7yLtZlY1coeQKE7hTWe3tr02jrPxGsacHp5pfpmEwGAJ7vUv',
        'Kunafa'      => 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdFRfB7QbF0209oPzIlBaryseFx2Tnwdw8t8BHmipdZb4DRaFht019gDQOaHo4io52KH9Auj14lzNhQ9VskcEQG5zfK0kHKlNHX6MJAA3-nxWfGFek5ZfWHUxcVJkjG7LHUit25Yc3cs5vLVYbKH1jiuotiqnygcHu1uDhlQM7I6asVfw_uNSqXJhcDr8g66epCmSeWMV2aJICrKZFTvCGm6p8-ldhoTgbhdmWV5nSNd_qkY2P5Nysd2NQJ2pYhhiSiZ0bdzUBEKxE',
        'Baklava'     => 'https://lh3.googleusercontent.com/aida-public/AB6AXuAr7oUeiDwawXvMBSkdwibegtOpxuGcHN0RmvJGEfb0Yi1ku4beGuuA1Xg4cWDLLdTQyR824mQZBSrDjvwoDpI91aOlwB4zVcUfw92ZJ3Ecu7rxRdVI1vQdmIFr0khBeycalzMLZios-ft4F5PJqqV2vWR5hxP3W2PAD2dkTFbo7344rTc3WIctBaffGYiYCwtkl-UpnEapRznbr-ie2icWnnOKDPDQFYDmI8Gh9I-foBRRKcsYxHN3UfFkZOQ55s4bm97lSKjwAgf7',
        'Mamoul'      => 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAiFP-LDB1Zln5IBYE1MpGc9ubHb09MdlPmuPqiKabr1bbMMo2xIGP6oSqL9Bc8UdC4ItgEpDuovh5NKLOzPkh4ZOpq9vygyEnD7jyijWXo5O0pxJxDIjWADIS8FXzdALH_QiAhM66NpRBWMEy_m0ujVdRRWLhK7pLA2jQ6heIXQ2g4jrDSQeTQWUCcv6kRP3ntB8pMd_tObVM6eVc94BCwnHNwL9ZcWYMyb31RnzyXeCM9yn63isUl_Pdp8cvGMobQJAVn50G-UGy',
        'Traditional' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuAr7oUeiDwawXvMBSkdwibegtOpxuGcHN0RmvJGEfb0Yi1ku4beGuuA1Xg4cWDLLdTQyR824mQZBSrDjvwoDpI91aOlwB4zVcUfw92ZJ3Ecu7rxRdVI1vQdmIFr0khBeycalzMLZios-ft4F5PJqqV2vWR5hxP3W2PAD2dkTFbo7344rTc3WIctBaffGYiYCwtkl-UpnEapRznbr-ie2icWnnOKDPDQFYDmI8Gh9I-foBRRKcsYxHN3UfFkZOQ55s4bm97lSKjwAgf7',
    ];

    private static array $productNames = [
        'Classic Baklava Box', 'Pistachio Baklava', 'Walnut Baklava',
        'Mixed Nut Baklava', 'Honey Baklava', 'Royal Kunafa',
        'Cheese Kunafa', 'Chocolate Kunafa', 'Mini Kunafa Bites',
        'Mamoul Date Cookies', 'Mamoul Walnut Cookies', 'Mamoul Pistachio Cookies',
        'Luxury Gift Box', 'Premium Assorted Box', 'Wedding Gift Box',
        'Traditional Sweets Mix', 'Assorted Baklava Platter', 'Festive Sweet Box',
        'Rose Water Delight', 'Orange Blossom Pastry', 'Saffron Baklava',
        'Chocolate Dipped Baklava', 'Caramel Nut Pastry', 'Almond Honey Roll',
    ];

    private static int $nameIndex = 0;

    public function definition(): array
    {
        $category = Category::inRandomOrder()->first() ?? Category::factory()->create();

        $image = self::$imageMap[$category->name] ?? self::$imageMap['Baklava'];

        $name = self::$productNames[self::$nameIndex % count(self::$productNames)];
        self::$nameIndex++;

        return [
            'category_id'       => $category->id,
            'title'             => $name,
            //'price'             => $this->faker->randomElement([4.50, 8.00, 14.00, 28.00, 42.00]),
            'badge'             => $this->faker->randomElement(['New Collection', 'Best Seller', 'Premium Choice', null]),
            'description'       => 'A delicate hand-crafted luxury dessert prepared fresh daily.',
            'image'             => $image,
            'additional_images' => [
                'https://lh3.googleusercontent.com/aida-public/AB6AXuBFifCS-VkTYKmUlBwOg8pw24ypZc8HqCmM4E-shPKbUQhxA5DJ4jm2HFIeVJrc4QOZCFeF6c7w2NeAxhUo2v-DZoc-b4bifNDNzhVx5bZd2ldTw7IyNUs7qsxURhEcL_v6_C91cX9Je9poT82oaKz2nrBNHamtGB4haL0zUeqqpEfb4zjdHRfqvKSgwkPH7F9pVNkAr2R2q14aG4EKgRfjVDeujizUUaH2BOEJGNc1_HbkJSUUx0t18kPuNfK65-hbmp4puXlg6SDG',
            ],
            'tags'              => $this->faker->randomElement([
                ['Gaziantep Pistachios', 'Artisanal Butter'],
                ['Akkawi Cheese', 'Rose Water'],
                ['Premium Walnuts', 'Pure Honey'],
                ['Organic Almonds', 'Orange Blossom'],
            ]),
            'allergens'         => $this->faker->randomElement([
                ['Nuts (Pistachios)', 'Gluten (Wheat)', 'Dairy (Milk)'],
                ['Nuts (Almonds)', 'Dairy (Milk)'],
                ['Nuts (Walnuts)', 'Gluten (Wheat)'],
                ['Sesame', 'Dairy (Milk)'],
            ]),
            'reviews_count'     => $this->faker->numberBetween(12, 240),
            'rating_score'      => $this->faker->randomElement([4.7, 4.8, 4.9, 5.0]),
        ];
    }
}
