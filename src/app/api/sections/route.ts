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
        if (req.nextUrl.searchParams.has("degreeName") && req.nextUrl.searchParams.has("degreeLevel") && req.nextUrl.searchParams.has("semester") && req.nextUrl.searchParams.has("year") && req.nextUrl.searchParams.has("InstructorId")) {
            const degreeName = req.nextUrl.searchParams.get("degreeName") ?? "";
            const degreeLevel = req.nextUrl.searchParams.get("degreeLevel") ?? "";
            const semester = req.nextUrl.searchParams.get("semester") ?? "";
            const year = req.nextUrl.searchParams.get("year") ?? "";
            const InstructorId = req.nextUrl.searchParams.get("InstructorId") ?? "";
            const sections = await prisma.section.findMany({
                where: {
                    AND: [
                        {
                            course: {
                                courseDegrees: {
                                    some: {
                                        degree: {
                                            name: degreeName,
                                            level: degreeLevel,
                                        },
                                    },
                                }
                            }
                        },
                        { semester },
                        { year: Number(year) },
                        { instructorId: InstructorId }, 
                    ],
                },
                include: {
                    instructor: 
                            true,
            
                }
            });
            // Add the instructor's name to each section
            // const sectionsWithInstructorName = sections.map(section => ({
            //     ...section,
            //     name: section.instructor.name,
                
            // // }));
            // return NextResponse.json(sectionsWithInstructorName, { status: 200 });
            return NextResponse.json(sections, { status: 200 });
        }
        else if (req.nextUrl.searchParams.has("semester") && req.nextUrl.searchParams.has("year")) {
            const semester = req.nextUrl.searchParams.get("semester") ?? "";
            const year = req.nextUrl.searchParams.get("year") ?? "";
            const sections = await prisma.section.findMany({
                where: {
                    semester,
                    year: Number(year),
                },
                include: {
                    instructor: true,
                    course: true,
                    evaluations: true,
                }
            });
            return NextResponse.json(sections, { status: 200 });
        }
        const sections = await prisma.section.findMany();
        

        // Format the dates to a date-only string
        const formattedSections = sections.map(section => ({
            ...section,
            startDate: section.startDate.toISOString().split('T')[0],
            endDate: section.endDate.toISOString().split('T')[0],
            
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



export async function DELETE(req: NextRequest) {
    try {
        const data = await req.json();
        const { sectionNumbers } = data; // Expecting an array of section numbers
        
        if (!Array.isArray(sectionNumbers)) {
            return NextResponse.json({ reason: "sectionNumbers must be an array" }, { status: 400 });
        }

        if (sectionNumbers.some(sectionNumber => typeof sectionNumber !== 'string')) {
            return NextResponse.json({ reason: "Each sectionNumber must be a string" }, { status: 400 });
        }

        // Attempt to delete sections
        const deleteResult = await prisma.section.deleteMany({
            where: {
                sectionNumber: {
                    in: sectionNumbers
                }
            }
        });

        if (deleteResult.count === 0) {
            return NextResponse.json({ reason: "No sections found or deleted" }, { status: 404 });
        }

        return NextResponse.json({ message: "Sections deleted successfully", count: deleteResult.count }, { status: 200 });
    } catch (error: any) {
        console.error("Error deleting sections:", error);
        return NextResponse.json({ reason: "Something went wrong", error: error.message }, { status: 500 });
    }
}

