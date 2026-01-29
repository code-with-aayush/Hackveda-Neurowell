import React, { useState, useEffect } from 'react';
import { Activity, ArrowRight, Heart, Brain, FileText, Zap, Shield, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

const Landing = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">

            {/* Ambient Background Glows */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-rose-500/5 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-700"></div>
            </div>

            {/* Navbar */}
            <nav className={clsx(
                "fixed w-full z-50 transition-all duration-300 border-b",
                scrolled ? "bg-[#09090b]/80 backdrop-blur-xl border-white/5 py-3" : "bg-transparent border-transparent py-5"
            )}>
                <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-tr from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
                            <Brain className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">Neurowell</span>
                    </div>

                    <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-zinc-400">
                        <a href="#features" className="hover:text-indigo-400 transition-colors">Features</a>
                        <a href="#how-it-works" className="hover:text-indigo-400 transition-colors">How it Works</a>
                        <a href="#pricing" className="hover:text-indigo-400 transition-colors">Pricing</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/login" className="px-5 py-2.5 bg-white text-zinc-950 text-sm font-bold rounded-xl transition-all hover:bg-zinc-200 hover:scale-105 active:scale-95 shadow-lg shadow-white/5">
                            Sign In
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-40 pb-20 relative z-10">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16">

                        <div className="lg:w-1/2 space-y-10">
                            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                </span>
                                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide">Now with AI Insights</span>
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                                Biofeedback <br />
                                Reimagined for <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-rose-400">Modern Therapy</span>
                            </h1>

                            <p className="text-lg text-zinc-400 leading-relaxed max-w-lg animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                                Empower your clinical practice with real-time physiological monitoring. Track HR, HRV, and GSR with clinical-grade precision and AI-driven analysis.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
                                <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 text-center flex items-center justify-center gap-2 group">
                                    Start Clinical Trial
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Link>

                            </div>

                            <div className="flex items-center gap-6 pt-6 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-400">
                                <div className="flex -space-x-4">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-12 w-12 rounded-full border-4 border-[#09090b] overflow-hidden bg-zinc-800">
                                            <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="h-full w-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <div className="flex items-center gap-1 mb-0.5">
                                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-4 h-4 text-amber-400 fill-amber-400">★</div>)}
                                    </div>
                                    <div className="text-sm font-medium text-zinc-500">
                                        Trusted by <span className="text-white font-bold">500+</span> clinics
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Hero Graphic */}
                        <div className="lg:w-1/2 relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
                            <div className="relative z-10 glass-panel rounded-2xl p-2 border-white/10 shadow-2xl shadow-indigo-500/10">
                                <div className="bg-[#09090b] rounded-xl overflow-hidden relative">
                                    {/* Mockup Header */}
                                    <div className="h-12 border-b border-white/5 flex items-center px-4 justify-between bg-zinc-900/50">
                                        <div className="flex space-x-2">
                                            <div className="w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500/50"></div>
                                            <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
                                            <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                            </span>
                                            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide">Live Session</span>
                                        </div>
                                    </div>

                                    {/* Mockup Content */}
                                    <div className="p-6 space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="glass-card p-4 rounded-xl border-rose-500/20 bg-rose-500/5">
                                                <div className="flex justify-between items-start mb-2">
                                                    <Heart className="h-5 w-5 text-rose-500" />
                                                    <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">HR</span>
                                                </div>
                                                <div className="text-3xl font-bold text-white">72 <span className="text-sm font-medium text-zinc-500">bpm</span></div>
                                            </div>
                                            <div className="glass-card p-4 rounded-xl border-emerald-500/20 bg-emerald-500/5">
                                                <div className="flex justify-between items-start mb-2">
                                                    <Activity className="h-5 w-5 text-emerald-500" />
                                                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">HRV</span>
                                                </div>
                                                <div className="text-3xl font-bold text-white">58 <span className="text-sm font-medium text-zinc-500">ms</span></div>
                                            </div>
                                        </div>

                                        <div className="glass-panel p-1 rounded-xl bg-zinc-900/50 h-32 flex items-end justify-between gap-1 overflow-hidden relative">
                                            <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-indigo-500/10 to-transparent pointer-events-none"></div>
                                            {[30, 45, 35, 60, 50, 75, 55, 45, 65, 80, 70, 60, 50, 65, 40, 55, 45, 35, 45, 50].map((h, i) => (
                                                <div key={i} className="flex-1 bg-indigo-500 rounded-t-sm opacity-80" style={{ height: `${h}%`, opacity: 0.5 + (i / 40) }}></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Elements around Mockup */}
                            <div className="absolute -top-12 -right-12 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
                            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl -z-10 animate-pulse delay-500"></div>
                        </div>
                    </div>
                </div>

                {/* Background Noise Texture */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-32 bg-[#09090b] relative">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-2">Advanced Capabilities</h2>
                        <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">Clinical-Grade Precision</h2>
                        <p className="text-lg text-zinc-400 leading-relaxed">Designed specifically for mental health professionals to enhance patient care with precision data and actionable insights.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Heart, color: 'text-rose-500', bg: 'bg-rose-500/10', title: 'Live Bio-Metrics', desc: 'Real-time tracking of physiological markers like HR, HRV, and GSR with millisecond precision.' },
                            { icon: Brain, color: 'text-indigo-500', bg: 'bg-indigo-500/10', title: 'AI Clinical Insights', desc: 'Detailed session data breakdown to identify stress patterns and guide therapy interventions effectively.' },
                            { icon: FileText, color: 'text-amber-500', bg: 'bg-amber-500/10', title: 'Automated Reporting', desc: 'Instant generation of comprehensive session summaries for patient files and insurance compliance.' }
                        ].map((feature, i) => (
                            <div key={i} className="glass-card p-8 rounded-2xl bg-zinc-900/50 hover:bg-zinc-900/80 group">
                                <div className={clsx("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", feature.bg)}>
                                    <feature.icon className={clsx("h-7 w-7", feature.color)} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">{feature.title}</h3>
                                <p className="text-zinc-400 leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Workflow Section */}
            <section id="how-it-works" className="py-32 bg-zinc-950 border-y border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">Seamless Workflow</h2>
                    <p className="text-lg text-zinc-400 mb-20 max-w-2xl mx-auto">Three simple steps to integrate biofeedback into your practice.</p>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-[3rem] left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent -z-0 border-t border-dashed border-white/10"></div>

                        {[
                            { icon: Zap, title: "Connect Sensor", desc: "Easy Bluetooth pairing with clinical-grade devices." },
                            { icon: Activity, title: "Monitor Session", desc: "View live physiological data with AI prompts." },
                            { icon: CheckCircle2, title: "Review Progress", desc: "Analyze post-session trends and insights." }
                        ].map((step, i) => (
                            <div key={i} className="relative z-10 flex flex-col items-center">
                                <div className="w-24 h-24 mx-auto glass-panel rounded-full flex items-center justify-center mb-8 shadow-xl shadow-black/50 group hover:scale-105 transition-transform duration-300">
                                    <step.icon className="h-10 w-10 text-zinc-300 group-hover:text-indigo-400 transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{i + 1}. {step.title}</h3>
                                <p className="text-sm text-zinc-400 max-w-xs">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing / CTA Section */}
            <section id="pricing" className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 to-black z-0"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>

                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">Ready to modernize your therapy practice?</h2>
                    <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto">Join hundreds of clinicians using Neurowell to provide data-driven mental health care.</p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link to="/login" className="w-full sm:w-auto px-10 py-4 bg-white text-black font-bold rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:bg-zinc-200 transition-all hover:scale-105">
                            Get started for free
                        </Link>

                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#09090b] border-t border-white/5 py-12">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="bg-zinc-800 p-1.5 rounded-lg border border-white/5">
                            <Brain className="h-4 w-4 text-zinc-400" />
                        </div>
                        <span className="text-lg font-bold text-zinc-200">Neurowell</span>
                    </div>

                    <div className="flex gap-8 text-sm font-medium text-zinc-500">
                        <a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-indigo-400 transition-colors">Support</a>
                    </div>

                    <div className="text-zinc-600 text-sm">
                        © 2024 Neurowell Inc.
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default Landing;
