import { validateRequest } from "@/auth";
import { prisma } from "@/lib/prisma";
import redisClient from "@/lib/redis";
import { getApptDataInclude, AppoinmentsPage } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = 10;

    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Redis key with cursor for pagination
    const redisKey = cursor
      ? `appointment-feed:for-you:userId:${user.id}:cursor:${cursor}`
      : `appointment-feed:for-you:userId:${user.id}:first`;

    // Try to get from cache
    const cached = await redisClient.get(redisKey);
    if (cached) {
      console.log("get from cache");
      return Response.json(JSON.parse(cached));
    }

    // Fetch from DB
    const posts = await prisma.addNewPatient.findMany({
      where: {
        userId: user.id,
      },
      include: getApptDataInclude(),
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });
    console.log("get normal");
    const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;

    const data: AppoinmentsPage = {
      appoinments: posts.slice(0, pageSize),
      nextCursor,
    };

    // Set cache for 2 minutes (120 seconds)
    await redisClient.set(redisKey, JSON.stringify(data));

    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
