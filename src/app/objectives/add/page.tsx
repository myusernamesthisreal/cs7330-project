"use client"
import { LearningObjective } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"

export default function AddObjective() {
    const router = useRouter();
    const query = useSearchParams();
    const [courseNumber, setCourseNumber] = useState("");
    const [courseName, setCourseName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [objectives, setObjectives] = useState([] as LearningObjective[]);
    const [searched, setSearched] = useState(false);

    const handleSearch = async () => {
        const res = await fetch(`/api/objectives?query=${searchQuery}`);
        const data = await res.json();
        setObjectives(data);
        setSearched(true);
    }

    const handleAdd = async (index: number) => {
        const res = await fetch("/api/courseobjectives", {
            method: "PUT",
            body: JSON.stringify({
                associations: [
                    {
                        courseNumber,
                        objectiveId: objectives[index].id,
                    }
                ]
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (res.ok) {
            router.push(`/courses/edit?courseNumber=${courseNumber}`);
        }
    }

    useEffect(() => {
        const handleFetch = async () => {
            const number = query.get("courseNumber");
            if (!number) {
                router.push("/courses");
            }
            const res = await fetch(`/api/courses?courseNumber=${number}`);
            const data = await res.json();
            if (!data) {
                router.push("/");
            }
            setCourseName(data.name);
            setCourseNumber(data.courseNumber);
        }
        handleFetch();
    }, [router, query])
    return (
        <>
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <div className="z-10 max-w-xl w-full items-center justify-between text-sm lg:flex lg:flex-col">
                    <h1 className="text-4xl font-bold text-center mb-4">Add Objective to Course {courseNumber}: {courseName}</h1>
                    <input type="text" placeholder="Search for an objective" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="p-2 border border-gray-300 text-black rounded-lg w-full mb-4" />
                    <button onClick={handleSearch} className="p-2 bg-blue-500 text-white rounded-lg w-full">Search</button>
                    <div className="grid grid-cols-3 gap-4">
                        {objectives.map((objective, index) => (
                            <div key={index} className="w-full p-4 border border-gray-300 rounded-lg mb-4">
                                <p className="text-lg font-bold">{objective.title}</p>
                                <p className="text-sm">{objective.description.length > 50 ? objective.description.substring(0,50) + "..." : objective.description}</p>
                                <button onClick={() => handleAdd(index)} className="bg-blue-500 w-full text-white rounded-lg p-2 mt-4">Add Objective</button>
                            </div>
                        ))}
                    </div>
                    {(objectives.length === 0 && searched) && <p className="text-sm text-gray-300">No objectives found</p>}
                </div>
            </main>
        </>
    )
}
