import React from 'react';
import { ShoppingCart } from 'lucide-react';

export default function Bestsellers() {
    const products = [
        {
            id: 1,
            title: 'Pistachio Baklava',
            description: 'Crispy layers of filo pastry filled with hand-picked Antep pistachios and pure honey syrup.',
            price: '€24.00',
            image: 'https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcTmYpJt4A83Bssep24cxyM2-VEq76XxOobzbNhs0_rr4AT9O0Nd3xSuodgIWHjNkUYLKxHPOPINF0LMboM',
            tag: 'Bestseller'
        },
        {
            id: 2,
            title: 'Kunafa bil Jibn',
            description: 'Warm, stretchy Akkawi cheese enveloped in toasted kataifi pastry, drizzled with rose-water syrup.',
            price: '€18.50',
            image: 'https://cleobuttera.com/wp-content/uploads/2018/05/cheese-pull-knafeh-720x720.jpg',
            tag: null
        },
        {
            id: 3,
            title: 'Mamoul with Dates',
            description: 'Traditional shortbread cookies stuffed with premium Medjool dates and a hint of orange blossom.',
            price: '€16.00',
            image: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcR9Dl3QTWEh9wJwp0E6tzotBgwG1hTeH4CI3WtqUcGndlxtLSD52vZO6iSDNBOyXsFqjTmU8s3J03z7BvA',
            tag: null
        }
    ];

    return (
        <section className="py-24 max-w-7xl mx-auto px-6 md:px-16 bg-background">

            {/* Section Header */}
            <div className="flex flex-col items-center mb-16 text-center">
                <div className="w-12 h-[2px] bg-primary mb-6"></div>
                <h3 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-2">
                    Barcelona's Finest: Our Bestsellers
                </h3>
                <p className="text-muted-foreground font-sans italic tracking-wide">
                    Handcrafted daily with the finest Mediterranean ingredients
                </p>
            </div>

            {/* Grid Wrapper */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="bg-card rounded-xl overflow-hidden border border-border shadow-xs group flex flex-col h-full transition-all duration-500 hover:-translate-y-2 hover:shadow-md"
                    >
                        {/* Aspect Ratio Image Container */}
                        <div className="relative aspect-square overflow-hidden bg-muted">
                            <img
                                src={product.image}
                                alt={product.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {product.tag && (
                                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm">
                                    {product.tag}
                                </div>
                            )}
                        </div>

                        {/* Product Body Content */}
                        <div className="p-6 md:p-8 flex flex-col flex-grow">
                            <h4 className="font-serif text-xl md:text-2xl font-semibold mb-2 text-primary">
                                {product.title}
                            </h4>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                                {product.description}
                            </p>

                            {/* Card Footer Actions */}
                            <div className="mt-auto pt-4 border-t border-border/40 flex items-center justify-between">
                <span className="font-sans text-xl font-bold text-foreground">
                  {product.price}
                </span>

                                {/* Aria-label added dynamically for clear descriptive voice parsing */}
                                <button
                                    aria-label={`Add ${product.title} to shopping bag`}
                                    className="flex items-center gap-2 text-primary font-semibold text-sm hover:translate-x-1 transition-transform duration-300 cursor-pointer"
                                >
                                    Add to Cart
                                    <span className="material-symbols-outlined text-lg" aria-hidden="true">
                                        <ShoppingCart />
                                    </span>
                                </button>
                            </div>
                        </div>

                    </div>
                ))}
            </div>

        </section>
    );
}
