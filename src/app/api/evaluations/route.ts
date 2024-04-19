// pages/api/courseEvaluations/create.ts
import prisma from "@/lib/db"; // make sure this import path aligns with your project structure
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const {
            learningObjectiveId, sectionNumber, degreeName, degreeLevel,
            type, paragraph, numAs, numBs, numCs, numFs
        } = data;

        // Validate required fields
        if (!learningObjectiveId || !sectionNumber || !degreeName || !degreeLevel || type === undefined) {
            return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
        }

        // Create course evaluation
        const evaluation = await prisma.courseEvaluation.create({
            data: {
                learningObjectiveId,
                sectionNumber,
                degreeName,
                degreeLevel,
                type,
                paragraph,
                numAs,
                numBs,
                numCs,
                numFs
            }
        });
        return NextResponse.json(evaluation, { status: 201 });
    } catch (error) {
        console.error(error);
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return NextResponse.json({ reason: "Duplicate entry, evaluation already exists." }, { status: 409 });
        }
        return NextResponse.json({ reason: "Something went wrong" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const params = req.nextUrl.searchParams;
    const sectionNumber = params.get('sectionNumber');
    const degreeName = params.get('degreeName');
    const degreeLevel = params.get('degreeLevel');
    const learningObjectiveId = params.get('learningObjectiveId');

    try {
        const evaluations = await prisma.courseEvaluation.findMany({
            where: {
                ...(sectionNumber ? { sectionNumber } : {}),
                ...(degreeName ? { degreeName } : {}),
                ...(degreeLevel ? { degreeLevel } : {}),
                ...(learningObjectiveId ? { learningObjectiveId: parseInt(learningObjectiveId) } : {})
            },
            include: {
                learningObjective: true,
                section: true,
                degree: true
            }
        });
        return NextResponse.json(evaluations, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ reason: "Failed to retrieve evaluations." }, { status: 500 });
    }
}
