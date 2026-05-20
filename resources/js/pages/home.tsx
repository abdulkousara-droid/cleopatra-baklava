import Bestsellers from '@/components/bestsellers';
import BrandStory from '@/components/BrandStory';
import Footer from '@/components/footer';
import Header from '@/components/header';
import Hero from '@/components/hero';
import Newsletter from '@/components/newsletter';

export default function Home() {
    return(
        <>
           <Header/>
           <Hero />
           <Bestsellers/>
            <BrandStory/>
            <Newsletter/>
            <Footer/>
        </>
    );
}
