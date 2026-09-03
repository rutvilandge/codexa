import { hashPassword } from "../utils/hash";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";

export class DuplicateEmailError extends Error {
  constructor() {
    super("Email already exists");
  }
}

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new DuplicateEmailError();
  }

  const hashedPassword = await hashPassword(password);

  let user;
  try {
    user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      throw new DuplicateEmailError();
    }
    throw error;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return null;
  }

  return user;
}
