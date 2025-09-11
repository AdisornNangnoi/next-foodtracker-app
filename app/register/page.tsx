"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

/**
 * A functional component for the registration page of the Food Tracker application.
 *
 * @returns {JSX.Element} The Register page component.
 */
export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const router = useRouter();

  /**
   * Handles the form submission for user registration.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The form event.
   */
  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add logic for registration, e.g., calling an API
    console.log('ลงทะเบียน:', { fullName, email, password, gender, imagePreview });
    // router.push('/dashboard'); // Uncomment and replace with actual navigation after successful registration
  };

  /**
   * Handles the file input change and sets the image preview.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input file change event.
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError(null);

    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setFileError('ขนาดไฟล์ต้องไม่เกิน 10 MB');
        setImagePreview(null);
        return;
      }

      if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
        setFileError('รองรับเฉพาะไฟล์ PNG และ JPG');
        setImagePreview(null);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  /**
   * Handles the click event to clear the image preview.
   */
  const handleClearImage = () => {
    setImagePreview(null);
    setFileError(null);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-red-400 via-green-500 to-blue-600 p-4 font-sans text-center text-white">
      <div className="flex w-full max-w-lg flex-col items-center justify-center rounded-2xl bg-white/30 p-8 shadow-xl backdrop-blur-md">
        {/* Back to Home Button */}
        <Link href="/" className="absolute left-4 top-4 text-gray-500 transition-colors hover:text-gray-800" aria-label="Back to Home">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Register
        </h1>
        <form onSubmit={handleRegister} className="w-full space-y-4">
          <input
            type="text"
            placeholder="ชื่อ-สกุล"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-md border-0 bg-white/50 px-4 py-3 font-medium text-white placeholder-white/80 transition duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
          <input
            type="email"
            placeholder="อีเมล"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border-0 bg-white/50 px-4 py-3 font-medium text-white placeholder-white/80 transition duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
          <input
            type="password"
            placeholder="รหัสผ่าน"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border-0 bg-white/50 px-4 py-3 font-medium text-white placeholder-white/80 transition duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
          <div className="flex flex-col items-center justify-center space-y-4">
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full rounded-md border-0 bg-white/50 px-4 py-3 font-medium text-white placeholder-white/80 transition duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            >
              <option value="" disabled className="text-gray-400 bg-blue-500">เลือกเพศ</option>
              <option value="male" className="bg-blue-500">ชาย</option>
              <option value="female" className="bg-blue-500">หญิง</option>
              <option value="other" className="bg-blue-500">อื่นๆ</option>
            </select>
            {imagePreview && (
              <div className="relative">
                <img src={imagePreview} alt="Profile Preview" className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-lg" />
                <button
                  type="button"
                  onClick={handleClearImage}
                  className="absolute right-0 top-0 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 focus:outline-none"
                  aria-label="Cancel image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            {!imagePreview && (
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-dashed border-white/50 bg-white/20 text-white shadow-lg">
                  {/* SVG icon for camera */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10 opacity-70">
                    <path d="M4 4h4.5l1.5-3h4l1.5 3H20a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm8 11.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" />
                  </svg>
                </div>
              </label>
            )}
            <input id="file-upload" type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleImageChange} />
            {fileError && <p className="text-sm font-medium text-red-300">{fileError}</p>}
          </div>
          <button type="submit" className="w-full transform rounded-full bg-sky-600 px-8 py-3 font-semibold text-white shadow-md transition duration-300 ease-in-out hover:scale-105 hover:bg-sky-500">
            Register
          </button>
        </form>

        <p className="mt-4 text-sm">
          มีบัญชีอยู่แล้ว?{" "}
          <Link href="/login" className="font-semibold text-sky-600 hover:underline">
            เข้าสู่ระบบที่นี่
          </Link>
        </p>
      </div>
    </main>
  );
};
