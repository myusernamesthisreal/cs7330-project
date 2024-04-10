import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const degrees = await prisma.degree.findMany();
    return NextResponse.json(degrees, { status: 200 });
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const { name, level } = data;
        if (!name || !level) return NextResponse.json({ message: "Missing required fields Name, Level" }, { status: 400 });
        const degree = await prisma.degree.create({
            data: {
                name,
                level,
            }
        });
        return NextResponse.json(degree);
    } catch (error) {
        console.error(error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return NextResponse.json({ reason: "Degree already exists" }, { status: 409 });
            }
        }
        return NextResponse.json({ reason: "Something went wrong" }, { status: 500 });
    }
}
