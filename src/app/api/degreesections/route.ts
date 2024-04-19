import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

/*
Test Data should be like this:
http://localhost:3000/api/degreesections?degreeName=Computer%20Science&degreeLevel=BS&start=2022-01-01&end=2023-12-31
*/
export async function GET(req: NextRequest) {
    // Retrieve the degree name and level, and start/end dates from the query parameters
    const { searchParams } = req.nextUrl;
    const degreeName = searchParams.get('degreeName');
    const degreeLevel = searchParams.get('degreeLevel');
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    if (!degreeName || !degreeLevel) {
        return NextResponse.json({ reason: "Degree name and level are required" }, { status: 400 });
    }

    // Construct the date filter if both start and end dates are provided
    let dateFilter = {};
    if (start && end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return NextResponse.json({ reason: "Invalid date format provided" }, { status: 400 });
        }

        dateFilter = {
            startDate: { gte: startDate },
            endDate: { lte: endDate }
        };
    }

    try {
        // Fetch the degree with related courses and sections
        const degree = await prisma.degree.findUnique({
            where: {
                name_level: {
                    name: degreeName,
                    level: degreeLevel
                }
            },
            include: {
                DegreeCourses: {
                    include: {
                        course: {
                            include: {
                                sections: {
                                    where: dateFilter,
                                    orderBy: {
                                        startDate: 'asc'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!degree) {
            return NextResponse.json({ message: "No degree found with the specified name and level." }, { status: 404 });
        }

        // Flatten sections from nested course data
        const sections = degree.DegreeCourses.flatMap(dc => dc.course.sections).map(section => ({
            ...section,
            startDate: section.startDate.toISOString().slice(0, 10),
            endDate: section.endDate.toISOString().slice(0, 10)
        }));
        return NextResponse.json({  sections }, { status: 200 });
    } catch (error) {
        console.error("Failed to retrieve sections:", error);
        return NextResponse.json({ reason: "Internal server error" }, { status: 500 });
    }
}