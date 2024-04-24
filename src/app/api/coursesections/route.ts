import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// Define the type of semesterDates
const semesterDates: Record<string, { start: string; end: string }> = {
    Spring: { start: "-01-15", end: "-05-01" },
    Summer: { start: "-06-01", end: "-08-01" },
    Fall: { start: "-08-15", end: "-12-15" }
} as const;

export async function GET(req: NextRequest) {
    try {
        if (req.nextUrl.searchParams.has("courseNumber") && req.nextUrl.searchParams.has("startSemester") && req.nextUrl.searchParams.has("startYear") && req.nextUrl.searchParams.has("endSemester") && req.nextUrl.searchParams.has("endYear")) {
            // Retrieve course number and semester range from query parameters
            const courseNumber = req.nextUrl.searchParams.get("courseNumber") ?? "";
            const startSemester = req.nextUrl.searchParams.get("startSemester") ?? "";
            const startYear = req.nextUrl.searchParams.get("startYear") ?? "";
            const endSemester = req.nextUrl.searchParams.get("endSemester") ?? "";
            const endYear = req.nextUrl.searchParams.get("endYear") ?? "";

            if (!courseNumber || !startSemester || !startYear || !endSemester || !endYear) {
                return NextResponse.json({ reason: "Missing required query parameters" }, { status: 400 });
            }
            const startDate = new Date(`${startYear}${semesterDates[startSemester].start}`);
            const endDate = new Date(`${endYear}${semesterDates[endSemester].end}`);

            // Query to find sections that match the course number and semester range
            const sections = await prisma.section.findMany({
                where: {
                    courseNumber,

                    AND: [

                        { startDate: { gte: startDate } },
                        { endDate: { lte: endDate } }
                    ]
                },
                include: {
                    course: true,
                    instructor: true
                },
                orderBy: [
                    { year: 'asc' },
                    { semester: 'asc' }
                ]
            });

            // Return sections, including instructor details
            const formattedSections = sections.map(section => ({
                ...section,
                startDate: section.startDate.toISOString().split('T')[0],
                endDate: section.endDate.toISOString().split('T')[0]
            }));

            return NextResponse.json(formattedSections, { status: 200 });
        } else {
            // Existing code...
            return NextResponse.json({ reason: "Missing required query parameters" }, { status: 400 });
        }
    } catch (error) {
        console.error("Error fetching sections:", error);
        return NextResponse.json({ reason: "Something went wrong" }, { status: 500 });
    }
}
