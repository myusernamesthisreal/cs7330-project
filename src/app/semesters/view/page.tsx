"use client"
import { Course, CourseEvaluation, Instructor, Section } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"

export default function ViewSemester() {
    const router = useRouter();
    const query = useSearchParams();
    const [sections, setSections] = useState([] as (Section & { instructor: Instructor, course: Course, evaluations: CourseEvaluation[], isEvaluated: Boolean })[]);
    const [targetGrade, setTargetGrade] = useState(0);

    const findNumGrades = (section: (Section & { instructor: Instructor, course: Course, evaluations: CourseEvaluation[] })) => {
        let count = 0;
        if (targetGrade >= 90) return section.evaluations.reduce((acc, count) => acc + count.numAs, 0);
        if (targetGrade >= 80) return section.evaluations.reduce((acc, count) => acc + count.numAs + count.numBs, 0);
        if (targetGrade >= 70) return section.evaluations.reduce((acc, count) => acc + count.numAs + count.numBs + count.numCs, 0);
        return count;
    }
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
                    <div className="flex flex-row">
                        <h2 className="text-2xl font-bold text-center mt-4 me-4">Target Grade:</h2>
                        <input type="number" placeholder="Target Grade" value={targetGrade} onChange={(e) => setTargetGrade(parseInt(e.target.value))} className="p-2 border border-gray-300 text-black rounded-lg my-4" />
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-4 ms-4" onClick={() => setTargetGrade(0)}>Reset</button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {sections.map((section, index) => (
                            <div key={index} className="w-full p-4 border border-gray-300 rounded-lg mb-4 flex flex-col">
                                <p className="text-lg font-bold">{section.course.courseNumber} - {section.course.name}</p>
                                <p className="text-sm">Section {section.sectionNumber}</p>
                                <p className="text-sm">Instructor: {section.instructor.name}</p>
                                <p className="text-sm">Number of Students: {section.num_students}</p>
                                <div className="flex-grow min-h-8" />
                                {section.evaluations.length > 0 && section.isEvaluated ? <p className="text-lg text-green-500">Evaluations entered</p> : section.evaluations.length > 0 ? <p className="text-lg text-yellow-500">Evaluations partially entered</p> : <p className="text-lg text-red-500">No evaluations!</p>}
                                {targetGrade !== 0 && <>
                                    <p className="text-sm">Evaluations with grade {targetGrade} or higher: {findNumGrades(section)}</p>
                                </>}
                            </div>
                        ))}
                    </div>
                    <button onClick={() => router.push("/semesters")} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 self-start">Back</button>
                </div>

            </main>
        </>
    )
}
