"use client"
import { Section } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react"

export default function ViewTaught() {
    const [sections, setSections] = useState([] as Section[]);
    const [startSemester, setStartSemester] = useState("");
    const [startYear, setStartYear] = useState("");
    const [endSemester, setEndSemester] = useState("");
    const [endYear, setEndYear] = useState("");
    const [error, setError] = useState(null);
    const router = useRouter();
    const query = useSearchParams();
    const id_number = query.get("id_number");

    const handleSubmit = async (e: FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setError(null);
        setSections([]);

        if (!id_number) {
            return;
        }

        const res = await fetch(`/api/instructorsections?instructorId=${id_number}&startSemester=${startSemester}&startYear=${startYear}&endSemester=${endSemester}&endYear=${endYear}`);
        if (res.ok) {
            const data = await res.json();
            setSections(data.sectionsTaught);
        } else {
            const data = await res.json();
            setError(data.reason || "Something went wrong");
        }
    }

    return (
        <>
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <div className="z-10 max-w-xl w-full items-center justify-between text-sm lg:flex lg:flex-col">
                    <h1 className="text-4xl font-bold text-center mb-4">Sections Taught</h1>

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
                    </div>
                    {sections.length > 0 &&
                    <>
                    <h2 className="text-2xl font-bold text-center mt-4">Section</h2>
                    <br />

                    {sections.map((section, index) => (
                        <div key={index} className="w-full p-4 border border-gray-300 rounded-lg mb-4">
                            <p className="text-lg font-bold">Section {section.sectionNumber}</p>
                            <p className="text-sm">{section.courseNumber}</p>
                            <p>Students: {section.num_students}</p>
                            <p>Semester: {section.semester} {section.year}</p>
                        </div>
                    ))}
                    
                    </>
                    }
                    {error && <p className="text-red-500">Error: {error}</p>}
                    <div className="flex justify-between w-full mt-4">
                        <button onClick={() => router.push("/")} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4  self-start">Back</button>
                        <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 self-start">Submit</button>

                    </div>
                </div>
            </main>
        </>
    )
}
