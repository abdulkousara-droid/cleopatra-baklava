import { useTranslation } from 'react-i18next';
import Bestsellers from '@/components/BestSellers';
import BrandStory from '@/components/BrandStory';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Newsletter from '@/components/Newsletter';
import type { Product } from '@/types';
import { Head } from '@inertiajs/react';

export default function Home({ products }: { products: Product[] }) {
    const { t } = useTranslation();

    return(
        <>
            <Head title={t('site_name')} />
           <Header/>
           <Hero />
           <Bestsellers products={products} />
            <BrandStory/>
            <Newsletter/>
            <Footer/>
        </>
    );
}
