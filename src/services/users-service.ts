import { db } from "../db";
import { users, sessions } from "../db/schema";
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

export const loginUser = async (data: any) => {
  const { email, password } = data;

  // Find user by email
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  const userData = user[0];
  if (!userData) {
    throw new Error("incorrect email or password combination");
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, userData.password);

  if (!isPasswordValid) {
    throw new Error("incorrect email or password combination");
  }

  // Generate token
  const token = crypto.randomUUID();

  // Create session
  await db.insert(sessions).values({
    token,
    userId: userData.id,
  });

  return {
    name: userData.name,
    token,
  };
};

export const logoutUser = async (token: string | undefined) => {
  if (!token) {
    throw new Error("user not logged in");
  }

  const result = await db.delete(sessions).where(eq(sessions.token, token));

  // Drizzle MySQL delete returns ResultSetHeader with affectedRows
  if (result[0].affectedRows === 0) {
    throw new Error("user not logged in");
  }

  return true;
};
