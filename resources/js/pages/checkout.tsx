import { useTranslation } from 'react-i18next';
import { Head, Link, usePage } from '@inertiajs/react';
import { MessageSquareText, ShoppingBag, ArrowLeft, Plus, Minus, Trash2 } from 'lucide-react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useCart } from '@/lib/cart';

export default function Checkout() {
    const { t } = useTranslation();
    const { cartItems, cartTotal, itemCount, updateQuantity, removeFromCart } = useCart();
    const { whatsapp_number } = usePage().props as unknown as { whatsapp_number: string };

    const handleWhatsappCheckout = () => {
        if (cartItems.length === 0) {
            return;
        }

        let message = `${t('checkout.whatsapp_intro')}\n\n`;

        cartItems.forEach((item) => {
            message += `- ${item.quantity}x ${item.title} (€${Number(item.price).toFixed(2)})\n`;
        });

        message += `\n${t('checkout.total_amount')}: €${cartTotal.toFixed(2)}\n\n${t('checkout.whatsapp_outro')}`;

        const encodedMessage = encodeURIComponent(message);
        window.open(
            `https://wa.me/${whatsapp_number}?text=${encodedMessage}`,
            '_blank',
        );
    };

    return (
        <>
            <Head title={t('checkout.page_title')} />
            <Header />
            <div className="min-h-screen bg-background py-32 font-sans text-on-surface">
                <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop">
                    <Link href="/shop" className="inline-flex items-center text-sm font-label-md tracking-widest uppercase text-primary hover:text-primary/80 mb-8 transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {t('checkout.back_to_shop')}
                    </Link>

                    <h1 className="text-[36px] md:text-[48px] font-headline-md leading-tight mb-8 flex items-center">
                        <ShoppingBag className="mr-4 h-8 w-8 text-primary" />
                        {t('checkout.order_summary')}
                    </h1>

                    {cartItems.length === 0 ? (
                        <div className="bg-surface-container p-12 text-center rounded-xl shadow-sm border border-outline-variant/30">
                            <ShoppingBag className="mx-auto h-16 w-16 text-outline-variant mb-4" />
                            <h2 className="text-2xl font-headline-sm mb-2">{t('checkout.empty_title')}</h2>
                            <p className="text-on-surface-variant font-body-md mb-8">{t('checkout.empty_text')}</p>
                            <Link href="/shop" className="inline-flex items-center justify-center px-10 py-4 text-sm font-label-md tracking-widest text-on-primary uppercase bg-primary rounded-lg shadow-sm transition-all hover:brightness-110 active:scale-95">
                                {t('checkout.browse_collection')}
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-surface-container rounded-xl shadow-xl border border-outline-variant/30 overflow-hidden">
                            <div className="p-6 md:p-10">
                                <h2 className="text-xl font-headline-sm mb-6 border-b border-outline-variant/30 pb-4">{t('checkout.selected_masterpieces', { count: itemCount })}</h2>

                                <ul className="divide-y divide-outline-variant/20 mb-8">
                                    {cartItems.map((item) => (
                                        <li key={item.id} className="py-6 flex flex-col md:flex-row items-start gap-6">
                                            <Link href={`/productshow?id=${item.id}`} className="flex-shrink-0">
                                                {item.image && (
                                                    <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-lg border border-outline-variant/30">
                                                        <img src={item.image} alt={item.title} loading="lazy" className="h-full w-full object-cover object-center" />
                                                    </div>
                                                )}
                                            </Link>
                                            <div className="flex-1 flex flex-col justify-between w-full">
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <Link href={`/productshow?id=${item.id}`} className="text-lg font-headline-sm hover:text-primary transition-colors">{item.title}</Link>
                                                        <p className="text-lg font-bold text-primary">€{(Number(item.price) * item.quantity).toFixed(2)}</p>
                                                    </div>
                                                    <p className="mt-1 text-sm text-on-surface-variant font-body-md line-clamp-2 md:pr-12">{item.description}</p>
                                                </div>
                                                <div className="flex items-center justify-between mt-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="border-outline-variant flex h-10 items-center overflow-hidden rounded-lg border bg-white">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                className="hover:bg-surface-container flex h-full items-center justify-center px-3 transition-colors cursor-pointer"
                                                            >
                                                                <Minus className="h-3.5 w-3.5" />
                                                            </button>
                                                            <span className="w-10 text-center font-body-md font-semibold select-none text-sm">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                className="hover:bg-surface-container flex h-full items-center justify-center px-3 transition-colors cursor-pointer"
                                                            >
                                                                <Plus className="h-3.5 w-3.5" />
                                                            </button>
                                                        </div>
                                                        <p className="text-sm text-on-surface-variant font-label-md">€{Number(item.price).toFixed(2)} {t('product.per_pc')}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-on-surface-variant hover:text-red-700 p-2 cursor-pointer transition-colors hover:bg-red-50 rounded-full"
                                                        title={t('checkout.remove_from_basket')}
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                <div className="bg-surface-container-low rounded-xl p-6 space-y-4 border border-outline-variant/20">
                                    <div className="flex justify-between text-base font-body-md">
                                        <span className="text-on-surface-variant">{t('checkout.subtotal')}</span>
                                        <span className="font-semibold">€{cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-base font-body-md">
                                        <span className="text-on-surface-variant">{t('checkout.express_shipping')}</span>
                                        <span className="font-semibold text-primary">{t('checkout.free')}</span>
                                    </div>
                                    <div className="flex justify-between text-2xl font-bold border-t border-outline-variant/30 pt-4 mt-4">
                                        <span>{t('checkout.total_amount')}</span>
                                        <span className="text-primary">€{cartTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-surface-container-lowest px-6 py-8 md:px-10 border-t border-outline-variant/30">
                                <button
                                    onClick={handleWhatsappCheckout}
                                    className="w-full flex justify-center items-center py-4 px-4 rounded-lg shadow-lg text-sm font-label-md tracking-widest uppercase text-white bg-[#25D366] hover:bg-[#128C7E] transition-all transform hover:-translate-y-1 active:scale-95 cursor-pointer"
                                >
                                    <MessageSquareText className="mr-3 h-5 w-5" />
                                    {t('checkout.confirm_whatsapp')}
                                </button>
                                <p className="text-center text-xs font-body-md text-on-surface-variant mt-6 max-w-md mx-auto">
                                    {t('checkout.checkout_info')}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}
