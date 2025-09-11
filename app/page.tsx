import Image from "next/image";
import foodbanner from "./images/foodbanner.jpg";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 p-4 font-sans text-center text-white">
      {/* Main content container with a bright, cheerful gradient background */}
      {/* Main Heading */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">
        Welcome to Food Tracker
      </h1>
      <br />
      {/* Subheading */}
      <p className="mb-8 text-lg font-medium text-white sm:text-xl">
        Track your meal!!!
      </p>
      <div className="flex w-full max-w-lg flex-col items-center justify-center rounded-2xl bg-white/70 p-8 shadow-xl backdrop-blur-md">
        {/* Food Tracker image */}
        <div className="mb-10 w-48 overflow-hidden rounded-full border-4 border-blue-500 shadow-lg sm:w-64">
          <Image src={foodbanner} alt="Food Tracker" width={300} height={200} />
        </div>
        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Link
            href="/register"
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-full shadow-md transition-transform transform hover:scale-105 duration-300"
          >
            Register
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-full shadow-md transition-transform transform hover:scale-105 duration-300"
          >
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
