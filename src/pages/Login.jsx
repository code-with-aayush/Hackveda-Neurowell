import React, { useState } from 'react';
import { Activity, Eye, EyeOff, Lock, Mail, ShieldCheck, CheckCircle, Server } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login, signup, loginWithGoogle } = useAuth();
    const [isSignup, setIsSignup] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            const email = e.target.email.value;
            const password = e.target.password.value;

            if (isSignup) {
                await signup(email, password);
            } else {
                await login(email, password);
            }
            navigate('/dashboard');
        } catch (err) {
            console.error("Auth Error:", err);
            let msg = err.message;
            if (msg.includes('auth/email-already-in-use')) msg = 'Email already in use.';
            if (msg.includes('auth/wrong-password')) msg = 'Incorrect password.';
            if (msg.includes('auth/user-not-found')) msg = 'No account found.';
            if (msg.includes('auth/invalid-credential')) msg = 'Invalid credentials.';
            setError(msg);
        }
        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        try {
            setError('');
            setLoading(true);
            await loginWithGoogle();
            navigate('/dashboard');
        } catch (err) {
            console.error("Google Auth Error:", err);
            setError('Google Sign In failed.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-950 flex font-sans text-slate-100 selection:bg-blue-500/30">

            {/* LEFT SIDE: FORM */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-16 relative z-10">
                <div className="max-w-md mx-auto w-full">

                    {/* Brand */}
                    <div className="flex items-center gap-3 mb-10">
                        <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
                            <Activity className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white">Neurowell</span>
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {isSignup ? 'Create Account' : 'Welcome back'}
                        </h1>
                        <p className="text-slate-400">
                            Secure access portal for healthcare providers.
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="bg-slate-900/50 p-1 rounded-xl flex mb-8 border border-slate-800">
                        <button
                            onClick={() => setIsSignup(false)}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${!isSignup ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsSignup(true)}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${isSignup ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-xl flex items-center gap-3 text-red-200 text-sm">
                            <ShieldCheck className="h-5 w-5 shrink-0 text-red-400" />
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="dr.smith@hospital.com"
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Password</label>
                                {!isSignup && <a href="#" className="text-xs text-blue-400 hover:text-blue-300 font-medium">Forgot?</a>}
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-12 pr-12 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-900/40 hover:shadow-blue-900/60 hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <span className="animate-pulse">Authenticating...</span>
                            ) : (
                                <span>{isSignup ? 'Create Secure Account' : 'Access Dashboard'}</span>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-8 flex items-center gap-4">
                        <div className="h-px bg-slate-800 flex-1"></div>
                        <span className="text-slate-500 text-xs font-medium uppercase">Or continue with</span>
                        <div className="h-px bg-slate-800 flex-1"></div>
                    </div>

                    {/* Social Login */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-3 hover:border-slate-700 group"
                    >
                        <div className="bg-white p-0.5 rounded-full">
                            <img src="https://www.google.com/favicon.ico" alt="Google" className="h-4 w-4" />
                        </div>
                        <span className="group-hover:text-white transition-colors">Sign in with Google</span>
                    </button>

                    {/* Footer Info */}
                    <div className="mt-12 pt-6 border-t border-slate-900 flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-2 text-emerald-500/80 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/10">
                            <ShieldCheck className="h-3 w-3" />
                            <span className="font-semibold tracking-wide">HIPAA COMPLIANT</span>
                        </div>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
                            <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
                            <a href="#" className="hover:text-slate-300 transition-colors">Help</a>
                        </div>
                    </div>

                </div>
            </div>

            {/* RIGHT SIDE: MARKETING */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-slate-900 to-slate-950 relative overflow-hidden items-center justify-center border-l border-slate-800">
                {/* Background Decor */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

                {/* Abstract Visualization */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[100px] animate-pulse"></div>

                <div className="relative z-10 max-w-lg px-12">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/20 backdrop-blur-sm shadow-xl shadow-blue-500/5">
                        <Activity className="h-8 w-8 text-blue-500" />
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        AI-Powered <br />
                        <span className="text-blue-500">Patient Insights</span>
                    </h2>

                    <p className="text-lg text-slate-400 mb-12 leading-relaxed">
                        Real-time Vitals Monitoring for Modern Healthcare Providers.
                        Neurowell integrates seamlessly with hospital systems to provide
                        predictive analytics at point of care.
                    </p>

                    <div className="grid grid-cols-2 gap-8 border-t border-slate-800 pt-8">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <CheckCircle className="h-5 w-5 text-emerald-500" />
                                <span className="text-2xl font-bold text-white">99.9%</span>
                            </div>
                            <span className="text-sm text-slate-500">Uptime SLA</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Server className="h-5 w-5 text-blue-500" />
                                <span className="text-2xl font-bold text-white">256-bit</span>
                            </div>
                            <span className="text-sm text-slate-500">Encryption</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Login;
