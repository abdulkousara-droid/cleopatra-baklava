import React from 'react';

const NEW_ARRIVALS_DATA = [
    {
        id: 1,
        title: 'Pistachio Roll',
        price: '€4.00',
        description:
            'Hand-rolled phyllo pastry filled with premium crushed Antep pistachios and a hint of orange blossom.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANXZldoTYydj0o24qz-hWPKhHIPmjb0a7eya8VaxKSKG5omiWSl48nBNDhH1F27rOZ_oyipOuoE-5EZGoccgHLMF2xhl-tMYMHYBztrn--7Gd7g70qPniZhjb0s8xWSVps-395fMH8_j2Zn_EAs5nf5stHs-0_bv9Xebp84-JTAnjW6IGl847gkscl7HmOxw7j2sT5y58DnhWcTaBFF1suJp5y53ZxvOw33ByklhLOxL1hft2ujI4lRgMe08Qd3dVdV20JppRgXC0B',
        tag: 'New Collection',
        alt: 'Traditional rolled pistachio baklava roll with sweet honey glaze structure',
    },
    {
        id: 2,
        title: 'Walnut Baklava',
        price: '€4.00',
        description:
            'Traditional layers of buttered phyllo and toasted walnuts, soaked in a delicate honey-lemon syrup.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYSPrrNzGjD9urqut069xs9YU7JPhXkYuzdYD3Nx33WXTgzm3NGJa_CxGJpPlpV2vq6AXKrln_IwHWOGAj6wJw7OI9UxQi7FXN8tEvfD-_0imw_9ioYm3mBCVpsBrbnGoTSQKW3FNJhVxUpuJfqQfZq0o1FDZvDwVzR4MxwlQcAmI0nH0hHdi0LLs2esabf3xq0vblZ7TJTe0LW8TOggX7AG4ZRPqehnWRvRQpvy4wt4B59SvSlYMxoMqrx7vCDWGqDti8Fsbzzqkt',
        tag: null,
        alt: 'Diamond-cut honey walnut baklava stack presentation',
    },
    {
        id: 3,
        title: 'Kunafa with Cream',
        price: '€5.50',
        description:
            'Crispy shredded dough filled with a light, velvety milk cream, served with crushed pistachios.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRNPa3YXMZlXgWqIbc629hWZPG9ujw8F9Olk4Mq4AxTdZO2rTc79bfbEbWmdBCkAHVgC-j-tvLVqxM8SQmcat9nJuzTCK-atFMTEYekAFXTjUDwPJeEzL9WNsKl5NINF_JC_OIWy5j1gE1LnOM26GzmEf6-Mu1DtPzF1ROWrEn-9as_3kwz_I4QO-kHpH89r0xo7zKpTjK_DAzM61x0MT8hoE9Ei1e6G9IqYyyZ4X0DtC7762krBj7KXzPGx1_ibV2eH9-kbN0YZdR',
        tag: null,
        alt: 'Traditional golden hot kunafa platter topped with fresh white cream layers',
    },
    {
        id: 4,
        title: 'Cashew Fingers',
        price: '€4.50',
        description:
            'Delicate finger-shaped pastries filled with whole roasted cashews for a buttery, nutty finish.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvtmMRMPjPbfi9Ms40bswj0Zv-Rl1CQi-1ugGU5TDWON5bA4IPld28aE7lq60b6_CHOYPNIby_6YfQkt456D1txKjgQD5oREQOhkhcy-AzW9_rhTbouQ5_IlSX4Zbv_r6Nx5l-4MflUuV7mmzr4tUp5bDF7OI488h3vSWhPKQiVoysOqakBRVSeq038lAF6ZL376ffT66es9G_lIqWZhJOyNJSzVlwUnGGxBDxiM_v31qksCMuV108Eel6rHpaeGiZRf0aUDkqVcBU',
        tag: null,
        alt: 'Crispy sweet cashew finger logs pastry selection',
    },
];

export default function ProductGrid({ onAddToCart }: any) {
    return (
        <section className="max-w-container-max px-margin-desktop mx-auto pb-24">
            <div className="ml-20 gap-gutter grid grid-cols-1 md:grid-cols-3">
                {NEW_ARRIVALS_DATA.map((product) => (
                    <div
                        key={product.id}
                        className="max-w-sm group bg-surface-container-lowest ambient-shadow translate-y-0 transform overflow-hidden rounded-xl opacity-100 transition-all duration-500 hover:-translate-y-2"
                    >
                        {/* Image Box */}
                        <div className="bg-surface-container relative aspect-square overflow-hidden">
                            <img
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                src={product.image}
                                alt={product.alt}
                            />
                            {product.tag && (
                                <div className="absolute top-4 right-4">
                                    <span className="font-label-md rounded-full bg-primary/10 px-3 py-1 text-primary backdrop-blur-md">
                                        {product.tag}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Product Meta Body */}
                        <div className="p-8">
                            <div className="mb-2 flex items-start justify-between">
                                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                                    {product.title}
                                </h3>
                                <span className="font-headline-sm text-headline-sm text-primary">
                                    {product.price}
                                </span>
                            </div>
                            <p className="font-body-md text-body-md text-on-surface-variant mb-6 min-h-[48px]">
                                {product.description}
                            </p>

                            {/* Action Button */}
                            <button
                                onClick={onAddToCart}
                                aria-label={`Buy ${product.title} now`}
                                className="text-on-primary font-label-md hover:bg-primary-container hover:text-on-primary-container w-full cursor-pointer rounded-lg bg-primary py-4 tracking-widest uppercase transition-all duration-300"
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
