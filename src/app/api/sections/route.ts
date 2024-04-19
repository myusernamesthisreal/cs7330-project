import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import exp from "constants";
import { NextRequest, NextResponse } from "next/server";


// Define the type of semesterDates
const semesterDates: Record<string, { start: string; end: string }> = {
    Spring: { start: "-01-15", end: "-05-01" },
    Summer: { start: "-06-01", end: "-08-01" },
    Fall: { start: "-08-15", end: "-12-15" }
}as const;
                    
export async function GET(req: NextRequest) {
    try {
        const sections = await prisma.section.findMany();
        
        // Format the dates to a date-only string
        const formattedSections = sections.map(section => ({
            ...section,
            startDate: section.startDate.toISOString().split('T')[0],
            endDate: section.endDate.toISOString().split('T')[0]
        }));

        return NextResponse.json(formattedSections, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ reason: "Something went wrong" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const { sectionNumber, courseNumber, instructorId, semester, year, num_students } = data;
        if (!sectionNumber || !courseNumber || !instructorId || !semester || !year || !num_students) {
            return NextResponse.json({ reason: "Missing required fields" }, { status: 400 });
        }

        // Check if the course exists
        const course = await prisma.course.findUnique({ where: { courseNumber } });
        if (!course) {
            return NextResponse.json({ reason: "Course does not exist" }, { status: 400 });
        }

        // Check if the instructor exists
        const instructor = await prisma.instructor.findUnique({ where: { id_number: instructorId } });
        if (!instructor) {
            return NextResponse.json({ reason: "Instructor does not exist" }, { status: 400 });
        }
        
        // Calculate the start and end dates based on semester and year
        const startDate = new Date(`${year}${semesterDates[semester].start}`);
        const endDate = new Date(`${year}${semesterDates[semester].end}`);

        const section = await prisma.section.create({
            data: {
                sectionNumber,
                courseNumber,
                instructorId,
                semester,
                year,
                num_students,
                startDate,
                endDate
            }
        });

        // Format the dates to a date-only string
        const formattedSection = {
            ...section,
            startDate: section.startDate.toISOString().split('T')[0],
            endDate: section.endDate.toISOString().split('T')[0]
        };

        return NextResponse.json(formattedSection, { status: 201 });
    } catch (error) {
        console.error(error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return NextResponse.json({ reason: "Section already exists" }, { status: 409 });
            }
        }
        return NextResponse.json({ reason: "Something went wrong" }, { status: 500 });
    }
}