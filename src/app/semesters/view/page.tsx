"use client"
import { Course, CourseEvaluation, Instructor, Section } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"

export default function ViewSemester() {
    const router = useRouter();
    const query = useSearchParams();
    const [sections, setSections] = useState([] as (Section & { instructor: Instructor, course: Course, evaluations: CourseEvaluation[] })[]);

    useEffect(() => {
        const handleFetch = async () => {
            if (!query.get("semester") || !query.get("year")) return router.push("/semesters");
            const res = await fetch(`/api/sections?semester=${query.get("semester")}&year=${query.get("year")}`);
            const data = await res.json();
            setSections(data);
        }
        handleFetch();
    }, [router, query])

    return (
        <>
            <main className="flex flex-col items-center justify-between p-24">
                <div className="z-10 max-w-3xl w-full items-center justify-between text-sm">
                    <h1 className="text-4xl font-bold text-center mb-4">{query.get("semester")} {query.get("year")}</h1>
                    <div className="grid grid-cols-3 gap-4">
                        {sections.map((section, index) => (
                            <div key={index} className="w-full p-4 border border-gray-300 rounded-lg mb-4 flex flex-col">
                                <p className="text-lg font-bold">{section.course.courseNumber} - {section.course.name}</p>
                                <p className="text-sm">Section {section.sectionNumber}</p>
                                <p className="text-sm">Instructor: {section.instructor.name}</p>
                                <p className="text-sm">Number of Students: {section.num_students}</p>
                                <div className="flex-grow min-h-8" />
                                {section.evaluations.length === 0 && <p className="text-lg text-red-500">No evaluations!</p>}
                                {section.evaluations.length > 0 && <p className="text-lg text-green-500">Evaluations entered</p>}
                            </div>
                        ))}
                    </div>
                    <button onClick={() => router.push("/semesters")} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 self-start">Back</button>
                </div>

            </main>
        </>
    )
}
