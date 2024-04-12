import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const courses = await prisma.course.findMany();
    return NextResponse.json(courses, { status: 200 });
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const { name, courseNumber, isCore } = data;
        if (!name || !courseNumber) return NextResponse.json({ message: "Missing required fields name, courseNumber, isCore" }, { status: 400 });
        if (typeof isCore !== "boolean") return NextResponse.json({ message: "isCore must be a boolean" }, { status: 400 });
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
