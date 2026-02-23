"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProvider } from "@/store/Provider";
import { Github, Mail, Phone, ArrowRight } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { loginSchema } from "@/utils/schemas";
import BackButton from "@/componnets/BackButton";
import { auth as firebaseAuth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

export default function Login() {
  const { isLoggedIn } = useProvider();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  const [isPhoneMode, setIsPhoneMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) router.push('/');
  }, [isLoggedIn, router])

  useEffect(() => {
    if (isPhoneMode && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(firebaseAuth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {

        }
      });
    }
  }, [isPhoneMode]);

  async function handleLogin(e) {
    e.preventDefault();
    setErrors({});
    setGeneralError("");

    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      const fieldErrors = {};
      validation.error.issues.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    toast.loading("Logging in...");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      toast.dismiss();

      if (result?.error) {
        setGeneralError(result.code || "Login failed");
        toast.error(result.code || "Login failed");
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        toast.success("Login Successful!");
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      toast.dismiss();
      setIsLoading(false);
      console.error('login error', err);
      toast.error('An unexpected error occurred.');
    }
  }

  async function handleSendOtp() {
    if (!phoneNumber) return toast.error("Please enter a phone number");

    toast.loading("Sending OTP...");
    const appVerifier = window.recaptchaVerifier;

    try {
      const confirmationResult = await signInWithPhoneNumber(firebaseAuth, phoneNumber, appVerifier);
      setVerificationId(confirmationResult);
      toast.dismiss();
      toast.success("OTP sent successfully!");
    } catch (error) {
      toast.dismiss();
      console.error("Error sending OTP:", error);
      toast.error(error.message || "Failed to send OTP");
    }
  }

  async function handleVerifyOtp() {
    if (!otp) return toast.error("Please enter OTP");

    toast.loading("Verifying OTP...");
    try {
      const result = await verificationId.confirm(otp);
      const user = result.user;


      const nextAuthResult = await signIn("phone", {
        phoneNumber: user.phoneNumber,
        name: user.displayName || `User-${user.phoneNumber.slice(-4)}`,
        redirect: false,
      });

      toast.dismiss();
      if (nextAuthResult?.ok) {
        toast.success("Login Successful!");
        router.push('/');
        router.refresh();
      } else {
        toast.error("NextAuth sign-in failed");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Error verifying OTP:", error);
      toast.error("Invalid OTP code");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B1120] p-6">
      <div className="w-full max-w-md mb-6">
        <BackButton />
      </div>

      <div className="w-full max-w-md bg-gray-800/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10 text-white shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent italic">
            {isPhoneMode ? "PHONE LOGIN" : "WELCOME BACK"}
          </h1>
          <p className="text-sm text-gray-400 font-medium tracking-wide">
            {isPhoneMode ? "Enter your phone number to receive OTP" : "Step into the land of movies"}
          </p>
        </div>

        {generalError && (
          <div className="mb-6 text-sm text-red-500 bg-red-500/10 p-4 rounded-xl border border-red-500/20 flex items-center gap-3 animate-shake">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            {generalError}
          </div>
        )}

        {!isPhoneMode ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                <input
                  value={email}
                  type="email"
                  placeholder="name@example.com"
                  onChange={e => setEmail(e.target.value)}
                  className={`block w-full pl-11 pr-4 py-3 rounded-xl bg-gray-900/50 border ${errors.email ? 'border-red-500' : 'border-white/5'} focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm`}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-400 ml-1">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={`block w-full px-4 py-3 rounded-xl bg-gray-900/50 border ${errors.password ? 'border-red-500' : 'border-white/5'} focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm`}
                />
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-400 ml-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-all font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 group"
            >
              Log in <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            {!verificationId ? (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-green-500 transition-colors" />
                  <input
                    value={phoneNumber}
                    type="tel"
                    placeholder="+1 234 567 890"
                    onChange={e => setPhoneNumber(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 rounded-xl bg-gray-900/50 border border-white/5 focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-500/10 transition-all text-sm"
                  />
                </div>
                <button
                  onClick={handleSendOtp}
                  className="w-full mt-4 py-3.5 rounded-xl bg-green-600 hover:bg-green-500 transition-all font-black text-sm uppercase tracking-widest shadow-xl shadow-green-600/30"
                >
                  Send OTP
                </button>
                <div id="recaptcha-container"></div>
              </div>
            ) : (
              <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Enter 6-Digit Code</label>
                <input
                  value={otp}
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  onChange={e => setOtp(e.target.value)}
                  className="block w-full px-4 py-4 text-center text-2xl font-black tracking-[0.5em] rounded-xl bg-gray-900/50 border border-white/5 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
                <button
                  onClick={handleVerifyOtp}
                  className="w-full mt-4 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 transition-all font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-600/30"
                >
                  Verify & Login
                </button>
                <button
                  onClick={() => setVerificationId(null)}
                  className="w-full py-2 text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors"
                >
                  Change Phone Number
                </button>
              </div>
            )}
          </div>
        )}

        <div className="my-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/5" />
          <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">OR CONTINUE WITH</span>
          <div className="h-px flex-1 bg-white/5" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => signIn("google", { callbackUrl: '/' })}
            className="flex items-center justify-center gap-3 py-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group"
          >
            <FcGoogle className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-gray-300">Google</span>
          </button>
          <button
            onClick={() => signIn("github", { callbackUrl: '/' })}
            className="flex items-center justify-center gap-3 py-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group"
          >
            <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-gray-300">GitHub</span>
          </button>
        </div>

        <button
          onClick={() => setIsPhoneMode(!isPhoneMode)}
          className="w-full mt-6 py-4 rounded-xl border border-dashed border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-all text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2"
        >
          {isPhoneMode ? <Mail className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />}
          Continue with {isPhoneMode ? "Email" : "Phone Number"}
        </button>

        <div className="mt-10 text-center flex flex-col gap-2">
          <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
            Don't have an account?
          </p>
          <Link href="/signup" className="text-sm font-black text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-widest">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  )
}

