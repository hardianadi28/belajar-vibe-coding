import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export const registerUser = async (data: any) => {
  const { name, email, password } = data;

  // Check if user already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    throw new Error("user already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert user
  const result = await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
  });

  return {
    id: result[0].insertId,
    name,
  };
};
