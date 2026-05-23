import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Lock, Mail, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';

export default function Login() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        _action: 'login',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin', { onFinish: () => reset('password') });
    };

    return (
        <>
            <Head><title>Admin Login — Cleopatra Baklava</title></Head>

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0d09] via-[#1e1b14] to-[#14100a] p-6 relative overflow-hidden">
                {/* Ambient glow */}
                <div className="absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.08)_0%,transparent_70%)] pointer-events-none" />

                {/* Back link */}
                <Link href="/" className="absolute top-7 left-7 flex items-center gap-2 text-[#6b6050] no-underline text-xs font-semibold tracking-wide transition-colors duration-200 hover:text-[#c9a84c]">
                    <ArrowLeft size={16} /> Back to Store
                </Link>

                <div className="w-full max-w-[420px] relative z-10">
                    {/* Logo & Brand */}
                    <div className="text-center mb-9">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.15)] mb-5">
                            <img src="/logo.svg" alt="Logo" className="w-14 h-14 object-contain" />
                        </div>
                        <h1 className="font-serif text-[30px] font-bold text-[#f5f0e8] m-0 leading-tight">
                            Cleopatra Baklava
                        </h1>
                        <div className="inline-flex items-center gap-1.5 mt-2.5 bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.18)] rounded-full px-3.5 py-1">
                            <ShieldCheck size={13} className="text-[#c9a84c]" />
                            <span className="text-[10px] font-bold text-[#c9a84c] tracking-[0.2em] uppercase">Admin Portal</span>
                        </div>
                    </div>

                    {/* Card */}
                    <div className="bg-[rgba(30,27,20,0.85)] border border-[rgba(201,168,76,0.14)] rounded-2xl p-9 backdrop-blur-xl shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
                        <form onSubmit={submit}>
                            {errors.email && (
                                <div className="bg-[rgba(180,40,40,0.12)] border border-[rgba(180,40,40,0.3)] rounded-xl px-4 py-3 mb-5 text-[#f87171] text-sm leading-relaxed">
                                    {errors.email}
                                </div>
                            )}

                            {/* Email */}
                            <div className="mb-5">
                                <label className="block text-[11px] font-bold text-[#9b8e7a] tracking-[0.15em] uppercase mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4a4030] pointer-events-none" />
                                    <input
                                        id="email" type="email" autoFocus autoComplete="email" required
                                        value={data.email} onChange={e => setData('email', e.target.value)}
                                        placeholder="admin@cleopatrabaklava.com"
                                        className="block w-full pl-11 pr-4 py-3.5 bg-[#100e0a] border border-[rgba(201,168,76,0.1)] rounded-xl text-[#f5f0e8] text-sm outline-none transition-[border-color] duration-200 box-border font-inherit focus:border-[rgba(201,168,76,0.5)]"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="mb-7">
                                <label className="block text-[11px] font-bold text-[#9b8e7a] tracking-[0.15em] uppercase mb-2">Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4a4030] pointer-events-none" />
                                    <input
                                        id="password" type="password" autoComplete="current-password" required
                                        value={data.password} onChange={e => setData('password', e.target.value)}
                                        placeholder="••••••••••••"
                                        className="block w-full pl-11 pr-4 py-3.5 bg-[#100e0a] border border-[rgba(201,168,76,0.1)] rounded-xl text-[#f5f0e8] text-sm outline-none transition-[border-color] duration-200 box-border font-inherit focus:border-[rgba(201,168,76,0.5)]"
                                    />
                                </div>
                            </div>

                            <button type="submit" disabled={processing} className="flex items-center justify-center gap-2.5 w-full px-6 py-[15px] bg-gradient-to-br from-[#c9a84c] to-[#a8893a] border-none rounded-xl text-[#1e1b14] text-xs font-extrabold tracking-[0.15em] uppercase cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 shadow-[0_4px_20px_rgba(201,168,76,0.25)] transition-all duration-200 font-inherit">
                                {processing ? <><Loader2 size={16} className="animate-spin" /> Authenticating...</> : 'Enter Workspace'}
                            </button>
                        </form>
                    </div>

                    <p className="text-center text-[11px] text-[#3a3428] mt-6 tracking-[0.1em] uppercase">
                        Authorized Access Only · Barcelona 2026
                    </p>
                </div>
            </div>
        </>
    );
}
