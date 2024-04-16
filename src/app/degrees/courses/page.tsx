"use client"
import { Course } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function DegreeCourses() {
    const router = useRouter();
    const query = useSearchParams();
    const [courses, setCourses] = useState([] as Course[]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const handleFetch = async () => {
            const name = query.get("name");
            const level = query.get("level");
            if (!name || !level) {
                router.push("/degrees");
            }
            const res = await fetch(`/api/courses?degreeName=${name}&degreeLevel=${level}`);
            const data = await res.json();
            setCourses(data);
            setLoaded(true);
        }
        handleFetch();
    }, [query, router])
    return (
        <>
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex lg:flex-col">
                    <h1 className="text-4xl font-bold text-center mb-4">Courses for {query.get("level") + " " + query.get("name")}</h1>
                    <div className="grid grid-cols-3 gap-4">
                        {courses.map((course, index) => (
                            <div key={index} className="w-full p-4 border border-gray-300 rounded-lg mb-4">
                                <p className="text-lg font-bold">{course.courseNumber}</p>
                                <p className="text-sm">{course.name}</p>
                                <p className="text-sm">{course.isCore ? "Core" : "Elective"}</p>
                            </div>
                        ))}
                    </div>
                    {(loaded && courses.length === 0) && <p className="text-gray-300 text-sm mt-4">No courses found</p>}
                    <button onClick={() => router.push("/degrees")} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 self-start">Back</button>
                </div>
            </main>

        </>
    )
}
