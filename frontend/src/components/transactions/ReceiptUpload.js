"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/api";

export default function ReceiptUpload({ setReceiptUrl }) {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("receipt", file);

    const res = await apiRequest(
      "/receipts",
      "POST",
      formData,
      true
    );

    setReceiptUrl(res.filePath);
    alert("Uploaded!");
  };

  return (
    <div className="flex gap-2">
      <input
        type="file"
        onChange={(e) =>
          setFile(e.target.files[0])
        }
      />
      <button
        type="button"
        onClick={handleUpload}
        className="bg-purple-500 text-white px-3"
      >
        Upload
      </button>
    </div>
  );
}
