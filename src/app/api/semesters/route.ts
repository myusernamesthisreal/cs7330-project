import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const semesters = await prisma.section.findMany(
            {
                distinct: ["year", "semester"],
                select: {
                    semester: true,
                    year: true,
                },
                orderBy: [
                    { startDate: "desc" }
                ]
            }
        );
        return NextResponse.json(semesters, { status: 200 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ reason: "Internal Server Error" }, { status: 500 });
    }
}
