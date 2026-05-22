import Bestsellers from '@/components/bestsellers';
import BrandStory from '@/components/BrandStory';
import Footer from '@/components/footer';
import Header from '@/components/header';
import Hero from '@/components/hero';
import Newsletter from '@/components/newsletter';
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
