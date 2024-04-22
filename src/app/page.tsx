"use client"
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex">
        <div className="flex flex-col items-center justify-between w-full">
          <h1 className="text-4xl font-bold text-center">Welcome to the Program Evaluation Utility</h1>
          <h2 className="text-2xl font-bold text-center mt-4">View:</h2>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={() => router.push("/degrees")}>
            View Degrees
          </button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={() => router.push("/courses")}>
            View Courses
          </button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={() => router.push("/semesters")}>
            View Semesters
          </button>
          <h2 className="text-2xl font-bold text-center mt-4">Create New:</h2>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={() => router.push("/degrees/new")}>
            Add Degree
          </button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={() => router.push("/instructors/new")}>
            Add Instructor
          </button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={() => router.push("/courses/new")}>
            Add Course
          </button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={() => router.push("/sections/new")}>
            Add Section
          </button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={() => router.push("/objectives/new")}>
            Add Objective
          </button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={() => router.push("/evaluations/new")}>
            Add/Edit Evaluation
          </button>
        </div>
      </div>
    </main>
  );
}
