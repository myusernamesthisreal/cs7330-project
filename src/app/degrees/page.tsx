"use client"
import { useEffect, useState } from "react"

type Degree = {
    name: string;
    level: string;
}

export default function ViewDegrees() {
    const [degrees, setDegrees] = useState([] as Degree[]);

    useEffect(() => {
        const handleFetch = async () => {
            const res = await fetch("/api/degrees");
            const data = await res.json();
            setDegrees(data);
        }
        handleFetch();
    }, [])
    return (
        <>
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <div className="z-10 max-w-3xl w-full items-center justify-between text-sm">
                    <h1 className="text-4xl font-bold text-center mb-4">Degrees</h1>
                    <div className="grid grid-cols-3 gap-4">
                    {degrees.map((degree, index) => (
                        <div key={index} className="w-full p-4 border border-gray-300 rounded-lg mb-4">
                            <p className="text-lg font-bold">{degree.name}</p>
                            <p className="text-sm">{degree.level}</p>
                        </div>
                    ))}
                    </div>
                </div>
            </main>
        </>
    )
}
