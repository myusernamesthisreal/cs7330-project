import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    if (req.nextUrl.searchParams.has("degreeName") && req.nextUrl.searchParams.has("degreeLevel")) {
        const degreeName = req.nextUrl.searchParams.get("degreeName") ?? "";
        const degreeLevel = req.nextUrl.searchParams.get("degreeLevel") ?? "";
        const courses = await prisma.course.findMany({
            where: {
                courseDegrees: {
                    some: {
                        degreeName,
                        degreeLevel,
                    }
                }
            }
        });
        return NextResponse.json(courses, { status: 200 });
    } else if (req.nextUrl.searchParams.has("query")) {
        const query = req.nextUrl.searchParams.get("query") ?? "";
        const courses = await prisma.course.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: query,
                        }
                    },
                    {
                        courseNumber: {
                            contains: query,
                        }
                    }
                ]
            }
        });
        return NextResponse.json(courses, { status: 200 });
    } else if (req.nextUrl.searchParams.has("courseNumber")) {
        const courseNumber = req.nextUrl.searchParams.get("courseNumber") ?? "";
        const course = await prisma.course.findUnique({
            where: {
                courseNumber,
            }
        });
        if (!course) return NextResponse.json({ reason: "Course not found" }, { status: 404 });
        return NextResponse.json(course, { status: 200 });
    }
    const courses = await prisma.course.findMany();
    return NextResponse.json(courses, { status: 200 });
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const { name, courseNumber, isCore } = data;
        if (!name || !courseNumber) return NextResponse.json({ reason: "Missing required fields name, courseNumber, isCore" }, { status: 400 });
        if (typeof isCore !== "boolean") return NextResponse.json({ reason: "isCore must be a boolean" }, { status: 400 });
        const course = await prisma.course.create({
            data: {
                name,
                courseNumber,
                isCore,
            }
        });
        return NextResponse.json(course);
    } catch (error) {
        console.error(error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return NextResponse.json({ reason: "Course already exists" }, { status: 409 });
            }
        }
        return NextResponse.json({ reason: "Something went wrong" }, { status: 500 });
    }
}
