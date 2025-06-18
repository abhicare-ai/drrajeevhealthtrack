"use server";

import { lucia } from "@/auth";
import { prisma } from "@/lib/prisma";
// import redisClient from "@/lib/redis";
import { loginSchema, LoginValues } from "@/lib/validation";

import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
// import { generateIdFromEntropySize } from "lucia";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(
  credential: LoginValues,
): Promise<{ error: string }> {
  try {
    const { email, branch, password } = loginSchema.parse(credential);

    // Improved rate limiting
    // const key = `LOGIN_ATTEMPT:${email.toLowerCase()}`;
    // const blockKey = `LOGIN_BLOCKED:${email.toLowerCase()}`;
    // const maxAttempts = 5; // Allow 5 attempts
    // const windowSeconds = 60; // 1 minute window
    // const blockSeconds = 15 * 60; // Block for 15 minutes after limit

    // // Check if user is blocked
    // const isBlocked = await redisClient.get(blockKey);
    // if (isBlocked) {
    //   return {
    //     error: "Too many login attempts. Please wait 15 minutes and try again.",
    //   };
    // }

    // // Get current attempts
    // const attempts = await redisClient.incr(key);
    // if (attempts === 1) {
    //   await redisClient.expire(key, windowSeconds);
    // }

    // if (attempts > maxAttempts) {
    //   // Block user for 15 minutes
    //   await redisClient.set(blockKey, "1", "EX", blockSeconds);
    //   await redisClient.del(key); // Reset attempts
    //   return {
    //     error: "Too many login attempts. Please wait 15 minutes and try again.",
    //   };
    // }

    // //login...........
    // const existingUser = await prisma.user.findFirst({
    //   where: {
    //     email: {
    //       equals: email,
    //       mode: "insensitive",
    //     },
    //   },
    // });

    // if (!existingUser || !existingUser.branch || !existingUser.passwordHash) {
    //   return {
    //     error: "Incorreact email or password or branch",
    //   };
    // }

    // const existingBranch = existingUser.branch === branch;

    // if (!existingBranch) {
    //   return {
    //     error: "Incorreact email or password or branch",
    //   };
    // }

    // const validPassword = await verify(existingUser.passwordHash, password, {
    //   memoryCost: 19456,
    //   timeCost: 2,
    //   outputLen: 32,
    //   parallelism: 1,
    // });

    // if (!validPassword) {
    //   return {
    //     error: "Incorreact email or password or branch",
    //   };
    // }

    // // On successful login, reset attempts and block
    // await redisClient.del(key);
    // await redisClient.del(blockKey);
    // const session = await lucia.createSession(existingUser.id, {});
    // const sessionCookie = lucia.createSessionCookie(session.id);
    // (await cookies()).set(
    //   sessionCookie.name,
    //   sessionCookie.value,
    //   sessionCookie.attributes,
    // );

    // return redirect("/");

    //signup....

    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    const userId = generateIdFromEntropySize(10);

    await prisma.user.create({
      data: {
        id: userId,
        branch,
        email,
        passwordHash,
      },
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return {
      error: "Interval server error.",
    };
  }
}
