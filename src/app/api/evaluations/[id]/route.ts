import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    try {
        const data = await req.json();
        const id = parseInt(req.nextUrl.pathname.split("/")[3] ?? "") ?? undefined;
        const { type, paragraph, numAs, numBs, numCs, numFs, degreeName, degreeLevel, sectionNumber } = data;

        // Validate required fields
        if (!id) {
            return NextResponse.json({ message: "Missing required field ID." }, { status: 400 });
        }

        // Update course evaluation
        const evaluation = await prisma.courseEvaluation.update({
            where: {
                learningObjectiveId_sectionNumber_degreeName_degreeLevel: {
                    learningObjectiveId: id,
                    sectionNumber,
                    degreeName,
                    degreeLevel
                }
            },
            data: {
                paragraph,
                numAs,
                numBs,
                numCs,
                numFs,
                type
            }
        });
        return NextResponse.json(evaluation, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ reason: "Failed to update evaluation." }, { status: 500 });
    }

}
