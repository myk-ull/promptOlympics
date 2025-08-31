import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './database';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

export interface UserPayload {
  id: string;
  email: string;
  username: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch {
    return null;
  }
}

export async function createSession(userId: string): Promise<string> {
  const token = generateToken({ 
    id: userId, 
    email: '', 
    username: '' 
  });
  
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  
  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt
    }
  });
  
  return token;
}

export async function validateSession(token: string) {
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true }
  });
  
  if (!session || session.expiresAt < new Date()) {
    return null;
  }
  
  return session.user;
}

export async function deleteSession(token: string) {
  await prisma.session.delete({
    where: { token }
  }).catch(() => null);
}