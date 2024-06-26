"use client"
import { Course, Degree } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"

export default function EditDegree() {
    const router = useRouter();
    const query = useSearchParams();
    const [degreeName, setDegreeName] = useState("");
    const [degreeLevel, setDegreeLevel] = useState("");
    const [courses, setCourses] = useState([] as Course[]);

    useEffect(() => {
        const name = query.get("name");
        const level = query.get("level");
        if (!name || !level) {
            router.push("/degrees");
        }
        const handleFetch = async () => {
            const res = await fetch("/api/degrees");
            const data = await res.json();
            const degree = data.find((degree: Degree) => degree.name === name && degree.level === level);
            if (!degree) {
                router.push("/degrees");
            }
            const courseRes = await fetch(`/api/courses?degreeName=${degree.name}&degreeLevel=${degree.level}`);
            const courseData = await courseRes.json();
            setCourses(courseData);
            setDegreeName(degree.name);
            setDegreeLevel(degree.level);
        }
        handleFetch();
    }, [query, router])

    return (
        <>
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <div className="z-10 max-w-xl w-full items-center justify-between text-sm lg:flex lg:flex-col">
                    <h1 className="text-4xl font-bold text-center mb-4">Edit Degree {degreeLevel} {degreeName}</h1>
                    <h2 className="text-2xl font-bold text-center mt-4">Courses</h2>
                    <div className="grid grid-cols-3 gap-4">
                        {courses.map((course, index) => (
                            <div key={index} className="w-full p-4 border border-gray-300 rounded-lg mb-4">
                                <p className="text-lg font-bold">{course.name}</p>
                                <p className="text-sm">{course.courseNumber}</p>
                                <p className="text-sm">{course.isCore ? "Core" : "Elective"}</p>
                            </div>
                        ))}
                    </div>
                    {(courses.length === 0) && <p className="text-sm text-gray-300">No courses found</p>}
                    <button onClick={() => router.push(`/courses/add?degreeName=${degreeName}&degreeLevel=${degreeLevel}`)} className="bg-blue-500 w-full text-white rounded-lg p-2 mt-4">Add Course</button>
                    <button onClick={() => router.push("/degrees")} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 self-start">Back</button>
                </div>
            </main>
        </>
    )
}
