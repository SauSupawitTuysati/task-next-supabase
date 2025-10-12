"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "../components/Footer";

export default function AddTask() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!title.trim()) {
      setErrorMsg("กรุณากรอก Title");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("task_tb").insert([
      {
        title,
        detail,
        image_url: imageUrl,
        is_completed: isComplete,
      },
    ]);

    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
    } else {
      router.push("/allTask");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-2">
      <h1 className="text-3xl font-bold mb-2 text-center">เพิ่ม Task</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded shadow-md"
      >
        {errorMsg && (
          <div className="bg-red-100 text-red-700 p-2 rounded">{errorMsg}</div>
        )}

        <div>
          <label htmlFor="title" className="block font-semibold mb-1">
            Title <span className="text-red-600">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="detail" className="block font-semibold mb-1">
            Detail
          </label>
          <textarea
            id="detail"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div>
          <label htmlFor="imageUrl" className="block font-semibold mb-1">
            Image URL
          </label>
          <input
            id="imageUrl"
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="isComplete"
            type="checkbox"
            checked={isComplete}
            onChange={() => setIsComplete(!isComplete)}
            className="w-4 h-4"
          />
          <label htmlFor="isComplete" className="font-semibold">
            Completed
          </label>
        </div>

        <div className="flex gap-4 justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "กำลังบันทึก..." : "บันทึก"}
          </button>

          <Link
            href="/allTask"
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          >
            ยกเลิก
          </Link>
        </div>
      </form>

      <Footer />
    </div>
  );
}
