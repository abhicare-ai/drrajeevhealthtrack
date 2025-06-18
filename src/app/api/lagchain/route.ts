import { agent } from "@/lib/agents";
import { prisma } from "@/lib/prisma";
import { HumanMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

export async function POST(req: Request) {
  const { message } = await req.json();
  const result = await agent.invoke({
    messages: [new HumanMessage(message)],
  });

  return Response.json(result.messages[result.messages.length - 1].content);
}

// Tool to find users by name
export const getUsersByName = tool(
  async ({ name }: { name: string }) => {
    try {
      const users = await prisma.addNewPatient.findMany({
        where: {
          patientName: {
            contains: name,
            mode: "insensitive",
          },
        },
      });

      return users.length > 0
        ? JSON.stringify(users)
        : `No users found with name containing "${name}"`;
    } catch (error) {
      console.error("Error searching users by name:", error);
      return "Failed to search users by name";
    }
  },
  {
    name: "getUsersByName",
    description: "Search for users by name (case insensitive, partial matches)",
    schema: z.object({
      name: z.string().describe("The name or part of name to search for"),
    }),
  },
);
