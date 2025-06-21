import { NextFunction, Request, Response } from "express";
import { CustomError, UserEntity } from "../../domain";
import { JwtAdapter } from "../../config";
import { UserModel } from "../../data";

export class AuthMiddleware {
  // En caso de no necesitar inyectar depedencias se usan los metodos estaticos
  static async validateJWT(req: Request, res: Response, next: NextFunction) {
    const authorizationn = req.header("Authorization");
    if (!authorizationn) {
      res.status(401).json({
        error: "No token provided",
      });
      return;
    }
    if (!authorizationn.startsWith("Bearer ")) {
      res.status(401).json({ error: "Invalid Bearer token" });
      return;
    }
    const token = authorizationn.split(" ").at(1) || "";

    try {
      const payload = await JwtAdapter.validateToken<{ id: string }>(token);
      if (!payload) {
        res.status(401).json({ error: "Invalid token" });
        return;
      }
      const user = await UserModel.findById(payload.id);
      if (!user) {
        res.status(401).json({ error: "Invalid token - user" });
        return;
      }
      req.body.user = UserEntity.fromObject(user);
      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  }
}
