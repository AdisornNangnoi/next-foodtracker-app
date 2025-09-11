"use client";

import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";

export default function EditFoodPage() {
  const [foodName, setFoodName] = useState("ข้าวผัด"); // mock ค่าเดิม
  const [mealType, setMealType] = useState("อาหารกลางวัน");
  const [foodImage, setFoodImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFoodImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Editing food entry:", {
      foodName,
      mealType,
      foodImage,
    });

    setShowSaveMessage(true);
    setTimeout(() => setShowSaveMessage(false), 3000);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-red-400 via-green-500 to-blue-600 p-4 font-sans text-white">
      {/* Header */}
      <div className="flex w-full max-w-lg items-center justify-between mb-6">
        <a href="/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-white transition-colors font-semibold">
          <ArrowLeft size={20} />
          Back to dashboard
        </a>
      </div>

      {/* Edit form card */}
      <div className="flex w-full max-w-lg flex-col items-center rounded-2xl bg-white/30 p-8 shadow-xl backdrop-blur-md">
        <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-gray-800 sm:text-4xl">
          Edit Food detail
        </h1>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          {/* Food Name */}
          <input
            type="text"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            placeholder="ชื่ออาหาร"
            className="w-full rounded-full border-0 bg-white/50 px-6 py-4 font-medium text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />

          {/* Meal Type */}
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className="w-full rounded-full border-0 bg-white/50 px-6 py-4 font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="อาหารเช้า">อาหารเช้า</option>
            <option value="อาหารกลางวัน">อาหารกลางวัน</option>
            <option value="อาหารเย็น">อาหารเย็น</option>
            <option value="ของว่าง">ของว่าง</option>
          </select>

          {/* Food Image */}
          <div className="flex flex-col items-center space-y-4">
            <label htmlFor="foodImage" className="cursor-pointer">
              {previewImage ? (
                <img src={previewImage} alt="Food Preview" className="h-40 w-40 rounded-2xl border-4 border-white object-cover shadow-lg" />
              ) : (
                <div className="flex h-40 w-40 items-center justify-center rounded-2xl border-4 border-dashed border-white/50 bg-white/20 text-white shadow-lg">
                  <span className="text-sm font-semibold text-center">Select image</span>
                </div>
              )}
              <input id="foodImage" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full transform rounded-full bg-blue-600 px-8 py-4 font-semibold text-white shadow-md transition duration-300 ease-in-out hover:scale-105 hover:bg-green-500 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Save Changes
          </button>
        </form>

        {/* Success message */}
        {showSaveMessage && (
          <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-red-400 via-green-500 to-blue-600">
            <div className="rounded-lg bg-green-500 px-8 py-6 text-white text-center shadow-lg">
              <p className="font-bold">Save changes success!</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
