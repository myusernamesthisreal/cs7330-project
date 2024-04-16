"use client"
import { Course, Degree } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"

export default function NewCourse() {
    const router = useRouter();
    const query = useSearchParams();
    const [degreeName, setDegreeName] = useState("");
    const [degreeLevel, setDegreeLevel] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [courses, setCourses] = useState([] as Course[]);
    const [searched, setSearched] = useState(false);

    const handleSearch = async () => {
        const res = await fetch(`/api/courses?query=${searchQuery}`);
        const data = await res.json();
        setCourses(data);
        setSearched(true);
    }

    const handleAdd = async (index: number) => {
        const res = await fetch("/api/degreecourses", {
            method: "PUT",
            body: JSON.stringify({
                associations: [
                    {
                        degreeName,
                        degreeLevel,
                        courseNumber: courses[index].courseNumber,
                    }
                ]
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (res.ok) {
            router.push(`/degrees/edit?name=${degreeName}&level=${degreeLevel}`);
        }
    }

    useEffect(() => {
        const handleFetch = async () => {
            const name = query.get("degreeName");
            const level = query.get("degreeLevel");
            if (!name || !level) {
                router.push("/degrees");
            }
            const res = await fetch("/api/degrees");
            const data = await res.json();
            const degree = data.find((degree: Degree) => degree.name === name && degree.level === level);
            if (!degree) {
                router.push("/");
            }
            setDegreeName(degree.name);
            setDegreeLevel(degree.level);
        }
        handleFetch();
    }, [router, query])
    return (
        <>
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <div className="z-10 max-w-xl w-full items-center justify-between text-sm lg:flex lg:flex-col">
                    <h1 className="text-4xl font-bold text-center mb-4">Add Course to Degree {degreeLevel + " " + degreeName}</h1>
                    <input type="text" placeholder="Search for a course" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="p-2 border border-gray-300 text-black rounded-lg w-full mb-4" />
                    <button onClick={handleSearch} className="p-2 bg-blue-500 text-white rounded-lg w-full">Search</button>
                    <div className="grid grid-cols-3 gap-4">
                        {courses.map((course, index) => (
                            <div key={index} className="w-full p-4 border border-gray-300 rounded-lg mb-4">
                                <p className="text-lg font-bold">{course.name}</p>
                                <p className="text-sm">{course.courseNumber}</p>
                                <p className="text-sm">{course.isCore ? "Core" : "Elective"}</p>
                                <button onClick={() => handleAdd(index)} className="bg-blue-500 w-full text-white rounded-lg p-2 mt-4">Add Course</button>
                            </div>
                        ))}
                    </div>
                    {(courses.length === 0 && searched) && <p className="text-sm text-gray-300">No courses found</p>}
                </div>
            </main>
        </>
    )
}
