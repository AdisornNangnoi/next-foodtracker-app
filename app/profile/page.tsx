
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation"; 

type Gender = "male" | "female" | "other" | "";

export default function ProfilePage() {
  const router = useRouter(); 
  const [userId, setUserId] = useState<string | null>(null);

  // ฟอร์ม
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<Gender>("");
  const [newPassword, setNewPassword] = useState("");

  // รูป
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [oldImageUrl, setOldImageUrl] = useState<string | null>(null); // Public URL เดิม

  // UI
  const [saving, setSaving] = useState(false);
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ===== โหลดข้อมูลผู้ใช้ =====
  useEffect(() => {
    (async () => {
      let uid: string | null = null;
      const { data: auth } = await supabase.auth.getUser();
      uid = auth?.user?.id ?? localStorage.getItem("user_id") ?? null;
      if (!uid) {
        window.location.href = "/login";
        return;
      }
      setUserId(uid);

      const { data, error } = await supabase
        .from("user_tb")
        .select("fullname, email, gender, user_image_url")
        .eq("id", uid)
        .single();

      if (error) {
        alert("ดึงข้อมูลโปรไฟล์ไม่สำเร็จ: " + error.message);
        return;
      }
      if (!data) return;

      setFullName(data.fullname ?? "");
      setEmail(data.email ?? "");
      setGender((data.gender as Gender) ?? "");

     
      if (data.user_image_url) {
        setPreviewImage(data.user_image_url);
        setOldImageUrl(data.user_image_url);
      } else {
        setPreviewImage(null);
        setOldImageUrl(null);
      }
    })();
  }, []);

  const urlToPath = (publicUrl: string): string | null => {
    try {
      const u = new URL(publicUrl);
      const marker = `/object/public/user_bk/`;
      const idx = u.pathname.indexOf(marker);
      if (idx === -1) return null;
      return decodeURIComponent(u.pathname.slice(idx + marker.length));
    } catch {
      return null;
    }
  };

  // เปลี่ยนไฟล์รูป
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    setPreviewImage(URL.createObjectURL(f));
  };

  // ===== บันทึก =====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setSaving(true);
    try {
      let finalImageUrl: string | null = oldImageUrl ?? null;

      // ถ้าเลือกรูปใหม่ -> อัปโหลดก่อน, ได้ URL แล้วค่อยลบรูปเก่า
      let uploadedObjectName: string | null = null;
      if (imageFile) {
        const safe = imageFile.name.replace(/\s+/g, "_");
        const unique = `${Date.now()}_${Math.random()
          .toString(36)
          .slice(2, 8)}_${safe}`;

        const { error: upErr } = await supabase.storage
          .from("user_bk")
          .upload(unique, imageFile, {
            upsert: true,
            cacheControl: "3600",
            contentType: imageFile.type,
          });

        if (upErr) {
          alert("อัปโหลดรูปไม่สำเร็จ: " + upErr.message);
          setSaving(false);
          return;
        }

        uploadedObjectName = unique;
        const { data: pub } = supabase.storage
          .from("user_bk")
          .getPublicUrl(unique);
        finalImageUrl = pub.publicUrl;

        // ลบไฟล์เก่า 
        if (oldImageUrl) {
          const oldPath = urlToPath(oldImageUrl);
          if (oldPath) {
            await supabase.storage.from("user_bk").remove([oldPath]);
          }
        }
      }

      // เตรียม payload
      const payload: Record<string, string | null> = {
        fullname: fullName,
        email,
        gender,
        user_image_url: finalImageUrl,
        updated_at: new Date().toISOString(),
      };
      if (newPassword.trim()) {
        
        payload.password = newPassword.trim();
      }

      const { error: upProfileErr } = await supabase
        .from("user_tb")
        .update(payload)
        .eq("id", userId);

      if (upProfileErr) {
        
        if (uploadedObjectName) {
          await supabase.storage.from("user_bk").remove([uploadedObjectName]);
        }
        alert("บันทึกไม่สำเร็จ: " + upProfileErr.message);
        setSaving(false);
        return;
      }

      // อัปเดต localStorage ให้ header อัปเดตทันที
      localStorage.setItem("fullname", fullName || "");
      if (finalImageUrl) {
        localStorage.setItem("user_image_url", finalImageUrl);
      } else {
        localStorage.removeItem("user_image_url");
      }

      setOldImageUrl(finalImageUrl); 
      setShowSaveMessage(true);
      setTimeout(() => {
        setShowSaveMessage(false);
        router.push("/dashboard");
      }, 700);
    } catch (err) {
      alert("เกิดข้อผิดพลาด: " + (err as Error)?.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-850 to-gray-800 p-4 font-sans text-gray-100">
      {/* Back */}
      <div className="absolute left-4 top-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-gray-300 hover:text-gray-100 transition-colors font-semibold"
          aria-label="Back to dashboard"
        >
          <ArrowLeft size={20} />
          Back to dashboard
        </Link>
      </div>

      {/* Card */}
      <div className="flex w-full max-w-lg flex-col items-center rounded-2xl bg-gray-800/60 p-8 shadow-2xl backdrop-blur-md border border-gray-700">
        <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-gray-100 sm:text-4xl">
          Update Profile
        </h1>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          {/* Full name */}
          <div className="relative">
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="ชื่อ-สกุล"
              className="w-full rounded-full border border-gray-600 bg-gray-700/70 px-6 py-4 font-medium text-gray-100 placeholder-gray-400 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="อีเมล"
              className="w-full rounded-full border border-gray-600 bg-gray-700/70 px-6 py-4 font-medium text-gray-100 placeholder-gray-400 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          {/* Gender */}
          <div className="relative">
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender)}
              className="w-full rounded-full border border-gray-600 bg-gray-700/70 px-6 py-4 font-medium text-gray-100 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="" className="bg-gray-800 text-gray-100" disabled>
                เลือกเพศ
              </option>
              <option value="male" className="bg-gray-800 text-gray-100">
                ชาย
              </option>
              <option value="female" className="bg-gray-800 text-gray-100">
                หญิง
              </option>
              <option value="other" className="bg-gray-800 text-gray-100">
                อื่นๆ
              </option>
            </select>
          </div>

          {/* New password */}
          <div className="relative">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="รหัสผ่านใหม่ (ถ้าต้องการเปลี่ยน)"
              className="w-full rounded-full border border-gray-600 bg-gray-700/70 px-6 py-4 font-medium text-gray-100 placeholder-gray-400 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Image upload */}
          <div className="flex flex-col items-center space-y-4">
            <label className="cursor-pointer">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile Preview"
                  className="h-28 w-28 rounded-full border-4 border-gray-300 object-cover shadow-lg"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-dashed border-gray-500/70 bg-gray-700/40 text-gray-200 shadow-lg">
                  <ImageIcon className="h-10 w-10 opacity-70" />
                </div>
              )}
              <input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>

          {/* Save */}
          <button
            type="submit"
            disabled={saving}
            className="w-full transform rounded-full bg-indigo-500 px-8 py-4 font-semibold text-gray-100 shadow-md transition duration-300 ease-in-out hover:scale-105 hover:bg-indigo-600 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Save size={20} />
            {saving ? "กำลังบันทึก..." : "บันทึกโปรไฟล์"}
          </button>
        </form>

        {/* Success modal */}
        {showSaveMessage && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900/70">
            <div className="rounded-lg bg-indigo-600 px-8 py-6 text-white text-center shadow-lg">
              <p className="font-bold">บันทึกสำเร็จ!</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
