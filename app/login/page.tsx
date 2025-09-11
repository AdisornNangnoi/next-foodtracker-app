'use client';
import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLoginClick = (e: React.FormEvent) => {
    e.preventDefault();
    // เอาemail/password ไปตรวจสอบ
    router.push('/dashboard');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 p-4 font-sans text-center text-white">
      <div className="flex w-full max-w-lg flex-col items-center justify-center rounded-2xl bg-white/30 p-8 shadow-xl backdrop-blur-md">
        {/* Back to Home Button */}
        <Link href="/" className="absolute left-4 top-4 text-white transition-colors hover:text-gray-200" aria-label="Back to Home">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-white drop-shadow-lg sm:text-4xl">
          Login
        </h1>
        <form onSubmit={handleLoginClick} className="w-full space-y-4">
          <input
            type="email"
            placeholder="อีเมล"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border-0 bg-white/50 px-4 py-3 font-medium text-white placeholder-white/80 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="รหัสผ่าน"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border-0 bg-white/50 px-4 py-3 font-medium text-white placeholder-white/80 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="w-full transform rounded-full bg-white px-8 py-3 font-semibold text-blue-600 shadow-md transition duration-300 ease-in-out hover:scale-105 hover:bg-gray-200">
            Login
          </button>
        </form>
        
        <p className="mt-4 text-sm">
          ไม่มีบัญชีใช่ไหม?{' '}
          <Link href="/register" className="font-semibold text-blue-800 hover:underline">
            ลงทะเบียนที่นี่
          </Link>
        </p>
      </div>
    </main>
  );
};
