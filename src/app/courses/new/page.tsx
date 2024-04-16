"use client"
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function NewDegree() {

    const router = useRouter();
    const [error, setError] = useState("");
    const [name, setName] = useState("");
    const [courseNumber, setCourseNumber] = useState("");
    const [isCore, setIsCore] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setSubmitted(true);
        const res = await fetch("/api/courses", {
            method: "POST",
            body: JSON.stringify({
                name: name,
                courseNumber: courseNumber,
                isCore: isCore,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (res.ok) {
            router.push("/");
        } else {
            const data = await res.json();
            setError(data.reason || "Something went wrong");
        }
        setSubmitted(false);
    }

    return (
        <>
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <div className="z-10 max-w-xl w-full items-center justify-between text-sm lg:flex lg:flex-col">
                    <h1 className="text-4xl font-bold text-center mb-4">New Course</h1>
                    <div className="w-full">
                        <p className="text-sm text-gray-300 mb-2">Course Name:</p>
                        <input type="text" placeholder="Course Name" value={name} onChange={(e) => setName(e.target.value)} className="p-2 border border-gray-300 text-black rounded-lg w-full mb-4" />
                    </div>
                    <div className="w-full">
                        <p className="text-sm text-gray-300 mb-2">Course Number:</p>
                        <input type="text" placeholder="Course Number" value={courseNumber} onChange={(e) => setCourseNumber(e.target.value)} className="p-2 border border-gray-300 text-black rounded-lg w-full mb-4" />
                    </div>
                    <div className="w-full flex">
                        <p className="text-sm text-gray-300 mb-2">Core Course:</p>
                        <input type="checkbox" checked={isCore} onChange={(e) => setIsCore(e.target.checked)} className="p-2 border border-gray-300 text-black rounded-lg w-full mb-4" />
                    </div>
                    <button disabled={submitted} className="p-2 bg-blue-500 text-white rounded-lg w-full" type="submit" onClick={handleSubmit}>Create Course</button>
                    {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                </div>
            </main>
        </>
    )
}
