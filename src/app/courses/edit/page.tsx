"use client"
import { CourseObjective, LearningObjective } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"

type CourseObjectiveWithObjective = CourseObjective & { learningObjective: LearningObjective };

export default function EditCourse() {
    const router = useRouter();
    const query = useSearchParams();
    const [courseNumber, setCourseNumber] = useState("");
    const [learningObjectives, setLearningObjectives] = useState([] as (CourseObjectiveWithObjective)[]);

    useEffect(() => {
        const courseNumber = query.get("courseNumber");
        if (!courseNumber) {
            router.push("/courses");
        }
        const handleFetch = async () => {
            const res = await fetch(`/api/courses?courseNumber=${courseNumber}`);
            const data = await res.json();
            if (!data) {
                router.push("/");
            }
            const objectiveRes = await fetch(`/api/objectives?courseNumber=${courseNumber}`);
            const objectiveData = await objectiveRes.json();
            setLearningObjectives(objectiveData);
            setCourseNumber(data.courseNumber);
        }
        handleFetch();
    }, [query, router])

    return (
        <>
            <main className="flex flex-col items-center justify-between p-24">
                <div className="z-10 max-w-3xl w-full items-center justify-between text-sm flex flex-col">
                    <h1 className="text-4xl font-bold text-center mb-4">Edit Course</h1>
                    <div className="w-full mb-4">
                        <h2 className="text-2xl text-gray-300 mb-2">Learning Objectives:</h2>
                        <div className="grid grid-cols-3 gap-4">
                            {learningObjectives.map((objective, index) => (
                                <div key={index} className="w-full p-4 border border-gray-300 rounded-lg mb-4">
                                    <p className="text-lg font-bold">{objective.learningObjective.title}</p>
                                    <p className="text-sm">{objective.learningObjective.description}</p>
                                </div>
                            ))}
                        </div>
                        {(learningObjectives.length === 0) && <p className="text-sm text-gray-300">No learning objectives found</p>}
                    </div>
                    <button onClick={() => router.push(`/objectives/add?courseNumber=${courseNumber}`)} className="p-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-lg mt-4">Add Learning Objective</button>
                    <button onClick={() => router.push("/")} className="p-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-lg mt-4 self-start">Back</button>
                </div>
            </main>
        </>
    )
}
