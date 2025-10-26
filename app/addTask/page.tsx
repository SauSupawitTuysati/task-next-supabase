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
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ✅ ฟังก์ชันอัปโหลดรูปไป Supabase Storage (bucket: task_bk)
  const handleUploadImage = async () => {
    if (!file) return null;

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `task-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("task_bk")
      .upload(filePath, file);

    if (uploadError) {
      setErrorMsg("อัปโหลดรูปไม่สำเร็จ");
      return null;
    }

    const { data } = supabase.storage.from("task_bk").getPublicUrl(filePath);
    return data.publicUrl;
  };

  // 📝 บันทึกข้อมูล
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!title.trim()) {
      setErrorMsg("กรุณากรอก Title");
      return;
    }

    setLoading(true);

    // ✅ ถ้ามีไฟล์ให้ upload ก่อน แล้วค่อยบันทึก URL จริง
    let finalUrl = "";
    if (file) {
      const uploadedUrl = await handleUploadImage();
      if (uploadedUrl) finalUrl = uploadedUrl;
    }

    const { error } = await supabase.from("task_tb").insert([
      {
        title,
        detail,
        image_url: finalUrl, // ✅ เก็บ URL จริงจาก Storage เท่านั้น
        is_completed: isComplete,
      },
    ]);

    setLoading(false);
    if (error) setErrorMsg(error.message);
    else router.push("/allTask");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 flex flex-col justify-between">
      <div className="max-w-3xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-black">
          เพิ่ม Task
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-6 rounded-lg shadow-lg border border-gray-200"
        >
          {errorMsg && (
            <div className="bg-red-100 text-red-700 p-2 rounded">{errorMsg}</div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block font-semibold mb-1 text-black">
              Title <span className="text-red-600">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-400"
              placeholder="เช่น เขียนโค้ด / อ่านหนังสือ"
              required
            />
          </div>

          {/* Detail */}
          <div>
            <label htmlFor="detail" className="block font-semibold mb-1 text-black">
              Detail
            </label>
            <textarea
              id="detail"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-400"
              placeholder="รายละเอียดเพิ่มเติม..."
            ></textarea>
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="imageFile" className="block font-semibold mb-1 text-black">
              รูปภาพ
            </label>
            <input
              id="imageFile"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const selected = e.target.files?.[0] || null;
                setFile(selected);
                if (selected) {
                  setPreviewUrl(URL.createObjectURL(selected));
                }
              }}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none text-black file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-white file:bg-blue-600 file:hover:bg-blue-700 file:cursor-pointer"
            />

            {previewUrl && (
              <div className="mt-3">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-40 h-40 object-cover rounded border border-gray-300"
                />
              </div>
            )}
          </div>

          {/* Completed checkbox */}
          <div className="flex items-center gap-2">
            <input
              id="isComplete"
              type="checkbox"
              checked={isComplete}
              onChange={() => setIsComplete(!isComplete)}
              className="w-4 h-4 accent-blue-600"
            />
            <label htmlFor="isComplete" className="font-semibold text-black">
              Completed
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "กำลังบันทึก..." : "บันทึก"}
            </button>

            <Link
              href="/allTask"
              className="px-5 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 text-black transition"
            >
              ยกเลิก
            </Link>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
