"use client";
import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddFoodPage() {
  const router = useRouter();
  // State for form fields
  const [foodName, setFoodName] = useState("");
  const [mealType, setMealType] = useState("อาหารเช้า");
  const [foodImage, setFoodImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  // Handle image file selection and create a URL for preview
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFoodImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Saving food entry:", {
      foodName,
      mealType,
      foodImage,
    });

    setShowSaveMessage(true);
    setTimeout(() => {
      setShowSaveMessage(false);
      router.push('/dashboard');
    }, 3000);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 p-4 font-sans text-white">
      {/* Navigation and header */}
      <div className="absolute left-4 top-4">
        <a
          href="/dashboard"
          className="flex items-center gap-2 text-white transition-colors hover:text-gray-200 font-semibold"
          aria-label="Back to dashboard"
        >
          <ArrowLeft size={20} />
          Back to dashboard
        </a>
      </div>

      {/* Main content card with form */}
      <div className="flex w-full max-w-lg flex-col items-center rounded-2xl bg-white/30 p-8 shadow-xl backdrop-blur-md">
        <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-white drop-shadow-lg sm:text-4xl">
          Add Food list
        </h1>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          {/* Food Name Input */}
          <div className="relative">
            <input
              type="text"
              id="foodName"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="ชื่ออาหาร"
              className="w-full rounded-full border-0 bg-white/50 px-6 py-4 font-medium text-gray-900 placeholder-gray-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Meal Type Dropdown */}
          <div className="relative">
            <select
              id="mealType"
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="w-full rounded-full border-0 bg-white/50 px-6 py-4 font-medium text-gray-900 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="อาหารเช้า">อาหารเช้า</option>
              <option value="อาหารกลางวัน">อาหารกลางวัน</option>
              <option value="อาหารเย็น">อาหารเย็น</option>
              <option value="ของว่าง">ของว่าง</option>
            </select>
          </div>

          {/* Image Upload */}
          <div className="flex flex-col items-center space-y-4">
            <label htmlFor="foodImage" className="cursor-pointer">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Food Preview"
                  className="h-40 w-40 rounded-2xl border-4 border-white object-cover shadow-lg"
                />
              ) : (
                <div className="flex h-40 w-40 items-center justify-center rounded-2xl border-4 border-dashed border-white/50 bg-white/20 text-white shadow-lg">
                  <span className="text-sm font-semibold text-gray-600 text-center">
                    เลือกรูปภาพ
                  </span>
                </div>
              )}
              <input
                id="foodImage"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full transform rounded-full bg-white px-8 py-4 font-semibold text-blue-600 shadow-md transition duration-300 ease-in-out hover:scale-105 hover:bg-gray-200 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            บันทึก
          </button>
        </form>

        {/* Success message modal */}
        {showSaveMessage && (
          <div className="fixed inset-0 flex items-center justify-center bg-blue-900 bg-opacity-70">
            <div className="rounded-lg bg-blue-500 px-8 py-6 text-white text-center shadow-lg">
              <p className="font-bold">บันทึกสำเร็จ!</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
