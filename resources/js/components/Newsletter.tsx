import React, { useState } from 'react';
import { Mail, CheckCircle, Loader2, AlertCircle, Sparkles } from 'lucide-react';

type Status = 'idle' | 'loading' | 'subscribed' | 'already_subscribed' | 'error';

export default function Newsletter() {
    const [email, setEmail]   = useState('');
    const [status, setStatus] = useState<Status>('idle');
    const [message, setMessage] = useState('');

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setStatus('loading');

        try {
            // Get CSRF token from meta tag (Laravel Inertia sets this)
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';

            const res = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (data.status === 'subscribed') {
                setStatus('subscribed');
                setMessage(data.message);
                setEmail('');
            } else if (data.status === 'already_subscribed') {
                setStatus('already_subscribed');
                setMessage(data.message);
            } else {
                setStatus('error');
                setMessage('Something went wrong. Please try again.');
            }
        } catch {
            setStatus('error');
            setMessage('Unable to connect. Please try again later.');
        }
    };

    const reset = () => {
        setStatus('idle');
        setMessage('');
    };

    return (
        <section className="relative py-28 overflow-hidden">
            {/* Background decorative layer */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#fdfbf5] via-[#faf5ea] to-[#f5ede0] pointer-events-none" />
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_80%,rgba(201,168,76,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(201,168,76,0.08)_0%,transparent_50%)]" />

            <div className="relative max-w-2xl mx-auto px-6 text-center">

                {/* Decorative header ornament */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#c9a84c]/40" />
                    <div className="flex items-center gap-2 text-[#c9a84c]">
                        <Sparkles size={14} />
                        <span className="text-[10px] font-semibold tracking-[5px] uppercase">Inner Circle</span>
                        <Sparkles size={14} />
                    </div>
                    <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#c9a84c]/40" />
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-[#1e1b14] flex items-center justify-center shadow-lg shadow-[#1e1b14]/20">
                        <Mail className="w-7 h-7 text-[#c9a84c]" />
                    </div>
                </div>

                <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#1e1b14] mb-4 leading-tight">
                    Taste the Extraordinary
                </h2>
                <p className="text-[#6b5e47] font-sans text-base md:text-lg mb-3 max-w-lg mx-auto leading-relaxed">
                    Join our Inner Circle for exclusive tasting invitations, seasonal collection reveals, and artisan stories.
                </p>

                <div className="mb-10" />

                {/* SUCCESS STATE */}
                {(status === 'subscribed' || status === 'already_subscribed') && (
                    <div className={`relative overflow-hidden rounded-2xl p-8 border shadow-sm text-center transition-all duration-500 ${
                        status === 'subscribed'
                            ? 'bg-[#1e1b14] border-[#c9a84c]/30'
                            : 'bg-[#fdfbf5] border-[#e8dfc8]'
                    }`}>
                        {status === 'subscribed' && (
                            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />
                        )}
                        <div className="flex justify-center mb-4">
                            <CheckCircle className={`w-12 h-12 ${status === 'subscribed' ? 'text-[#c9a84c]' : 'text-green-500'}`} />
                        </div>
                        <p className={`font-serif text-xl font-semibold mb-2 ${status === 'subscribed' ? 'text-[#c9a84c]' : 'text-[#1e1b14]'}`}>
                            {status === 'subscribed' ? 'Welcome to the Inner Circle!' : 'Already a Member!'}
                        </p>
                        <p className={`text-sm leading-relaxed mb-6 ${status === 'subscribed' ? 'text-[#9e8b6e]' : 'text-[#6b5e47]'}`}>
                            {message}
                        </p>
                        <div className="mt-2">
                            <button onClick={reset} className="text-sm text-[#c9a84c] hover:text-[#e8c96e] underline transition-colors cursor-pointer">
                                {status === 'subscribed' ? 'Dismiss' : 'Go back'}
                            </button>
                        </div>
                    </div>
                )}

                {/* ERROR STATE */}
                {status === 'error' && (
                    <div className="rounded-2xl p-6 bg-red-50 border border-red-100 flex items-center gap-4 text-left">
                        <AlertCircle className="w-8 h-8 text-red-400 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="font-semibold text-red-700 text-sm">{message}</p>
                        </div>
                        <button onClick={reset} className="text-sm text-red-500 hover:text-red-700 font-medium cursor-pointer">
                            Retry
                        </button>
                    </div>
                )}

                {/* FORM (idle or loading) */}
                {(status === 'idle' || status === 'loading') && (
                    <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full">
                        <div className="relative flex-grow">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#c9a84c] pointer-events-none" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Your email address"
                                aria-label="Email address for newsletter subscription"
                                disabled={status === 'loading'}
                                className="w-full pl-12 pr-5 py-4 bg-white text-[#1e1b14] border border-[#e8dfc8] rounded-xl font-sans text-base placeholder-[#b0a28c] focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/40 focus:border-[#c9a84c] transition-all duration-300 shadow-sm disabled:opacity-60"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="bg-[#1e1b14] text-[#c9a84c] px-8 py-4 font-sans text-xs font-bold uppercase tracking-[3px] rounded-xl hover:bg-[#2e2a1e] active:scale-[0.98] transition-all duration-300 shadow-md cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {status === 'loading' ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Joining...</span>
                                </>
                            ) : (
                                'Join Now'
                            )}
                        </button>
                    </form>
                )}

            </div>
        </section>
    );
}
