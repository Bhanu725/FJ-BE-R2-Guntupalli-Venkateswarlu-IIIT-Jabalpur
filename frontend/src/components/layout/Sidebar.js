"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-60 bg-gray-100 h-screen p-4">
      <ul className="space-y-4">
        <li><Link href="/dashboard">Dashboard</Link></li>
        <li><Link href="/transactions">Transactions</Link></li>
        <li><Link href="/categories">Categories</Link></li>
        <li><Link href="/profile">Profile</Link></li>
      </ul>
    </div>
  );
}
