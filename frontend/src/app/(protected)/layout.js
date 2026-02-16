"use client";

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import useAuth from "@/hooks/useAuth";

export default function ProtectedLayout({ children }) {
  useAuth();

  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="p-6 w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
