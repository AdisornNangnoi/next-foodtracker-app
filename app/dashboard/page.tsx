// file: app/dashboard/page.tsx

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  PlusCircle,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Home,
} from "lucide-react";
import profile from "./../images/profile.png";

// --- Mock User Data (เพิ่มเข้ามา) ---
const mockUser = {
  name: "MEW",
  profileImageUrl: profile, // รูปโปรไฟล์สุ่ม
};

// --- Type และ Mock Data สำหรับอาหาร (คงเดิม) ---
interface FoodLog {
  id: string;
  date: string;
  imageUrl: string;
  name: string;
  meal: "Breakfast" | "Lunch" | "Dinner" | "Snack";
}

const meals = ["Breakfast", "Lunch", "Dinner", "Snack"] as const;

const mockFoodData: FoodLog[] = Array.from({ length: 25 }, (_, i) => ({
  id: `${i + 1}`,
  date: new Date(2025, 8, 28 - Math.floor(i / 2)).toLocaleDateString("en-CA"),
  imageUrl: `https://picsum.photos/seed/${i + 1}/100/100`,
  name: [
    "Ramen Noodles",
    "Takoyaki",
    "Okonomiyaki",
    "Sushi Rolls",
    "Pancakes",
  ][i % 5],
  meal: meals[i % meals.length],
}));

export default function Page() {
  const [foods, setFoods] = useState<FoodLog[]>(mockFoodData);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredFoods = useMemo(() => {
    return foods.filter((food) =>
      food.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [foods, searchQuery]);

  const totalPages = Math.ceil(filteredFoods.length / itemsPerPage);
  const currentItems = filteredFoods.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setFoods((currentFoods) => currentFoods.filter((food) => food.id !== id));
    }
  };

  return (
    <main className="min-h-screen p-4 sm:p-8">
      {/* --- NEW: Header Section --- */}
      <div className="flex justify-between items-center mb-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-800 hover:text-blue-600 transition-colors"
        >
          <Home size={20} />
          <span className="hidden sm:inline">Home</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center">
          My Food Diary
        </h1>
        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className="hidden sm:inline font-semibold text-gray-700"
          >
            {mockUser.name}
          </Link>
          <Image
            src={mockUser.profileImageUrl}
            alt="User profile picture"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto bg-gray-300 backdrop-blur-sm rounded-3xl shadow-lg p-6">
        {/* --- Search and Add Section --- */}

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <Link
            href="/addfood"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Food
            <PlusCircle size={20} />
          </Link>
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search"
              className="w-full sm:w-80 p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* --- Food Log Table --- */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-300">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Food</th>
                <th className="p-3">Meal</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((food) => (
                <tr key={food.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{food.date}</td>
                  <td className="p-3 flex items-center gap-3">
                    <Image
                      src={food.imageUrl}
                      alt={food.name}
                      width={40}
                      height={40}
                      className="rounded-md object-cover"
                    />
                    <span className="font-medium">{food.name}</span>
                  </td>
                  <td className="p-3">{food.meal}</td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/updatefood/${food.id}`}
                        className="p-2 text-gray-500 hover:text-blue-600"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(food.id)}
                        className="p-2 text-gray-500 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredFoods.length === 0 && (
          <p className="text-center text-gray-500 py-10">No food logs found.</p>
        )}

        {/* --- Pagination Controls --- */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg disabled:opacity-50"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg disabled:opacity-50"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
