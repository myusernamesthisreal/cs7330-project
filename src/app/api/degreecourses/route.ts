import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const degreecourses = await prisma.degreeCourses.findMany();
    return NextResponse.json(degreecourses, { status: 200 });
}

export async function PUT(req: NextRequest) {
    try {
        const data = await req.json();
        const { associations } = data;
        if (!Array.isArray(associations)) return NextResponse.json({ message: "Associations must be an array" }, { status: 400 });
        associations.forEach(association => {
            if (!association.degreeName || !association.degreeLevel || !association.courseNumber) return NextResponse.json({ message: "Missing required fields degreeName, degreeLevel, courseId in associations" }, { status: 400 });
        });

        const degreecourses = await prisma.degreeCourses.createMany({
            data: associations,
            skipDuplicates: true,
        });

        return NextResponse.json(degreecourses);

    } catch (error) {
        console.error(error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return NextResponse.json({ reason: "DegreeCourse already exists" }, { status: 409 });
            }
        }
        return NextResponse.json({ reason: "Something went wrong" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const data = await req.json();
        const { associations } = data;
        if (!Array.isArray(associations)) return NextResponse.json({ message: "Associations must be an array" }, { status: 400 });
        associations.forEach(association => {
            if (!association.degreeName || !association.degreeLevel || !association.courseNumber) return NextResponse.json({ message: "Missing required fields degreeName, degreeLevel, courseId in associations" }, { status: 400 });
        });

        const degreecourses = await prisma.degreeCourses.deleteMany({
            where: {
                OR: associations.map(association => ({
                    degreeName: association.degreeName,
                    degreeLevel: association.degreeLevel,
                    courseNumber: association.courseNumber,
                }))
            },

        });

        return NextResponse.json(degreecourses);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ reason: "Something went wrong" }, { status: 500 });
    }
}
