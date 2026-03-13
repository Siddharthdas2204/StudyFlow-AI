import { type Request, type Response, type NextFunction } from "express";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "";

// Initialize Supabase admin or just use the client for verification
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function supabaseAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return next(); // Not authenticated but let it pass to routes (some might be public)
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return next();
    }

    // Map Supabase user to the application's AuthUser type
    req.user = {
      id: user.id,
      username: user.email?.split("@")[0] || "User",
      email: user.email
    } as any;

    next();
  } catch (err) {
    console.error("Auth error:", err);
    next();
  }
}
