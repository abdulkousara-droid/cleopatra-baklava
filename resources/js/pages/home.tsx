import Bestsellers from '@/components/BestSellers';

import BrandStory from '@/components/BrandStory';

import Footer from '@/components/Footer';

import Header from '@/components/Header';

import Hero from '@/components/Hero';

import Newsletter from '@/components/Newsletter';
import type { Product } from '@/types';
import { Head } from '@inertiajs/react';

export default function Home({ products }: { products: Product[] }) {
    return(
        <>
            <Head title="Home - Cleopatra Baklava" />
           <Header/>
           <Hero />
           <Bestsellers products={products} />
            <BrandStory/>
            <Newsletter/>
            <Footer/>
        </>
    );
}
