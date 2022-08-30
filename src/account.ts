import type { Request, Response, NextFunction } from "express";
import { User, UserType } from "./db";

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.url === "/api/login") return next();
  if (!req.cookies.token) return res.redirect("/login");
  const user = await User.findOne({
    where: { token: req.cookies.token as string },
  });
  if (!user) return res.redirect("/login");
  req.user = user.toJSON<UserType>();
  next();
}
