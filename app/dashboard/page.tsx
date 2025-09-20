// file: app/dashboard/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  PlusCircle,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import profile from "./../images/profile.png";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

// --- Types ---
interface FoodLog {
  id: string;
  date: string; // yyyy-mm-dd
  imageUrl: string;
  name: string;
  meal: "Breakfast" | "Lunch" | "Dinner" | "Snack";
}

export default function Page() {
  const router = useRouter();

  // ===== User (header) =====
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("User");
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  // ===== Foods (server-side pagination) =====
  const [foods, setFoods] = useState<FoodLog[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / pageSize)),
    [total, pageSize]
  );

  const isExternalUrl = (u?: string | null) => !!u && /^https?:\/\//i.test(u);

  // ===== Load user once =====
  useEffect(() => {
    (async () => {
      let uid: string | null = null;
      const { data: auth } = await supabase.auth.getUser();
      uid = auth?.user?.id ?? localStorage.getItem("user_id") ?? null;
      if (!uid) {
        router.push("/login");
        return;
      }
      setUserId(uid);

      // profile (ใช้ cache localStorage ก่อน)
      let name = localStorage.getItem("fullname");
      let avatar = localStorage.getItem("user_image_url");
      if ((!name || !avatar) && uid) {
        const { data: urow } = await supabase
          .from("user_tb")
          .select("fullname, user_image_url")
          .eq("id", uid)
          .single();
        if (urow) {
          name = urow.fullname ?? name ?? "User";
          avatar = urow.user_image_url ?? avatar ?? null;
          localStorage.setItem("fullname", name || "");
          if (avatar) localStorage.setItem("user_image_url", avatar);
        }
      }
      setUserName(name || "User");
      setUserAvatar(avatar || null);
    })();
  }, [router]);

  // ===== Fetch foods when user/page/search/pageSize changes =====
  useEffect(() => {
    if (!userId) return;
    (async () => {
      setLoading(true);
      try {
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        let query = supabase
          .from("food_tb")
          .select("id, foodname, meal, fooddate_at, food_image_url", {
            count: "exact",
          })
          .eq("user_id", userId);

        if (searchQuery.trim()) {
          query = query.ilike("foodname", `%${searchQuery.trim()}%`);
        }

        const { data: rows, count, error } = await query
          .order("fooddate_at", { ascending: false })
          .order("created_at", { ascending: false })
          .range(from, to);

        if (error) throw error;

        const mapped: FoodLog[] =
          rows?.map((r: any) => {
            const rawUrl: string | null = r.food_image_url ?? null;
            let imageUrl = "";
            if (isExternalUrl(rawUrl)) {
              imageUrl = rawUrl!;
            } else if (rawUrl) {
              const { data: p } = supabase.storage
                .from("food_bk")
                .getPublicUrl(rawUrl);
              imageUrl = p.publicUrl;
            }
            const dateStr =
              r.fooddate_at ?? new Date().toISOString().slice(0, 10);
            return {
              id: r.id,
              date: dateStr,
              imageUrl,
              name: r.foodname || "",
              meal: (r.meal || "Breakfast") as FoodLog["meal"],
            };
          }) || [];

        setFoods(mapped);
        setTotal(count ?? 0);

        const newTotalPages = Math.max(1, Math.ceil((count ?? 0) / pageSize));
        if (page > newTotalPages) setPage(newTotalPages);
      } catch (e: any) {
        console.error("fetch foods error:", e?.message || e);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId, page, pageSize, searchQuery]);

  // ===== Logout =====
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    localStorage.removeItem("user_id");
    localStorage.removeItem("fullname");
    localStorage.removeItem("user_image_url");
    router.push("/login");
  };

  // ===== Delete and refresh current page =====
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    const { error } = await supabase.from("food_tb").delete().eq("id", id);
    if (error) {
      alert("ลบไม่สำเร็จ: " + error.message);
      return;
    }
    if (foods.length === 1 && page > 1) setPage((p) => p - 1);
    else setPage((p) => p);
  };

  // avatar node — บังคับขนาดคงที่
  const avatarNode =
    isExternalUrl(userAvatar) && userAvatar ? (
      <img
        src={userAvatar}
        alt="User profile picture"
        width={40}
        height={40}
        className="rounded-full object-cover w-10 h-10 ring-1 ring-gray-600"
      />
    ) : (
      <Image
        src={profile}
        alt="User profile picture"
        width={40}
        height={40}
        className="rounded-full object-cover w-10 h-10 ring-1 ring-gray-600"
      />
    );

  return (
    <main className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-gray-900 via-gray-850 to-gray-800 text-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-300 hover:text-rose-400 transition-colors"
          aria-label="Logout"
        >
          <LogOut size={20} />
          <span className="hidden sm:inline">Logout</span>
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 text-center">
          My Food Diary
        </h1>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline font-semibold text-gray-300">
            {userName}
          </span>
          {avatarNode}
        </div>
      </div>

      {/* Card */}
      <div className="max-w-7xl mx-auto bg-gray-800/60 backdrop-blur-md rounded-3xl shadow-2xl p-6 border border-gray-700">
        {/* Add + Search */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <Link
            href="/addfood"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-500 text-gray-100 font-bold rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Add Food
            <PlusCircle size={20} />
          </Link>

          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search"
              className="w-full p-3 pl-10 rounded-lg border border-gray-600 bg-gray-700/70 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-900/40">
              <tr>
                <th className="p-3 font-semibold text-gray-200">Date</th>
                <th className="p-3 font-semibold text-gray-200">Food</th>
                <th className="p-3 font-semibold text-gray-200">Meal</th>
                <th className="p-3 text-right font-semibold text-gray-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="p-6 text-center text-gray-300" colSpan={4}>
                    Loading...
                  </td>
                </tr>
              ) : foods.length === 0 ? (
                <tr>
                  <td className="p-6 text-center text-gray-400" colSpan={4}>
                    No food logs found.
                  </td>
                </tr>
              ) : (
                foods.map((food) => (
                  <tr
                    key={food.id}
                    className="border-b border-gray-700/60 hover:bg-gray-700/30"
                  >
                    <td className="p-3 text-gray-200">{food.date}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        {/* บังคับขนาดรูปอาหารให้เท่ากันทั้งหมด */}
                        {food.imageUrl ? (
                          <img
                            src={food.imageUrl}
                            alt={food.name}
                            className="w-10 h-10 rounded-md object-cover ring-1 ring-gray-600"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-700 rounded-md" />
                        )}
                        <span className="font-medium text-gray-100">
                          {food.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-gray-200">{food.meal}</td>
                    <td className="p-3">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/updatefood/${food.id}`}
                          className="p-2 text-gray-300 hover:text-indigo-400"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(food.id)}
                          className="p-2 text-gray-300 hover:text-rose-400"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination + PageSize (ย้ายลงมาล่าง) */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6">
          <div className="text-sm text-gray-300">
            Showing{" "}
            <span className="font-semibold">
              {foods.length ? (page - 1) * pageSize + 1 : 0}
            </span>
            {"–"}
            <span className="font-semibold">
              {(page - 1) * pageSize + foods.length}
            </span>{" "}
            of <span className="font-semibold">{total}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Page size moved here */}
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="rounded-lg border border-gray-600 bg-gray-700/70 text-gray-100 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              title="Items per page"
            >
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
            </select>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700/70 text-gray-100 border border-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-700"
              >
                <ChevronLeft size={16} /> Previous
              </button>

              <span className="text-sm text-gray-300">
                Page <span className="font-semibold">{page}</span> of{" "}
                <span className="font-semibold">{totalPages}</span>
              </span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700/70 text-gray-100 border border-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-700"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
