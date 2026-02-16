"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiRequest("/auth/profile");
        setUser(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchProfile();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Profile
      </h1>

      <div className="bg-white p-6 shadow rounded w-96">
        <div className="mb-4">
          <p className="text-gray-500 text-sm">Name</p>
          <p className="font-semibold">{user.name}</p>
        </div>

        <div className="mb-4">
          <p className="text-gray-500 text-sm">Email</p>
          <p className="font-semibold">{user.email}</p>
        </div>

        <div className="mb-4">
          <p className="text-gray-500 text-sm">Preferred Currency</p>
          <p className="font-semibold">
            {user.preferred_currency || "USD"}
          </p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Account Created</p>
          <p className="font-semibold">
            {new Date(user.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
