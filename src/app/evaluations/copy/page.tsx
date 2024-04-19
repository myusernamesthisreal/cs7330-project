"use client"
import { CourseEvaluation, Degree, Instructor, LearningObjective, Section } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function CopyEvaluation() {
    const router = useRouter();
    const query = useSearchParams();
    const [error, setError] = useState("");
    const [evaluation, setEvaluation] = useState({} as CourseEvaluation);
    const [degreeName, setDegreeName] = useState("");
    const [degreeLevel, setDegreeLevel] = useState("");

    useEffect(() => {
        const handleFetch = async () => {
            const learningObjectiveId = query.get("objectiveId");
            const sectionNumber = query.get("sectionNumber");
            const degreeName = query.get("degreeName");
            const degreeLevel = query.get("degreeLevel");
            if (!learningObjectiveId || !sectionNumber || !degreeName || !degreeLevel) {
                router.push("/evaluations/new");
            }
            const res = await fetch(`/api/evaluations?objectiveId=${learningObjectiveId}&sectionNumber=${sectionNumber}&degreeName=${degreeName}&degreeLevel=${degreeLevel}`);
            const data = await res.json();
            if (!data) {
                router.push("/evaluations/new");
            }
            setEvaluation(data[0] ?? {});
        }
        handleFetch();
    }, [router, query]);

    const handleSubmit = async (e: FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const res = await fetch("/api/evaluations", {
            method: "POST",
            body: JSON.stringify({
                ...evaluation,
                degreeName,
                degreeLevel,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (res.ok) {
            router.push("/");
        } else {
            const data = await res.json();
            setError(data.reason || "Something went wrong");
        }
    }

    return (
        <>
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <div className="z-10 max-w-xl w-full items-center justify-between text-sm lg:flex lg:flex-col">
                    <h1 className="text-4xl font-bold text-center mb-4">Copy Evaluation</h1>
                    <div className="w-full">
                        <h1 className="text-2xl font-bold text-center mb-4">Existing evaluation details:</h1>
                        <p className="text-sm text-gray-300 mb-2">Section Number: {evaluation.sectionNumber}</p>
                        <p className="text-sm text-gray-300 mb-2">Degree: {evaluation.degreeLevel} {evaluation.degreeName}</p>
                        <p className="text-sm text-gray-300 mb-2">Type: {evaluation.type}</p>
                        <p className="text-sm text-gray-300 mb-2">Details: {evaluation.paragraph}</p>
                        <p className="text-sm text-gray-300 mb-2">Number of As: {evaluation.numAs}</p>
                        <p className="text-sm text-gray-300 mb-2">Number of Bs: {evaluation.numBs}</p>
                        <p className="text-sm text-gray-300 mb-2">Number of Cs: {evaluation.numCs}</p>
                        <p className="text-sm text-gray-300 mb-2">Number of Fs: {evaluation.numFs}</p>
                    </div>
                    <h2 className="text-2xl font-bold text-center mb-4">Copy evaluation to:</h2>
                    <div className="w-full">
                        <p className="text-sm text-gray-300 mb-2">Degree Name:</p>
                        <input type="text" placeholder="Degree Name" value={degreeName} onChange={(e) => setDegreeName(e.target.value)} className="p-2 border border-gray-300 text-black rounded-lg w-full mb-4" />
                    </div>
                    <div className="w-full">
                        <p className="text-sm text-gray-300 mb-2">Degree Level:</p>
                        <input type="text" placeholder="Degree Level" value={degreeLevel} onChange={(e) => setDegreeLevel(e.target.value)} className="p-2 border border-gray-300 text-black rounded-lg w-full mb-4" />
                    </div>
                    <button className="p-2 bg-blue-500 text-white rounded-lg w-full" type="submit" onClick={handleSubmit}>Copy Evaluation</button>
                    {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                </div>
            </main>
        </>
    )
}
