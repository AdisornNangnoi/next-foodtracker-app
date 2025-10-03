"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const isExternalUrl = (u?: string | null) => !!u && /^https?:\/\//i.test(u);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLoginClick = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    // ล็อกอินจากตาราง user_tb
    const { data, error } = await supabase
      .from("user_tb")
      .select("id, fullname, email, user_image_url")
      .eq("email", email)
      .eq("password", password) 
      .single();

    if (error || !data) {
      alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      return;
    }

  
    let finalAvatarUrl: string | null = null;

    if (data.user_image_url) {
      if (isExternalUrl(data.user_image_url)) {
        
        finalAvatarUrl = data.user_image_url;
      } else {
        
        const { data: pub } = supabase
          .storage
          .from("user_bk")
          .getPublicUrl(data.user_image_url);

        finalAvatarUrl = pub.publicUrl || null;

        
        if (finalAvatarUrl) {
          await supabase
            .from("user_tb")
            .update({ user_image_url: finalAvatarUrl })
            .eq("id", data.id);
        }
      }
    }

    // เก็บลง localStorage
    localStorage.setItem("user_id", data.id);
    localStorage.setItem("fullname", data.fullname ?? "");
    if (finalAvatarUrl) {
      localStorage.setItem("user_image_url", finalAvatarUrl);
    } else {
      localStorage.removeItem("user_image_url");
    }

    router.push("/dashboard");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-4 font-sans text-center text-gray-100">
      <div className="flex w-full max-w-lg flex-col items-center justify-center rounded-2xl bg-gray-800/60 p-8 shadow-2xl backdrop-blur-md">
        {/* Back to Home Button */}
        <Link
          href="/"
          className="absolute left-4 top-4 text-gray-300 hover:text-gray-100 transition-colors"
          aria-label="Back to Home"
        >
          <ArrowLeft size={24} />
        </Link>

        <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-gray-100 sm:text-4xl">
          Login
        </h1>

        <form onSubmit={handleLoginClick} className="w-full space-y-5">
          <input
            type="email"
            placeholder="อีเมล"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border border-gray-600 bg-gray-700/70 px-4 py-3 font-medium text-gray-100 placeholder-gray-400 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="password"
            placeholder="รหัสผ่าน"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-md border border-gray-600 bg-gray-700/70 px-4 py-3 font-medium text-gray-100 placeholder-gray-400 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            className="w-full transform rounded-full bg-indigo-500 px-8 py-3 font-semibold text-gray-100 shadow-md transition duration-300 ease-in-out hover:scale-105 hover:bg-indigo-600"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300">
          ไม่มีบัญชีใช่ไหม?{" "}
          <Link
            href="/register"
            className="font-semibold text-indigo-400 hover:underline"
          >
            ลงทะเบียนที่นี่
          </Link>
        </p>
      </div>
    </main>
  );
}
