"use client"
import { Section } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useEffect, useState } from "react";

type SectionWithCourseDetails = Section & { courseName: string; instructorName: string };

export default function DegreeSections() {
    const router = useRouter();
    const query = useSearchParams();
    const [sections, setSections] = useState([] as SectionWithCourseDetails[]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const fetchSections = async () => {
            const degreeName = query.get("name");
            const degreeLevel = query.get("level");
            const start = query.get("start");
            const end = query.get("end");
            if (!degreeName || !degreeLevel) {
                router.push("/degrees");
            }
            const res = await fetch(`/api/sections?degreeName=${degreeName}&degreeLevel=${degreeLevel}&start=${start}&end=${end}`);
            

            const data = await res.json();
            setSections(data);
            setLoaded(true);
        };
        fetchSections();
        
    }, [query, router]);

    return (
        <>
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex lg:flex-col">
                    <h1 className="text-4xl font-bold text-center mb-4">Sections for {query.get("degreeLevel")} {query.get("degreeName")}</h1>
                    <div className="grid grid-cols-3 gap-4">
                        {sections.map((section, index) => (
                            <div key={index} className="w-full p-4 border border-gray-300 rounded-lg mb-4">
                                <p className="text-lg font-bold">{section.courseName} - Section {section.sectionNumber}</p>
                                <p className="text-sm">{section.courseNumber}</p>
                                <p>InstructorId: {section.instructorId}</p>
                                {/* <p>Instructor: {section.instructorName}</p> */}
                                <p>Students: {section.num_students}</p>
                                <p>Dates: {section.startDate.toString()} to {section.endDate.toString()}</p>
                            </div>
                        ))}
                    </div>
                    {(loaded && sections.length === 0) && <p className="text-gray-300 text-sm mt-4">No sections found</p>}
                    <button onClick={() => router.push("/degrees")} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 self-start">Back</button>
                </div>
            </main>
        </>
    );
}
