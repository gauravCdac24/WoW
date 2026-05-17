import bcrypt from "bcryptjs";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  type Role,
  type User,
  createUser,
  findUserByEmail,
  findUserById,
  publicUser,
} from "./stores.js";

const JWT_SECRET = process.env.JWT_SECRET || "kaamchor-prototype-dev-secret";
const TOKEN_TTL = "7d";

type JwtPayload = { sub: string; role: Role; email: string };

function signToken(u: User): string {
  const payload: JwtPayload = { sub: u.id, role: u.role, email: u.email };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_TTL });
}

function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (!decoded?.sub) return null;
    return decoded;
  } catch {
    return null;
  }
}

export interface AuthedRequest extends Request {
  user?: User;
}

export function authOptional(req: AuthedRequest, _res: Response, next: NextFunction) {
  const header = req.header("authorization") || req.header("Authorization");
  if (!header) return next();
  const match = /^Bearer (.+)$/i.exec(header);
  if (!match) return next();
  const payload = verifyToken(match[1]);
  if (payload) {
    const user = findUserById(payload.sub);
    if (user) req.user = user;
  }
  next();
}

export function authRequired(req: AuthedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    res.status(401).json({ error: "auth_required", message: "Login required" });
    return;
  }
  next();
}

export function requireRole(...roles: Role[]) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: "auth_required", message: "Login required" });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: "forbidden", message: "Insufficient role" });
      return;
    }
    next();
  };
}

const ALLOWED_ROLES: Role[] = ["finder", "lister"];

function validateSignupBody(body: unknown) {
  const b = (body || {}) as Record<string, unknown>;
  const email = String(b.email || "").trim().toLowerCase();
  const password = String(b.password || "");
  const name = String(b.name || "").trim();
  const phone = String(b.phone || "").trim();
  const role = String(b.role || "").trim() as Role;
  const errors: string[] = [];
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("valid email required");
  if (password.length < 8) errors.push("password must be 8+ characters");
  if (name.length < 2) errors.push("full name is required");
  const phoneDigits = phone.replace(/[^0-9]/g, "");
  if (phoneDigits.length < 7 || phoneDigits.length > 15) {
    errors.push("valid contact number is required");
  }
  if (!ALLOWED_ROLES.includes(role)) errors.push("role must be 'finder' or 'lister'");
  return { email, password, name, phone, role, errors };
}

export function handleSignup(req: Request, res: Response) {
  const { email, password, name, phone, role, errors } = validateSignupBody(req.body);
  if (errors.length) {
    res.status(400).json({ error: "validation_error", message: errors.join(", ") });
    return;
  }
  try {
    const user = createUser({ email, password, name, role, phone });
    const token = signToken(user);
    res.status(201).json({ token, user: publicUser(user) });
  } catch (e) {
    const err = e as { code?: string; message?: string };
    if (err.code === "email_exists") {
      res.status(409).json({ error: "email_exists", message: "Email already registered" });
      return;
    }
    res.status(500).json({ error: "server_error", message: err.message || "Signup failed" });
  }
}

export function handleLogin(req: Request, res: Response) {
  const body = (req.body || {}) as Record<string, unknown>;
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  if (!email || !password) {
    res.status(400).json({ error: "validation_error", message: "email and password required" });
    return;
  }
  const user = findUserByEmail(email);
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    res.status(401).json({ error: "invalid_credentials", message: "Invalid email or password" });
    return;
  }
  const token = signToken(user);
  res.json({ token, user: publicUser(user) });
}

export function handleMe(req: AuthedRequest, res: Response) {
  if (!req.user) {
    res.status(401).json({ error: "auth_required", message: "Login required" });
    return;
  }
  res.json({ user: publicUser(req.user) });
}
