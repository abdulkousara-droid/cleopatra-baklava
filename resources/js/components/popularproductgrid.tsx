import React from 'react';
import { Plus, Star } from 'lucide-react';

const BESTSELLERS_DATA = [
    {
        id: 5,
        title: 'Assorted Baklava Box',
        price: '€22.00',
        description: 'A curated selection of our twelve most beloved diamond and nest varieties.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlpS4jk_VytK8WUUfdRnLgOQu6dnawrOk-7qWbklsW8-r5aWyPiA-krhP3hB2lzdnRaKtgDVZGI7QOoJU48lcqaRt2TAjvady2fgqnw6gBj12neCskaaobmI70s3XE8fbfsSXVkAxhvpIWJwnJ_Z7TLUfwsiiywxZOUKQY1VDSZuPDhdYgwmsUI4Kp2jusIoQwpv24D8PY6raVkjrPW-VNRy5D48ef1wcM3o8arFkHxSXUmM4WpjF_hN3RzUO8Yc7rKuLatS062ca8',
        rating: '4.9',
        reviewsCount: 124,
        alt: 'Premium luxury assorted baklava mixed box tray presentation over marble background'
    },
    {
        id: 6,
        title: 'Pistachio Baklava',
        price: '€4.50',
        description: 'Pure Antep pistachios layered between 40 sheets of paper-thin filo pastry.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJayJnbxNhV8yodAL0vjwDqMvUP5OEOecfjP9fksYfuNJwRW8PCNuJ7zd_52OFO4ABOa8McTEf7Xv2lEq-My1sT_QQ7VcUMLmSwEJ5GXl86J8IuI95O_q1khKrE9iWxSY2qxDAHhjBtakXHArDNKMqzGbf6mKfxux3nu1cgg6AV4u8UFmLei7jnoRY3gVH-A9sPy9vW6R83bORfHcpRYMCIi66iY-SH_kQ2sdRdATkWCQaaq0D-xRe8tcod1I7CaMvBcfOQCbBS657',
        rating: '4.8',
        reviewsCount: 89,
        alt: 'Macro golden crisp pistachio baklava square crisp block slice'
    },
    {
        id: 7,
        title: 'Kunafa bil Jibn',
        price: '€5.00',
        description: 'Warm melted sweet cheese encased in golden crispy semolina dough.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVzh2fh7Jom84eio_pACSTRSKMw4llDzVJ1-_FkGVkwf7Qo19Y_tZZ22hvCo5BXqfnH4jiWWIwBpV6upCUTmJB4zVfwib0p1ANIZSPs_UT1Uc2-ubDeImUdMx2In9kQeXR2rzx9RHhRKZJkFM5IkGxd4fdcbDumUDUjU-hU81b1LukUlQydiB-37o-G1ZEFKBDtOI9-4GaKJ5RnImSoGIfew2ICGOU68jVp7i8n_IY6oDcUnSGHhEH7KiIC4w3_CCUfdXZHEfGuVo7',
        rating: '4.7',
        reviewsCount: 56,
        alt: 'Traditional hot cheese kunafa plate with pistachio garnish dust lines'
    },
    {
        id: 8,
        title: 'Mamoul with Dates',
        price: '€3.50',
        description: 'Buttery shortbread cookies stuffed with premium Medjool date paste.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpwEpZ_wrQ2tlwjmux3wevGaET9D87KljXGHT4qZGFHVsMWeXWU26GLlxfvGhkUHA0KWPHW_B1jxpYsSZQZqMp50BbLhU3NloVQ0aQEBEt0q2S5K08B8fwf1gQ2iz0_YEnLuir42HnQP-LHZk_OLeCeOg9W13f7d-_CNNG_6sBPo0a3KKEIdr6co91bx5fbGpPoWsd4XNhxUdyirChQBUlvXMyl0vyc7vQ3X1O_eb24EMH17yoGwLyq5OV6R4Oup3T275zBqMikHeJ',
        rating: '4.8',
        reviewsCount: 42,
        alt: 'Artisanal pressed geometric date mamoul shortbread cookie broken cross-section display'
    }
];

export default function Popularproductgrid() {
    const handleAddItemToCart = (productId: any) => {
        // Implement Inertia.post or shopping state connection logic here
        console.log(`Adding product ID variant: ${productId} to current user bag session.`);
    };

    return (
        <section className="max-w-container-max px-margin-desktop mx-auto">
            {/* Kept your original requested Grid layouts */}
            <div className="gap-gutter grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                {BESTSELLERS_DATA.map((product) => (
                    <div
                        key={product.id}
                        className="mx-auto bg-white group bg-surface-container-lowest ambient-shadow relative flex max-w-[280px] flex-col overflow-hidden rounded-xl p-4 transition-all duration-300 hover:-translate-y-1"
                    >
                        {/* Upper Bestseller Badge */}
                        <div className="absolute top-6 left-6 z-10">
                            <span className="text-on-primary font-label-md rounded-full bg-primary px-3 py-1 text-[10px] tracking-widest uppercase shadow-sm">
                                Bestseller
                            </span>
                        </div>

                        {/* Img frame view box */}
                        <div className="bg-surface-container mb-6 aspect-square overflow-hidden rounded-lg">
                            <img
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                src={product.image}
                                alt={product.alt}
                            />
                        </div>

                        {/* Product description content container */}
                        <div className="flex-grow">
                            <div className="mb-2 flex items-center gap-1">
                                <span
                                    className="material-symbols-outlined text-sm text-primary"
                                    style={{
                                        fontVariationSettings: "'FILL' 1",
                                    }}
                                >
                                    <Star />
                                </span>
                                <span className="font-label-md text-primary">
                                    {product.rating}
                                </span>
                                <span className="text-on-surface-variant/60 text-caption ml-1">
                                    ({product.reviewsCount} reviews)
                                </span>
                            </div>
                            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
                                {product.title}
                            </h3>
                            <p className="text-on-surface-variant font-body-md mb-4 line-clamp-2">
                                {product.description}
                            </p>
                        </div>

                        {/* Footer Pricing action card anchor split row */}
                        <div className="border-outline-variant/30 mt-auto flex items-center justify-between border-t pt-4">
                            <span className="font-headline-sm text-primary">
                                {product.price}
                            </span>
                            <button
                                onClick={() => handleAddItemToCart(product.id)}
                                className="text-on-primary hover:bg-on-primary-fixed-variant flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary shadow-sm transition-colors"
                                aria-label={`Add ${product.title} to selection`}
                            >
                                <span className="material-symbols-outlined">
                                    <Plus />
                                </span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
