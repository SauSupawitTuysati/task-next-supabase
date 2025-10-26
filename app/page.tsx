import Image from "next/image";
import Link from "next/link";
import img from "../assets/images/to-do-list.png";
import Footer from "../app/components/Footer";

export default function Home() {
  return (
    <div className="font-sans grid place-items-center min-h-screen p-8 sm:p-20 bg-gray-100 text-gray-800">
      <main className="flex flex-col gap-8 items-center">
        <Image
          src={img}
          alt="to-do-list"
          width={180}
          height={38}
          priority
          className="drop-shadow-md"
        />

        <Link
          href="/allTask"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
        >
          เริ่มต้นใช้งาน TASK APP
        </Link>
      </main>
      <Footer />
    </div>
  );
}
