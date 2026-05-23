import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { CartProvider } from '@/lib/cart';

const appName = import.meta.env.VITE_APP_NAME || 'Cleopatra Baklava';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.tsx');
        return pages[`./pages/${name}.tsx`]();
    },
    setup({ el, App, props }) {
        if (el) {
            import('react-dom/client').then(({ createRoot }) => {
                createRoot(el).render(
                    <CartProvider>
                        <TooltipProvider delayDuration={0}>
                            <App {...props} />
                            <Toaster />
                        </TooltipProvider>
                    </CartProvider>
                );
            });
        } else {
            return (
                <CartProvider>
                    <TooltipProvider delayDuration={0}>
                        <App {...props} />
                        <Toaster />
                    </TooltipProvider>
                </CartProvider>
            );
        }
    },
    progress: {
        color: '#c9a84c',
    },
});
