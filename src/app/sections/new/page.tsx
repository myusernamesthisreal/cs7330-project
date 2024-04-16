"use client"
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function NewSection() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [sectionNumber, setSectionNumber] = useState("");
    const [courseNumber, setCourseNumber] = useState("");
    const [instructorId, setInstructorId] = useState("");
    const [semester, setSemester] = useState("");
    const [year, setYear] = useState("");
    const [num_students, setNumStudents] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setSubmitted(true);
        const res = await fetch("/api/sections", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                sectionNumber,
                courseNumber,
                instructorId,
                semester,
                year: Number(year),
                num_students: Number(num_students),
            }),
        });
        if (res.ok) {
            router.push("/");
        } else {
            const data = await res.json();
            setError(data.reason || "Something went wrong");
        }
        setSubmitted(false);
    };

    return (
        <>
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <div className="z-10 max-w-xl w-full items-center justify-between text-sm lg:flex lg:flex-col">
                    <h1 className="text-4xl font-bold text-center mb-4">New Section</h1>
                    <div className="w-full">
                        <p className="text-sm text-gray-300 mb-2">Section Number:</p>
                        <input type="text" placeholder="Section Number" value={sectionNumber} onChange={(e) => setSectionNumber(e.target.value)} className="p-2 border border-gray-300 text-black rounded-lg w-full mb-4" />
                    </div>
                    <div className="w-full">
                        <p className="text-sm text-gray-300 mb-2">Course Number:</p>
                        <input type="text" placeholder="Course Number" value={courseNumber} onChange={(e) => setCourseNumber(e.target.value)} className="p-2 border border-gray-300 text-black rounded-lg w-full mb-4" />
                    </div>
                    <div className="w-full">
                        <p className="text-sm text-gray-300 mb-2">Instructor ID:</p>
                        <input type="text" placeholder="Instructor ID" value={instructorId} onChange={(e) => setInstructorId(e.target.value)} className="p-2 border border-gray-300 text-black rounded-lg w-full mb-4" />
                    </div>
                    <div className="w-full">
                        <p className="text-sm text-gray-300 mb-2">Semester:</p>
                        <select value={semester} onChange={(e) => setSemester(e.target.value)} className="p-2 border border-gray-300 text-black rounded-lg w-full mb-4">
                            <option value="">Select Semester</option>
                            <option value="Fall">Fall</option>
                            <option value="Spring">Spring</option>
                        </select>
                    </div>
                    <div className="w-full">
                        <p className="text-sm text-gray-300 mb-2">Year:</p>
                        <input type="number" placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} className="p-2 border border-gray-300 text-black rounded-lg w-full mb-4" />
                    </div>
                    <div className="w-full">
                        <p className="text-sm text-gray-300 mb-2">Number of Students:</p>
                        <input type="number" placeholder="Number of Students" value={num_students} onChange={(e) => setNumStudents(e.target.value)} className="p-2 border border-gray-300 text-black rounded-lg w-full mb-4" />
                    </div>
                    <button disabled={submitted} className="p-2 bg-blue-500 text-white rounded-lg w-full" type="submit" onClick={handleSubmit}>Create Section</button>
                    {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                </div>
            </main>
        </>
    )
}