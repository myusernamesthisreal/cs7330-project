"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

export default function ViewSemesters() {
    const [semesters, setSemesters] = useState([] as {semester: String, year: String}[]);
    const router = useRouter();
    useEffect(() => {
        const handleFetch = async () => {
            const res = await fetch("/api/semesters");
            const data = await res.json();
            setSemesters(data);
        }
        handleFetch();
    }, [])
    return (
        <>
            <main className="flex flex-col items-center justify-between p-24">
                <div className="z-10 max-w-3xl w-full items-center justify-between text-sm">
                    <h1 className="text-4xl font-bold text-center mb-4">Semesters</h1>
                    <div className="grid grid-cols-3 gap-4">
                    {semesters.map((semester, index) => (
                        <div key={index} className="w-full p-4 border border-gray-300 rounded-lg mb-4">
                            <p className="text-lg font-bold">{semester.semester} {semester.year}</p>
                            <button onClick={() => router.push(`/semesters/view?semester=${semester.semester}&year=${semester.year}`)} className="bg-blue-500 w-full text-white rounded-lg p-2 mt-4">View Sections</button>
                        </div>
                    ))}
                    </div>
                    <button onClick={() => router.push("/")} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 self-start">Back</button>
                </div>

            </main>
        </>
    )
}
