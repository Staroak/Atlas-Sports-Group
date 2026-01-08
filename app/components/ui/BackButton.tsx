"use client";

import { useRouter, usePathname } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  // Hide on homepage
  if (pathname === "/") {
    return null;
  }

  return (
    <button
      onClick={() => router.back()}
      className="fixed bottom-6 left-6 w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 hover:scale-110 transition-all z-50 cursor-pointer"
      aria-label="Go back"
    >
      <svg
        className="w-6 h-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
  );
}
