// pages/api/objectives.ts
import prisma from "@/lib/db"; // Assuming prisma setup is correct
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
    if (req.nextUrl.searchParams.has("query")) {
        const query = req.nextUrl.searchParams.get("query") ?? "";
        const objectives = await prisma.learningObjective.findMany({
            where: {
                OR: [
                    {
                        title: {
                            contains: query,
                        }
                    },
                    {
                        description: {
                            contains: query,
                        }
                    }
                ]
            }
        });
        return NextResponse.json(objectives, { status: 200 });
    }
    else if (req.nextUrl.searchParams.has("courseNumber")) {
        const courseNumber = req.nextUrl.searchParams.get("courseNumber") ?? "";
        const objectives = await prisma.courseObjective.findMany({
            where: {
                courseNumber,
            },
            include: {
                learningObjective: true,
            }
        });
        return NextResponse.json(objectives, { status: 200 });
    } else if (req.nextUrl.searchParams.has("degreeName") && req.nextUrl.searchParams.has("degreeLevel")) {
        const degreeName = req.nextUrl.searchParams.get("degreeName") ?? "";
        const degreeLevel = req.nextUrl.searchParams.get("degreeLevel") ?? "";
        const objectivesQuery = await prisma.degreeCourses.findMany({
            where: {
                degreeName,
                degreeLevel,
            },
            include: {
                course: {
                    select: {
                        objectives: {
                            include: {
                                learningObjective: true,
                            },
                        },
                    }
                },
            },
            distinct: ["courseNumber"],
        });
        const objectives = objectivesQuery.flatMap(({ course }) => course.objectives.map((objective) => {
            return {
                ...objective.learningObjective,
                courseNumber: objective.courseNumber,
            };
        }));
        return NextResponse.json(objectives, { status: 200 });
    }
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
