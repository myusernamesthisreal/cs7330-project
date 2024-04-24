"use client";
import { Instructor, Section } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import {  useEffect, useState } from "react";

type SectionWithCourseDetails = Section & { courseName: string, instructor: Instructor };

export default function SectionsPage() {
    const router = useRouter();
    const query = useSearchParams();
    const courseNumber =  query.get("name") ;
    const [error, setError] = useState("");
    const [startSemester, setStartSemester] = useState("");
    const [startYear, setStartYear] = useState("");
    const [endSemester, setEndSemester] = useState("");
    const [endYear, setEndYear] = useState("");
    const [sections, setSections] = useState([] as SectionWithCourseDetails[]);
    const [loading, setLoading] = useState(false);

    const handleFetchSections = async () => {
        setLoading(true);
        const res = await fetch(`/api/coursesections?courseNumber=${courseNumber}&startSemester=${startSemester}&startYear=${startYear}&endSemester=${endSemester}&endYear=${endYear}`);
        if (res.ok) {
            const data = await res.json();
            setSections(data);
            setLoading(false);
        } else {
            const data = await res.json();
            setError(data.reason || "Something went wrong");
            setLoading(false);
        }
    }



    return (
        <>
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <div className="z-10 max-w-xl w-full items-center justify-between text-sm lg:flex lg:flex-col">
                    <h1 className="text-4xl font-bold text-center mb-4">Sections for {courseNumber}</h1>
                    <div className="w-full">
                        <p className="text-sm text-black-300 mb-2">Start Semester:</p>
                        <select value={startSemester} onChange={(e) => setStartSemester(e.target.value)} className="p-2 border border-gray-300 text-black rounded-lg w-full mb-4">
                            <option value="">Select Semester</option>
                            <option value="Fall">Fall</option>
                            <option value="Spring">Spring</option>
                            <option value="Summer">Summer</option>
                        </select>
                    </div>
                    <div className="w-full">
                        <input type="number" placeholder="Start Year" value={startYear} onChange={(e) => setStartYear(e.target.value)} className="p-2 border border-gray-300 text-black rounded-lg w-full mb-4" />
                    </div>
                    <div className="w-full">
                        <p className="text-sm text-black-300 mb-2">End Semester:</p>
                        <select value={endSemester} onChange={(e) => setEndSemester(e.target.value)} className="p-2 border border-gray-300 text-black rounded-lg w-full mb-4">
                            <option value="">Select Semester</option>
                            <option value="Fall">Fall</option>
                            <option value="Spring">Spring</option>
                            <option value="Summer">Summer</option>
                        </select>
                    </div>
                    <div className="w-full">
                        <input type="number" placeholder="End Year" value={endYear} onChange={(e) => setEndYear(e.target.value)} className="p-2 border border-gray-300 text-black rounded-lg w-full mb-4" />
                    </div>
                    {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                    {sections.map((section, index) => (
                        <div key={index} className="w-full p-4 border border-gray-300 rounded-lg mb-4">
                            <p className="text-lg font-bold">{section.courseName} Section {section.sectionNumber}</p>
                            <p>Instructor: {section.instructor.name}</p>
                            <p>Students: {section.num_students}</p>
                            <p>Semester: {section.semester} {section.year}</p>
                        </div>
                    ))}
                    {loading && <p className="text-gray-300 text-sm mt-4">Loading...</p>}
                    <div className="flex justify-between w-full mt-4">
                    <button onClick={handleFetchSections} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 self-start">Fetch Sections</button>

                    <button onClick={() => router.push("/")} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4  self-start">Back</button>
                    </div>
                </div>


            </main>
        </>
    );
}
