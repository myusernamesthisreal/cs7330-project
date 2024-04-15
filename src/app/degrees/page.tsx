"use client"
import { Degree } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

export default function ViewDegrees() {
    const [degrees, setDegrees] = useState([] as Degree[]);
    const router = useRouter();
    useEffect(() => {
        const handleFetch = async () => {
            const res = await fetch("/api/degrees");
            const data = await res.json();
            setDegrees(data);
        }
        handleFetch();
    }, [])
    return (
        <>
            <main className="flex flex-col items-center justify-between p-24">
                <div className="z-10 max-w-3xl w-full items-center justify-between text-sm">
                    <h1 className="text-4xl font-bold text-center mb-4">Degrees</h1>
                    <div className="grid grid-cols-3 gap-4">
                    {degrees.map((degree, index) => (
                        <div key={index} className="w-full p-4 border border-gray-300 rounded-lg mb-4">
                            <p className="text-lg font-bold">{degree.name}</p>
                            <p className="text-sm">{degree.level}</p>
                            <button onClick={() => router.push(`/degrees/courses?name=${degree.name}&level=${degree.level}`)} className="bg-blue-500 w-full text-white rounded-lg p-2 mt-4">View Courses</button>
                            <button onClick={() => router.push(`/degrees/edit?name=${degree.name}&level=${degree.level}`)} className="bg-blue-500 w-full text-white rounded-lg p-2 mt-4">Edit</button>
                        </div>
                    ))}
                    </div>
                    <button onClick={() => router.push("/")} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 self-start">Back</button>
                </div>

            </main>
        </>
    )
}
