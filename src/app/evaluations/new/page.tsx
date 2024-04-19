"use client"
import { CourseEvaluation, Instructor, LearningObjective, Section } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function NewEvaluation() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [step, setStep] = useState(0);
    const [degreeName, setDegreeName] = useState("");
    const [degreeLevel, setDegreeLevel] = useState("");
    const [semester, setSemester] = useState("");
    const [year, setYear] = useState("");
    const [instructorId, setInstructorId] = useState("");
    const [sections, setSections] = useState([] as Section[]);
    const [selectedSection, setSelectedSection] = useState({} as Section);
    const [evaluations, setEvaluations] = useState([] as CourseEvaluation[]);
    const [objectives, setObjectives] = useState([] as any[]);
    const [selectedObjective, setSelectedObjective] = useState({} as LearningObjective);
    const [selectedEvaluation, setSelectedEvaluation] = useState({} as CourseEvaluation);
    const [type, setType] = useState("");
    const [otherType, setOtherType] = useState("");
    const [numAs, setNumAs] = useState(0);
    const [numBs, setNumBs] = useState(0);
    const [numCs, setNumCs] = useState(0);
    const [numFs, setNumFs] = useState(0);
    const [paragraph, setParagraph] = useState("");
    const [iSearchQuery, setISearchQuery] = useState("");
    const [instructors, setInstructors] = useState([] as Instructor[]);
    const [searched, setSearched] = useState(false);

    const handleStepOne = async (e: FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const res = await fetch(`/api/sections?degreeName=${degreeName}&degreeLevel=${degreeLevel}&semester=${semester}&year=${year}&InstructorId=${instructorId}`);
        if (res.ok) {
            const data = await res.json();
            setSections(data);
            setStep(1);
        } else {
            const data = await res.json();
            setError(data.reason || "Something went wrong");
        }
    }

    const handleSearch = async () => {
        const res = await fetch(`/api/instructors?query=${iSearchQuery}`);
        const data = await res.json();
        setInstructors(data);
        setSearched(true);
    };

    const handleStepTwo = async (e: FormEvent<HTMLButtonElement>, section: Section) => {
        e.preventDefault();
        const evals = await fetch(`/api/evaluations?sectionNumber=${section.sectionNumber}`);
        if (evals.ok) {
            const cObjective = await fetch(`/api/objectives?courseNumber=${section.courseNumber}`);
            const cData = await cObjective.json();
            const eData = await evals.json();
            setEvaluations(eData);
            const objectivesWithEvaluations = cData.map((objective: any) => {
                console.log("objective", objective)
                const evaluation = eData.find((evaluation: CourseEvaluation) => evaluation.learningObjectiveId === objective.learningObjective.id);
                return {
                    ...objective.learningObjective,
                    evaluation: evaluation || null,
                };
            });
            console.log(objectivesWithEvaluations);
            setObjectives(objectivesWithEvaluations);
            setSelectedSection(section);
            setStep(2);
        } else {
            const data = await evals.json();
            setError(data.reason || "Something went wrong");
        }
    }

    const handleStepThree = async (e: FormEvent<HTMLButtonElement>, objective: LearningObjective & {evaluation: CourseEvaluation}) => {
        e.preventDefault();
        setSelectedObjective(objective);
        if (objective.evaluation) {
            setSelectedEvaluation(objective.evaluation);
            const evalTypes = ["Exam", "Quiz", "Assignment", "Project"];
            if (!evalTypes.includes(objective.evaluation.type)) {
                setType("Other");
                setOtherType(objective.evaluation.type);
            } else {
                setType(objective.evaluation.type);
            }
            setNumAs(objective.evaluation.numAs);
            setNumBs(objective.evaluation.numBs);
            setNumCs(objective.evaluation.numCs);
            setNumFs(objective.evaluation.numFs);
            setParagraph(objective.evaluation.paragraph);
        }
        setStep(3);
    }

    const handleSubmit = async (e: FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!selectedEvaluation.learningObjectiveId) {
            const res = await fetch("/api/evaluations", {
                method: "POST",
                body: JSON.stringify({
                    sectionNumber: selectedSection.sectionNumber,
                    learningObjectiveId: selectedObjective.id,
                    type: type === "Other" ? otherType : type,
                    degreeName,
                    degreeLevel,
                    numAs,
                    numBs,
                    numCs,
                    numFs,
                    paragraph,
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
        } else {
            const res = await fetch(`/api/evaluations/${selectedEvaluation.learningObjectiveId}`, {
                method: "PUT",
                body: JSON.stringify({
                    type: type === "Other" ? otherType : type,
                    degreeLevel,
                    degreeName,
                    sectionNumber: selectedSection.sectionNumber,
                    numAs,
                    numBs,
                    numCs,
                    numFs,
                    paragraph,
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
    }

    return (
        <>
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <div className="z-10 max-w-xl w-full items-center justify-between text-sm lg:flex lg:flex-col">
                    <h1 className="text-4xl font-bold text-center mb-4">Evaluations</h1>
                    {step === 0 &&
                    <>
                        <div className="w-full">
                            <p className="text-sm text-gray-300 mb-2">Degree Name</p>
                            <input type="text" placeholder="Degree Name" value={degreeName} onChange={(e) => setDegreeName(e.target.value)} className="p-2 border border-gray-300 text-black rounded-lg w-full mb-4" />
                        </div>
                        <div className="w-full">
                            <p className="text-sm text-gray-300 mb-2">Degree Level</p>
                            <input type="text" placeholder="Degree Level" value={degreeLevel} onChange={(e) => setDegreeLevel(e.target.value)} className="p-2 border border-gray-300 text-black rounded-lg w-full mb-4" />
                        </div>
                        <div className="w-full">
                            <p className="text-sm text-gray-300 mb-2">Semester</p>
                            <select value={semester} onChange={(e) => setSemester(e.target.value)} className="p-2 border border-gray-300 text-black rounded-lg w-full mb-4">
                                <option value="">Select Semester</option>
                                <option value="Fall">Fall</option>
                                <option value="Spring">Spring</option>
                                <option value="Summer">Summer</option>
                            </select>
                        </div>
                        <div className="w-full">
                            <p className="text-sm text-gray-300 mb-2">Year</p>
                            <input type="text" placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} className="p-2 border border-gray-300 text-black rounded-lg w-full mb-4" />
                        </div>
                        <div className="w-full mb-4">
                        <p className="text-sm text-gray-300 mb-2">Search for Instructor</p>
                        <input type="text" placeholder="Instructor Name/ID" value={iSearchQuery} onChange={(e) => setISearchQuery(e.target.value)} className="p-2 border border-gray-300 text-black rounded-lg w-full mb-4" />
                        <button className="p-2 bg-blue-500 text-white w-full rounded-lg" onClick={handleSearch}>Search</button>
                        {searched && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-300 mb-2">Select Instructor:</p>
                                <select value={instructorId} onChange={(e) => setInstructorId(e.target.value)} className="p-2 border border-gray-300 text-black rounded-lg w-full mb-4">
                                    <option value="">Select</option>
                                    {instructors.map((i, index) => (
                                        <option key={index} value={i.id_number}>{i.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {(instructors.length === 0 && searched) && <p className="text-sm text-gray-300 mt-4">No instructors found</p>}
                    </div>
                        <button onClick={handleStepOne} className="bg-blue-500 text-white rounded-lg p-2 w-full mt-4">Next</button>
                    </>
                    }
                    {step === 1 &&
                    <>
                        <div className="w-full">
                            <p className="text-sm text-gray-300 mb-2">Section</p>
                            <div className="grid grid-cols-3 gap-4">
                                {sections.map((section: any, index) => (
                                    <div key={index} className="border p-4 rounded-lg">
                                        <p className="text-xl font-bold text-gray-300">Section {section.sectionNumber}</p>
                                        <p className="text-sm text-gray-300">{section.courseNumber}</p>
                                        <p className="text-sm text-gray-300">{section.instructor.name}</p>
                                        <p className="text-sm text-gray-300">{section.semester} {section.year}</p>
                                        <button onClick={(e) => handleStepTwo(e, section)} className="bg-blue-500 text-white rounded-lg p-2 mt-4 w-full">Select</button>
                                    </div>
                                ))}
                            </div>
                            {sections.length === 0 && <p className="text-red-500 text-sm mt-4">No sections found</p>}
                                <button onClick={() => setStep(0)} className="bg-blue-500 text-white rounded-lg p-2 mt-4">Back</button>
                        </div>
                    </>
                    }
                    {step === 2 &&
                    <>
                        <div className="w-full">
                            <p className="text-sm text-gray-300 mb-2">Objective</p>
                            <div className="grid grid-cols-3 gap-4">
                                {objectives.map((objective, index) => (
                                    <div key={index} className="border p-4 rounded-lg flex flex-col">
                                        <p className="text-xl font-bold text-gray-300">{objective.title}</p>
                                        <p className="text-sm text-gray-300">{objective.description}</p>
                                        <div className="flex flex-grow" />
                                        <button onClick={(e) => handleStepThree(e, objective)} className="bg-blue-500 text-white rounded-lg p-2 mt-4 w-full">{objective.evaluation !== null ? "Update" : "Create"}</button>
                                    </div>
                                ))}
                            </div>
                            {objectives.length === 0 && <p className="text-red-500 text-sm mt-4">No objectives found</p>}
                            <button onClick={() => setStep(1)} className="bg-blue-500 text-white rounded-lg p-2 mt-4">Back</button>
                        </div>
                    </>
                    }
                    {step === 3 &&
                    <>
                        <div className="w-full">
                            <h1 className="text-2xl font-bold text-gray-300 mb-4">Evaluate {selectedObjective.title} for {selectedSection.courseNumber} section {selectedSection.sectionNumber}</h1>
                            <p className="text-sm text-gray-300 mb-2">Type of Evaluation</p>
                            <select value={type} onChange={(e) => setType(e.target.value)} className="p-2 border border-gray-300 text-black rounded-lg w-full mb-4">
                                <option value="">Select Type</option>
                                <option value="Exam">Exam</option>
                                <option value="Quiz">Quiz</option>
                                <option value="Assignment">Assignment</option>
                                <option value="Project">Project</option>
                                <option value="Other">Other</option>
                            </select>
                            {type === "Other" &&
                                <div className="w-full">
                                    <p className="text-sm text-gray-300 mb-2">Other Evaluation</p>
                                    <input type="text" placeholder="Type of Evaluation" value={otherType} onChange={(e) => setOtherType(e.target.value)} className="p-2 border border-gray-300 text-black rounded-lg w-full mb-4" />
                                </div>
                            }
                            <div className="w-full">
                                <p className="text-sm text-gray-300 mb-2">Number of As</p>
                                <input type="number" placeholder="Number of As" value={numAs} onChange={(e) => setNumAs(Number(e.target.value))} className="p-2 border border-gray-300 text-black rounded-lg w-full mb-4" />
                            </div>
                            <div className="w-full">
                                <p className="text-sm text-gray-300 mb-2">Number of Bs</p>
                                <input type="number" placeholder="Number of Bs" value={numBs} onChange={(e) => setNumBs(Number(e.target.value))} className="p-2 border border-gray-300 text-black rounded-lg w-full mb-4" />
                            </div>
                            <div className="w-full">
                                <p className="text-sm text-gray-300 mb-2">Number of Cs</p>
                                <input type="number" placeholder="Number of Cs" value={numCs} onChange={(e) => setNumCs(Number(e.target.value))} className="p-2 border border-gray-300 text-black rounded-lg w-full mb-4" />
                            </div>
                            <div className="w-full">
                                <p className="text-sm text-gray-300 mb-2">Number of Fs</p>
                                <input type="number" placeholder="Number of Fs" value={numFs} onChange={(e) => setNumFs(Number(e.target.value))} className="p-2 border border-gray-300 text-black rounded-lg w-full mb-4" />
                            </div>
                            <div className="w-full">
                                <p className="text-sm text-gray-300 mb-2">Paragraph</p>
                                <textarea placeholder="Paragraph" value={paragraph} onChange={(e) => setParagraph(e.target.value)} className="p-2 border border-gray-300 text-black rounded-lg w-full mb-4" />
                            </div>
                            <button onClick={handleSubmit} className="bg-blue-500 text-white rounded-lg p-2 w-full mt-4">Submit</button>
                            <button onClick={() => setStep(2)} className="bg-blue-500 text-white rounded-lg p-2 mt-4">Back</button>
                        </div>
                    </>
                    }
                    {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                </div>
            </main>
        </>
    )
}
