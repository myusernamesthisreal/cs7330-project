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
    const [startSemester, setStartSemester] = useState("");
    const [startYear, setStartYear] = useState("");
    const [endSemester, setEndSemester] = useState("");
    const [endYear, setEndYear] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        setError("");
        if (!startSemester || !startYear || !endSemester || !endYear) {
            setError("Please fill out all fields");
            return;
        }
        const res = await fetch(`/api/sections?degreeName=${query.get("name")}&degreeLevel=${query.get("level")}&startSemester=${startSemester}&startYear=${startYear}&endSemester=${endSemester}&endYear=${endYear}`);
        const data = await res.json();
        setSections(data);
        setLoaded(true);
    };

    return (
        <>
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <div className="z-10 max-w-5xl items-center justify-between text-sm lg:flex lg:flex-col">
                    <h1 className="text-4xl font-bold text-center mb-4">Sections for {query.get("level")} {query.get("name")}</h1>
                    <div className="w-full">
                        <p className="text-sm text-gray-300 mb-2">Start Semester:</p>
                        <select value={startSemester} onChange={(e) => setStartSemester(e.target.value)} className="p-2 border border-gray-300 text-black rounded-lg w-full mb-4">
                            <option value="">Select Semester</option>
                            <option value="Spring">Spring</option>
                            <option value="Summer">Summer</option>
                            <option value="Fall">Fall</option>
                        </select>
                        <p className="text-sm text-gray-300 mb-2">Start Year:</p>
                        <input type="number" placeholder="Start Year" value={startYear} onChange={(e) => setStartYear(e.target.value)} className="p-2 border border-gray-300 text-black rounded-lg w-full mb-4" />
                        <p className="text-sm text-gray-300 mb-2">End Semester:</p>
                        <select value={endSemester} onChange={(e) => setEndSemester(e.target.value)} className="p-2 border border-gray-300 text-black rounded-lg w-full mb-4">
                            <option value="">Select Semester</option>
                            <option value="Spring">Spring</option>
                            <option value="Summer">Summer</option>
                            <option value="Fall">Fall</option>
                        </select>
                        <p className="text-sm text-gray-300 mb-2">End Year:</p>
                        <input type="number" placeholder="End Year" value={endYear} onChange={(e) => setEndYear(e.target.value)} className="p-2 border border-gray-300 text-black rounded-lg w-full mb-4" />
                        <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mx-auto block">Submit</button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {sections.map((section, index) => (
                            <div key={index} className="w-full p-4 border border-gray-300 rounded-lg mb-4">
                                <p className="text-lg font-bold">Section {section.sectionNumber}</p>
                                <p className="text-sm">{section.courseNumber}</p>
                                <p>InstructorId: {section.instructorId}</p>
                                <p>Students: {section.num_students}</p>
                                <p>Semester: {section.semester} {section.year}</p>
                            </div>
                        ))}
                    </div>
                    {(loaded && sections.length === 0) && <p className="text-gray-300 text-sm mt-4">No sections found</p>}
                    {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                    <button onClick={() => router.push("/degrees")} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 self-start">Back</button>
                </div>
            </main>
        </>
    );
}
