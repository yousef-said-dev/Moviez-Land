"use client"
import { useProvider } from "@/store/Provider";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { signupSchema } from "@/utils/schemas";
import BackButton from "@/componnets/BackButton";

export default function Signup() {
  const { setUser, isLoggedIn, setIsLoggedIn, user } = useProvider();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    if (isLoggedIn) router.push('/search');
  }, [isLoggedIn, router])

  function handleSignup(e) {
    e.preventDefault();
    setErrors({});
    setGeneralError("");

    const validation = signupSchema.safeParse({ name, email, password });

    if (!validation.success) {
      const fieldErrors = {};
      validation.error.issues.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    toast.loading("Creating account...");

    fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    }).then(async res => {
      toast.dismiss();
      const data = await res.json();

      const status = res.status;
      if (status >= 200 && status < 300) {
        toast.success("Account created successfully!");

        router.push('/login');
      } else {
        setGeneralError(data?.error || 'Signup failed');
        if (status === 408 || status === 504) {
          toast.error("Request timed out. Please check your internet connection.");
        } else if (status === 0) {
          toast.error("Network Error. Please check your connection.");
        } else {
          toast.error(data.error || "Signup failed");
        }
      }

    }).catch(err => {
      toast.dismiss();
      console.error('signup error', err);
      setGeneralError('Network error');
      toast.error("Network Error. Please check your connection.");
    });
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-6">
      <div className="w-full max-w-md mb-6">
        <BackButton />
      </div>
      <div className="w-full max-w-md bg-gray-800/70 backdrop-blur-sm rounded-lg p-8 text-white shadow-lg">
        <h1 className="text-2xl font-semibold mb-4">Create an account</h1>
        <p className="text-sm text-gray-300 mb-6">Sign up to save favorites and get personalized recommendations.</p>

        {generalError && <div className="mb-4 text-sm text-red-500 bg-red-500/10 p-3 rounded border border-red-500/20">{generalError}</div>}

        <form onSubmit={handleSignup} className="space-y-4">
          <label className="block">
            <span className="text-sm text-gray-300">Name</span>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 rounded bg-gray-900 border ${errors.name ? 'border-red-500' : 'border-gray-700'} focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
          </label>

          <label className="block">
            <span className="text-sm text-gray-300">Email</span>
            <input
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 rounded bg-gray-900 border ${errors.email ? 'border-red-500' : 'border-gray-700'} focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
          </label>

          <label className="block">
            <span className="text-sm text-gray-300">Password</span>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 rounded bg-gray-900 border ${errors.password ? 'border-red-500' : 'border-gray-700'} focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors`}
            />
            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
          </label>

          <button type="submit" className="w-full py-2 rounded bg-indigo-600 hover:bg-indigo-500 transition font-bold shadow-lg shadow-indigo-600/20 active:scale-95 transform">Create account</button>
        </form>

        <div className="mt-6 text-center text-gray-300 text-sm">
          Already have an account? <Link href="/login" className="text-indigo-400 hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  )
}
