"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Footer from "../components/Footer";

type Task = {
  id: number;
  title: string;
  detail: string;
  image_url: string;
  is_completed: boolean;
};

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase.from("task_tb").select("*");
      if (error) console.error(error);
      else setTasks(data || []);
    };
    fetchTasks();
  }, []);

  const handleDelete = async (id: number, task: string) => {
    const confirmed = confirm(`ต้องการลบ Task: "${task}" ใช่หรือไม่?`);
    if (!confirmed) return;

    const { error } = await supabase.from("task_tb").delete().eq("id", id);
    if (error) {
      alert("ลบไม่สำเร็จ: " + error.message);
    } else {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      alert("ลบ Task เรียบร้อย ✅");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-black">
        Task List
      </h1>

      {/* ปุ่มเพิ่ม Task */}
      <div className="overflow-x-auto mb-4 flex justify-end">
        <Link
          href="/addTask"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          ➕ เพิ่ม Task
        </Link>
      </div>

      {/* ตาราง Task */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 text-left text-black">
              <th className="py-3 px-4 border-b border-gray-300">Title</th>
              <th className="py-3 px-4 border-b border-gray-300">Detail</th>
              <th className="py-3 px-4 border-b border-gray-300">Image</th>
              <th className="py-3 px-4 border-b border-gray-300">Completed</th>
              <th className="py-3 px-4 border-b border-gray-300 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500 italic">
                  ไม่มีข้อมูล Task
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr
                  key={task.id}
                  className="hover:bg-gray-50 border-b border-gray-200 transition"
                >
                  <td className="py-2 px-4 font-semibold text-black">{task.title}</td>
                  <td
                    className="py-2 px-4 max-w-xs truncate text-gray-800"
                    title={task.detail}
                  >
                    {task.detail}
                  </td>
                  <td className="py-2 px-4">
                    {task.image_url ? (
                      <img
                        src={task.image_url}
                        alt={task.title}
                        className="w-16 h-16 object-cover rounded border border-gray-300"
                      />
                    ) : (
                      <span className="text-gray-400 italic">No image</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {task.is_completed ? (
                      <span className="text-green-600 font-semibold">Completed</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Incomplete</span>
                    )}
                  </td>
                  <td className="py-2 px-4 flex gap-2 justify-center">
                    <Link
                      href={`/updateTask/${task.id}`}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                      onClick={() => handleDelete(task.id, task.title)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Footer />
    </div>
  );
}
