import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

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
            });
            return NextResponse.json(sections, { status: 200 });
        }
        const sections = await prisma.section.findMany();
        return NextResponse.json(sections, { status: 200 });
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

        const section = await prisma.section.create({
            data: {
                sectionNumber,
                courseNumber,
                instructorId,
                semester,
                year,
                num_students,
            }
        });
        return NextResponse.json(section);
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
