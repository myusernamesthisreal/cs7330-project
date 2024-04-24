import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

const semesterDates: Record<string, { start: string; end: string }> = {
    Spring: { start: "-01-15", end: "-05-01" },
    Summer: { start: "-06-01", end: "-08-01" },
    Fall: { start: "-08-15", end: "-12-15" }
} as const;


export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const instructorId = searchParams.get('instructorId') ?? "";
    const startSemester = searchParams.get('startSemester') ?? "";
    const startYear = searchParams.get('startYear') ?? "";
    const endSemester = searchParams.get('endSemester') ?? "";
    const endYear = searchParams.get('endYear') ?? "";

    if (!instructorId || !startSemester || !endSemester) {
        return NextResponse.json({ reason: "Missing required parameters" }, { status: 400 });
    }

    try {
        const startDate = new Date(startYear + semesterDates[startSemester].start);
        const endDate = new Date(endYear + semesterDates[endSemester].end);
        const instructorsections = await prisma.section.findMany({
            where: {
                AND: [
                    { instructorId: instructorId },
                    { startDate: { gte: startDate } },
                    { endDate: { lte: endDate } }
                ],

            },

            include: {
                course: {
                    select: {
                        name: true
                        // isCore: true
                    }
                },
                instructor: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                startDate: 'asc'
            }
        });

        // Transform the structure of sections to flatten them
        const sectionsTaught = instructorsections.map(section => ({
            sectionNumber: section.sectionNumber,
            courseNumber: section.courseNumber,
            courseName: section.course.name,
            instructorId: section.instructorId,
            instructorName: section.instructor.name,
            semester: section.semester,
            year: section.year,
            num_students: section.num_students,
            startDate: section.startDate.toISOString().slice(0, 10),
            endDate: section.endDate.toISOString().slice(0, 10)
        }));

        if (sectionsTaught.length === 0) {
            return NextResponse.json({ reason: "No sections found" }, { status: 404 });
        }

        return NextResponse.json({ sectionsTaught }, { status: 200 });
    }
    catch (error) {
        console.error("Fail to retrieve sections: ", error);
        return NextResponse.json({ reason: "Internal server error" }, { status: 500 });
    }
}
