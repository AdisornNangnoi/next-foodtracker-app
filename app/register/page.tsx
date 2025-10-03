"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const [gender, setGender] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fullName || !email || !password || !gender) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }


    let imageUrl: string | null = null;

    try {
      if (imageFile) {
        const safeName = imageFile.name.replace(/\s+/g, "_");
        const unique = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const objectName = `${unique}_${safeName}`; 

        const { error: uploadErr } = await supabase.storage
          .from("user_bk")
          .upload(objectName, imageFile, {
            upsert: true,
            contentType: imageFile.type,
            cacheControl: "3600",
          });

        if (uploadErr) throw uploadErr;

     
        const { data: pub } = supabase.storage.from("user_bk").getPublicUrl(objectName);
        imageUrl = pub.publicUrl ?? null;
      }
    } catch (err) {
      const error = err as Error;
      console.warn("Upload image error:", error?.message || error);
    }

    // insert ลงตาราง user_tb
    const { error } = await supabase.from("user_tb").insert({
      fullname: fullName,
      email,
      password, 
      gender,
      user_image_url: imageUrl,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("ลงทะเบียนสำเร็จ");
    router.push("/login");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError(null);

    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setFileError("ขนาดไฟล์ต้องไม่เกิน 10 MB");
        setImagePreview(null);
        setImageFile(null);
        return;
      }
      if (!["image/png", "image/jpeg"].includes(file.type)) {
        setFileError("รองรับเฉพาะไฟล์ PNG และ JPG");
        setImagePreview(null);
        setImageFile(null);
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
      setImageFile(null);
    }
  };

  const handleClearImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setFileError(null);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-4 font-sans text-center text-gray-100">
      <div className="flex w-full max-w-lg flex-col items-center justify-center rounded-2xl bg-gray-800/60 p-8 shadow-2xl backdrop-blur-md">
        {/* Back to Home */}
        <Link
          href="/"
          className="absolute left-4 top-4 text-gray-300 transition-colors hover:text-gray-100"
          aria-label="Back to Home"
        >
          <ArrowLeft size={24} />
        </Link>

        <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-gray-100 sm:text-4xl">
          Register
        </h1>

        <form onSubmit={handleRegister} className="w-full space-y-4">
          <input
            type="text"
            placeholder="ชื่อ-สกุล"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-md border border-gray-600 bg-gray-700/70 px-4 py-3 font-medium text-gray-100 placeholder-gray-400 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <input
            type="email"
            placeholder="อีเมล"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-600 bg-gray-700/70 px-4 py-3 font-medium text-gray-100 placeholder-gray-400 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <input
            type="password"
            placeholder="รหัสผ่าน"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-gray-600 bg-gray-700/70 px-4 py-3 font-medium text-gray-100 placeholder-gray-400 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />

          <div className="flex flex-col items-center justify-center space-y-4">
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full rounded-md border border-gray-600 bg-gray-700/70 px-4 py-3 font-medium text-gray-100 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            >
              <option value="" disabled className="bg-gray-700 text-gray-300">
                เลือกเพศ
              </option>
              <option value="male" className="bg-gray-700 text-gray-100">ชาย</option>
              <option value="female" className="bg-gray-700 text-gray-100">หญิง</option>
              <option value="other" className="bg-gray-700 text-gray-100">อื่นๆ</option>
            </select>

            {imagePreview ? (
              <div className="relative">
                <Image
                  src={imagePreview}
                  alt="Profile Preview"
                  width={112}
                  height={112}
                  className="h-28 w-28 rounded-full border-4 border-gray-300 object-cover shadow-lg"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={handleClearImage}
                  className="absolute right-0 top-0 rounded-full bg-rose-500 p-1 text-white hover:bg-rose-600 focus:outline-none"
                  aria-label="Cancel image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                       strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-dashed border-gray-500/70 bg-gray-700/40 text-gray-200 shadow-lg">
                  <span className="text-sm font-semibold text-gray-300 text-center">เลือกรูปภาพ</span>
                </div>
              </label>
            )}

            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept="image/png, image/jpeg"
              onChange={handleImageChange}
            />

            {fileError && (
              <p className="text-sm font-medium text-rose-300">{fileError}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full transform rounded-full bg-indigo-500 px-8 py-3 font-semibold text-gray-100 shadow-md transition duration-300 ease-in-out hover:scale-105 hover:bg-indigo-600"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300">
          มีบัญชีอยู่แล้ว?{" "}
          <Link href="/login" className="font-semibold text-indigo-400 hover:underline">
            เข้าสู่ระบบที่นี่
          </Link>
        </p>
      </div>
    </main>
  );
}
