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
        <div className="min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">

            {/* Navbar */}
            <nav className={clsx(
                "fixed w-full z-50 transition-all duration-300 border-b",
                scrolled ? "bg-white/90 backdrop-blur-xl border-slate-200 py-3 shadow-sm" : "bg-transparent border-transparent py-5"
            )}>
                <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="bg-primary-600 p-2 rounded-lg shadow-lg shadow-primary-600/20">
                            <Brain className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900">Neurowell</span>
                    </div>

                    <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
                        <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
                        <a href="#how-it-works" className="hover:text-primary-600 transition-colors">How it Works</a>
                        <a href="#get-started" className="hover:text-primary-600 transition-colors">Get Started</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/login" className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-all hover:bg-slate-50 hover:border-slate-300 hover:text-primary-600 shadow-sm">
                            Sign In
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-40 pb-20 relative z-10 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16">

                        <div className="lg:w-1/2 space-y-10">
                            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-600"></span>
                                </span>
                                <span className="text-xs font-bold text-primary-600 uppercase tracking-wide">Now with AI Insights</span>
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                                Biofeedback <br />
                                Reimagined for <br />
                                <span className="text-primary-600">Modern Therapy</span>
                            </h1>

                            <p className="text-lg text-slate-600 leading-relaxed max-w-lg animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                                Empower your clinical practice with real-time physiological monitoring. Track HR, HRV, and GSR with clinical-grade precision and AI-driven analysis.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
                                <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40 text-center flex items-center justify-center gap-2 group">
                                    Start Clinical Trial
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>

                        {/* Interactive Hero Graphic */}
                        <div className="lg:w-1/2 relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
                            <div className="relative z-10 bg-white rounded-2xl p-2 border border-slate-200 shadow-2xl shadow-slate-200/50">
                                <div className="bg-slate-50 rounded-xl overflow-hidden relative">
                                    {/* Mockup Header */}
                                    <div className="h-12 border-b border-slate-200 flex items-center px-4 justify-between bg-white">
                                        <div className="flex space-x-2">
                                            <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                                            <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                                            <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-100">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                            </span>
                                            <span className="text-[10px] font-bold text-green-700 uppercase tracking-wide">Live Session</span>
                                        </div>
                                    </div>

                                    {/* Mockup Content */}
                                    <div className="p-6 space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                                                <div className="flex justify-between items-start mb-2">
                                                    <Heart className="h-5 w-5 text-red-500" />
                                                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">HR</span>
                                                </div>
                                                <div className="text-3xl font-bold text-slate-900">72 <span className="text-sm font-medium text-slate-400">bpm</span></div>
                                            </div>
                                            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                                                <div className="flex justify-between items-start mb-2">
                                                    <Activity className="h-5 w-5 text-primary-600" />
                                                    <span className="text-xs font-bold text-primary-600 bg-blue-50 px-2 py-0.5 rounded">HRV</span>
                                                </div>
                                                <div className="text-3xl font-bold text-slate-900">58 <span className="text-sm font-medium text-slate-400">ms</span></div>
                                            </div>
                                        </div>

                                        <div className="p-1 rounded-xl bg-white border border-slate-200 h-32 flex items-end justify-between gap-1 overflow-hidden relative shadow-inner">
                                            <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-primary-50 to-transparent pointer-events-none"></div>
                                            {[30, 45, 35, 60, 50, 75, 55, 45, 65, 80, 70, 60, 50, 65, 40, 55, 45, 35, 45, 50].map((h, i) => (
                                                <div key={i} className="flex-1 bg-primary-500 rounded-t-sm" style={{ height: `${h}%`, opacity: 0.6 + (i / 100) }}></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-32 bg-white relative">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-sm font-bold text-primary-600 uppercase tracking-wider mb-2">Advanced Capabilities</h2>
                        <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">Clinical-Grade Precision</h2>
                        <p className="text-lg text-slate-600 leading-relaxed">Designed specifically for mental health professionals to enhance patient care with precision data and actionable insights.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Heart, color: 'text-red-500', bg: 'bg-red-50', title: 'Live Bio-Metrics', desc: 'Real-time tracking of physiological markers like HR, HRV, and GSR with millisecond precision.' },
                            { icon: Brain, color: 'text-primary-600', bg: 'bg-blue-50', title: 'AI Clinical Insights', desc: 'Detailed session data breakdown to identify stress patterns and guide therapy interventions effectively.' },
                            { icon: FileText, color: 'text-amber-500', bg: 'bg-amber-50', title: 'Automated Reporting', desc: 'Instant generation of comprehensive session summaries for patient files and insurance compliance.' }
                        ].map((feature, i) => (
                            <div key={i} className="p-8 rounded-2xl bg-white border border-slate-100 shadow-lg hover:shadow-xl transition-all group">
                                <div className={clsx("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", feature.bg)}>
                                    <feature.icon className={clsx("h-7 w-7", feature.color)} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors">{feature.title}</h3>
                                <p className="text-slate-500 leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Workflow Section */}
            <section id="how-it-works" className="py-32 bg-slate-50 border-y border-slate-200 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">Seamless Workflow</h2>
                    <p className="text-lg text-slate-600 mb-20 max-w-2xl mx-auto">Three simple steps to integrate biofeedback into your practice.</p>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-[3rem] left-[16%] right-[16%] h-px bg-slate-300 -z-0 border-t border-dashed border-slate-300"></div>

                        {[
                            { icon: Zap, title: "Connect Sensor", desc: "Easy Bluetooth pairing with clinical-grade devices." },
                            { icon: Activity, title: "Monitor Session", desc: "View live physiological data with AI prompts." },
                            { icon: CheckCircle2, title: "Review Progress", desc: "Analyze post-session trends and insights." }
                        ].map((step, i) => (
                            <div key={i} className="relative z-10 flex flex-col items-center">
                                <div className="w-24 h-24 mx-auto bg-white border border-slate-100 rounded-full flex items-center justify-center mb-8 shadow-xl hover:scale-105 transition-transform duration-300">
                                    <step.icon className="h-10 w-10 text-primary-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{i + 1}. {step.title}</h3>
                                <p className="text-sm text-slate-500 max-w-xs">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing / CTA Section */}
            <section id="get-started" className="py-32 relative overflow-hidden bg-primary-700">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay"></div>

                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">Ready to modernize your therapy practice?</h2>
                    <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">Join hundreds of clinicians using Neurowell to provide data-driven mental health care.</p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link to="/login" className="w-full sm:w-auto px-10 py-4 bg-white text-primary-700 font-bold rounded-xl shadow-xl hover:bg-slate-50 transition-all hover:scale-105">
                            Get started for free
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-50 border-t border-slate-200 py-12">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary-600 p-1.5 rounded-lg shadow-sm">
                            <Brain className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-lg font-bold text-slate-700">Neurowell</span>
                    </div>

                    <div className="flex gap-8 text-sm font-medium text-slate-500">
                        <a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-primary-600 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-primary-600 transition-colors">Support</a>
                    </div>

                    <div className="text-slate-400 text-sm">
                        © 2024 Neurowell Inc.
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default Landing;
