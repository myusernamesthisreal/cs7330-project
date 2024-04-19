"use client"
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react"

export default function NewObjective() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setSubmitted(true);
        const res = await fetch("/api/objectives", {
            method: "POST",
            body: JSON.stringify({
                title,
                description,
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
        setSubmitted(false);
    }

    return (
        <>
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <div className="z-10 max-w-xl w-full items-center justify-between text-sm lg:flex lg:flex-col">
                    <h1 className="text-4xl font-bold text-center mb-4">New Objective</h1>
                    <div className="w-full">
                        <p className="text-sm text-gray-300 mb-2">Objective Title:</p>
                        <input type="text" placeholder="Objective Title" value={title} onChange={(e) => setTitle(e.target.value)} className="p-2 border border-gray-300 text-black rounded-lg w-full mb-4" />
                    </div>
                    <div className="w-full">
                        <p className="text-sm text-gray-300 mb-2">Objective Description:</p>
                        <input type="textarea" placeholder="Objective Description" value={description} onChange={(e) => setDescription(e.target.value)} className="p-2 border border-gray-300 text-black rounded-lg w-full mb-4" />
                    </div>
                    <button disabled={submitted} className="p-2 bg-blue-500 text-white rounded-lg w-full" type="submit" onClick={handleSubmit}>Create Objective</button>
                    {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                </div>
            </main>
        </>
    )
}
