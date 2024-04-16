import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const courseobjectives = await prisma.courseObjective.findMany({
        include: {
            learningObjective: true,
        },
    });
    return NextResponse.json(courseobjectives, { status: 200 });
}

export async function PUT(req: NextRequest) {
    try {
        const data = await req.json();
        const { associations } = data;
        if (!Array.isArray(associations)) return NextResponse.json({ reason: "Associations must be an array" }, { status: 400 });
        associations.forEach(association => {
            if (!association.courseNumber || !association.objectiveId) return NextResponse.json({ reason: "Missing required fields courseNumber, objectiveId in associations" }, { status: 400 });
        });

        const courseobjectives = await prisma.courseObjective.createMany({
            data: associations.map(association => ({
                courseNumber: association.courseNumber,
                learningObjectiveId: association.objectiveId,
            })),
            skipDuplicates: true,
        });

        return NextResponse.json(courseobjectives);

    } catch (error) {
        console.error(error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return NextResponse.json({ reason: "CourseObjective already exists" }, { status: 409 });
            }
        }
        return NextResponse.json({ reason: "Something went wrong" }, { status: 500 });
    }
}
