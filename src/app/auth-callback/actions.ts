"use server";

import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const getAuthStatus = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id || !user.email) {
    throw new Error("Invalid user data");
  }

  const existingUser = await db.user.findFirst({
    where: { id: user.id },
  });

  if (!existingUser) {
    await db.user.create({
      //@ts-ignore
      data: {
        id: user.id, // Ensure this maps to your schema's primary key
        email: user.email,
        kindeId: user.id, // Ensure kindeId is unique in your schema
      },
    });
  }

  return { success: true };
};
