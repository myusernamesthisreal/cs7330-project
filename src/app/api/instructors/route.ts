import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        if (req.nextUrl.searchParams.has("query")) {
            const query = req.nextUrl.searchParams.get("query") ?? "";
            const instructors = await prisma.instructor.findMany({
                where: {
                    OR: [
                        { id_number: { contains: query } },
                        { name: { contains: query } }
                    ]
                }
            });
            return NextResponse.json(instructors, { status: 200 });
        }
        const instructors = await prisma.instructor.findMany();
        return NextResponse.json(instructors, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ reason: "Something went wrong" }, { status: 500 });
    }
}


export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const { id_number, name } = data;
        if (!id_number || !name) return NextResponse.json({ reason: "Missing required fields name, id_number and name" }, { status: 400 });
        const instructor = await prisma.instructor.create({
            data: {
                id_number,
                name,
            }
        });
        return NextResponse.json(instructor);
    } catch (error) {
        console.error(error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return NextResponse.json({ reason: "Instructor already exists" }, { status: 409 });
            }
        }
        return NextResponse.json({ reason: "Something went wrong" }, { status: 500 });
    }
}
