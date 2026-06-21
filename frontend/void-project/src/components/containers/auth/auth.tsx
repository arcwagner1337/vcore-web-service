import { useState, useEffect } from 'react';
import { Visualizer } from '../../small/visualizer';

export default function AuthModal({ onClose, onLogin }: any) {
    const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
    const [resetStep, setResetStep] = useState(1);
    const [resetCode, setResetCode] = useState('');
    const [authError, setAuthError] = useState(false);
    const [loading, setLoading] = useState(false);

    const [identifier, setIdentifier] = useState('');
    const [accessKey, setAccessKey] = useState('');
    const [email, setEmail] = useState('');
    const [showResetLink, setShowResetLink] = useState(false);
    const [confirmAccessKey, setConfirmAccessKey] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [registerStep, setRegisterStep] = useState(1);
    const [registerCode, setRegisterCode] = useState('');


  
    const [resendTimer, setResendTimer] = useState(0);
    const [canResend, setCanResend] = useState(true);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        } else {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    const clearInputs = () => {
        setIdentifier('');
        setAccessKey('');
        setConfirmAccessKey('');
        setEmail('');
        setResetCode('');
        setAuthError(false);
        setRegisterStep(1);
        setRegisterCode('');
    };

    const switchMode = (newMode: 'login' | 'register' | 'reset') => {
        clearInputs();
        setMode(newMode);
        setResetStep(1);
        if (newMode !== 'login') setShowResetLink(false);
    };

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

       
        if (mode === 'reset' && resetStep === 2 && accessKey !== confirmAccessKey) {
            setAuthError(true);
            setErrorMessage('passwords not match')
            setTimeout(() => setAuthError(false), 2000);
            return;
        }

        
        if (mode === 'register' && (!identifier || !email || !accessKey)) {
            setAuthError(true);
            setErrorMessage("FIELDS_CANNOT_BE_EMPTY");
            setTimeout(() => setAuthError(false), 2000);
            return;
        }

        if (mode === 'register' && !isValidEmail(email)) {
            setAuthError(true);
            setErrorMessage('invalid email')
            setTimeout(() => setAuthError(false), 2000);
            return;
        }

        
        if (mode === 'reset' && resetStep === 1 && !canResend) return;

        setLoading(true);
        setAuthError(false);

        const API_URL =  import.meta.env.VITE_API_URL;

        try {
            let endpoint = '';
            let payload = {};

            if (mode === 'login') {
                endpoint = import.meta.env.VITE_LOGIN_ENDPOINT;
                payload = { username: identifier, password: accessKey };
            } else if (mode === 'register') {
                
                payload = { username: identifier, password: accessKey, email: email };

                if (registerStep === 1) {
                    endpoint = import.meta.env.VITE_REG_REQ_ENDPOINT;
                    payload = { username: identifier, password: accessKey, email: email };
                }
              
                else {
                    endpoint = import.meta.env.VITE_REG_CONF_ENDPOINT;
                    payload = { username: identifier, code: registerCode };
                }

            } else if (mode === 'reset') {
                if (resetStep === 1) {
                    endpoint = import.meta.env.VITE_RESET_REQ_ENDPOINT;
                    payload = { email: identifier };
                } else {
                    endpoint = import.meta.env.VITE_RESET_CONF_ENDPOINT;
                    payload = { email: identifier, code: resetCode, password: accessKey };
                }
            }

            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                if (mode === 'reset') {
                    if (resetStep === 1) {
                        setAccessKey('');
                        setResetStep(2);
                        
                        setCanResend(false);
                        setResendTimer(60);
                    } else {
                        switchMode('login');
                        alert("ACCESS_KEY UPDATED. INITIALIZE AGAIN.");
                    }
                }
                else if (mode === 'register') {
                    if (registerStep === 1) {
                        setRegisterStep(2); 
                        setCanResend(false); 
                        setResendTimer(60);
                    } else {
                        onLogin({ username: data.username, role: data.role || 'User' });
                        onClose();
                    }
                }
                else {
                    onLogin({ username: data.username, role: data.role || 'Node Access' });
                    
                    onClose();
                }
            } else {

                throw new Error(data.error || 'Operation failed');
            }
        } catch (err) {
            setAuthError(true);
            if (mode === 'login') setShowResetLink(true);
        } finally {
            setLoading(false);
            setTimeout(() => setAuthError(false), 2000);
        }
    };

    const handleInputChange = (inputType: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[а-яёА-ЯЁ]/g, '');
        switch (inputType) {
            case 'login': setIdentifier(value); break;
            case 'email': setEmail(value); break;
            case 'pass': setAccessKey(value); break;
            case 'pass2': setConfirmAccessKey(value); break;
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90" onClick={onClose} />

            <div className={`relative bg-[#070707] border transition-all duration-500 
                ${authError ? 'border-red-500 animate-shake' : 'border-cyan-500/20'}
                ${mode === 'register' ? 'max-w-[550px] w-full' : 'max-w-[380px] w-full'}`}>

                <div className={`h-1 w-full transition-colors duration-500 ${authError ? 'bg-red-500' : 'bg-cyan-500'}`} />

                <form onSubmit={handleSubmit} className="p-10 pb-20 relative z-10">
                    <button type="button" onClick={onClose} className="absolute top-4 right-5 text-white/20 hover:text-white text-xs font-mono z-50 transition-colors">X</button>

                    <h2 className="text-3xl font-black italic uppercase text-white mb-8">
                        VOID<span className={authError ? 'text-red-500' : 'text-cyan-400'}>CORE</span>
                        {errorMessage && authError && (
                            <div className="text-[10px] not-italic font-mono text-red-500 mt-1 tracking-tighter animate-pulse">
                                › ERROR: {errorMessage}
                            </div>
                        )}
                    </h2>

                    <div className="space-y-4">
                        {mode === 'reset' ? (
                            <>
                                {resetStep === 1 ? (
                                    <input
                                        value={identifier}
                                        onChange={handleInputChange('login')}
                                        className="w-full bg-white/[0.02] border border-white/5 p-4 text-xs font-bold text-white focus:border-cyan-500/50 outline-none"
                                        placeholder="ENTER_RECOVERY_EMAIL"
                                    />
                                ) : (
                                    <>
                                        <div className="text-[10px] text-cyan-500/50 mb-2 font-mono uppercase">Target: {identifier}</div>
                                        <input
                                            value={resetCode}
                                            onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').substring(0, 6))}
                                            className="w-full bg-white/[0.02] border border-cyan-500/30 p-4 text-xs font-bold text-cyan-400 outline-none"
                                            placeholder="VERIFICATION_CODE"
                                        />
                                        <input
                                            type="password"
                                            value={accessKey}
                                            onChange={handleInputChange('pass')}
                                            className={`w-full bg-white/[0.02] border p-4 text-xs font-bold text-white outline-none transition-colors 
                                                ${accessKey !== confirmAccessKey && confirmAccessKey ? 'border-red-500/50' : 'border-white/5 focus:border-cyan-500/50'}`}
                                            placeholder="NEW_ACCESS_KEY"
                                        />
                                        <input
                                            type="password"
                                            value={confirmAccessKey}
                                            onChange={handleInputChange('pass2')}
                                            className={`w-full bg-white/[0.02] border p-4 text-xs font-bold text-white outline-none transition-colors 
                                                ${accessKey !== confirmAccessKey && confirmAccessKey ? 'border-red-500/50' : 'border-white/5 focus:border-cyan-500/50'}`}
                                            placeholder="CONFIRM_NEW_KEY"
                                        />
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                            {registerStep === 1 ?(
                                <input
                                    value={identifier}
                                    onChange={handleInputChange('login')}
                                    className="w-full bg-white/[0.02] border border-white/5 p-4 text-xs font-bold text-white focus:border-cyan-500/50 outline-none"
                                    placeholder={mode === 'register' ? "LOGIN" : "LOGIN/EMAIL"}
                                />
                            ):(<></>)}
                                {mode === 'register' && (
                                    <>
                                        {registerStep === 1 ? (
                                            <input
                                                value={email}
                                                onChange={handleInputChange('email')}
                                                className="w-full bg-white/[0.02] border border-white/5 p-4 text-xs font-bold text-white focus:border-cyan-500/50 outline-none"
                                                placeholder="EMAIL_ADDRESS"
                                            />
                                        ) : (
                                            <input
                                                value={registerCode}
                                                onChange={(e) => setRegisterCode(e.target.value.replace(/\D/g, '').substring(0, 6))}
                                                className="w-full bg-white/[0.02] border border-cyan-500/30 p-4 text-xs font-bold text-cyan-400 outline-none"
                                                placeholder="ENTER_VERIFICATION_CODE"
                                            />
                                        )}
                                    </>
                                )}
                                {registerStep === 1 ?(
                                <input
                                    type="password"
                                    value={accessKey}
                                    onChange={handleInputChange('pass')}
                                    className="w-full bg-white/[0.02] border border-white/5 p-4 text-xs font-bold text-white focus:border-cyan-500/50 outline-none"
                                    placeholder="ACCESS_KEY"
                                />):(<></>)}
                                {mode === 'login' && showResetLink && (
                                    <button
                                        type="button"
                                        onClick={() => switchMode('reset')}
                                        className="block w-full text-center text-[9px] text-white/50 hover:text-white-400 mt-2 uppercase tracking-widest transition-colors"
                                    >
                                        Lost Access? [Recovery Mode]
                                    </button>
                                )}
                            </>
                        )}
                    </div>

                  
                    <button
                        type="submit"
                        disabled={loading || (mode === 'reset' && resetStep === 1 && !canResend)}
                        className={`w-full py-5 mt-8 font-black uppercase tracking-[0.4em] text-[10px] transition-all
                            ${authError ? 'bg-red-600' : 'bg-cyan-500 text-black hover:opacity-70'}
                            ${(mode === 'reset' && resetStep === 1 && !canResend) ? 'opacity-30 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'WAIT...' :
                            mode === 'reset' ? (
                                resetStep === 1 ? (canResend ? 'Send Code' : `Retry in ${resendTimer}s`) : 'Confirm Reset'
                            ) :
                                mode === 'login' ? 'Initialize' : 'Register'}
                    </button>

                
                    <button
                        type="button"
                        onClick={() => {
                            if (mode === 'reset' && resetStep === 2) {
                                setResetStep(1); 
                            } else {
                                switchMode(mode === 'login' ? 'register' : 'login');
                            }
                        }}
                        className="w-full mt-6 text-[8px] font-black uppercase text-white/20 hover:text-white/100 transition-colors"
                    >
                        {mode === 'reset' && resetStep === 2 ? "— Back to email —" : (mode === 'login' ? "— register —" : "— Back —")}
                    </button>
                </form>

                <div className="absolute bottom-0 inset-x-0 opacity-40">
                    <Visualizer authError={authError} setAuthError={setAuthError} />
                </div>
            </div>
        </div>
    );
}