// pages/api/objectives.ts
import prisma from "@/lib/db"; // Assuming prisma setup is correct
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
    const title = req.nextUrl.searchParams.get("title");
    const where = title ? { title: { contains: title, mode: 'insensitive' } } : {};
    const objectives = await prisma.learningObjective.findMany({ where });
    return NextResponse.json(objectives, { status: 200 });
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const { title, description } = data;

        if (!title || !description) {
            return NextResponse.json({ message: "Missing required fields: title, description" }, { status: 400 });
        }

        const objective = await prisma.learningObjective.create({
            data: {
                title,
                description,
            }
        });
        return NextResponse.json(objective, { status: 201 });
    } catch (error) {
        console.error(error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return NextResponse.json({ reason: "Objective already exists" }, { status: 409 });
            }
        }
        return NextResponse.json({ reason: "Something went wrong" }, { status: 500 });
    }
}
