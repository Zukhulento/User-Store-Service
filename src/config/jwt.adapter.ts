import jwt, { SignOptions } from "jsonwebtoken";
import { envs } from "./envs";

// Dependencies
const JWT_SECRET = envs.JWT_SECRET;

export class JwtAdapter {
  static generateToken = (payload: any, duration: string | number = "2H") => {
    return new Promise((resolve) => {
      jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: duration as SignOptions["expiresIn"] },
        (err, token) => {
          if (err) {
            resolve(null);
            return;
          }
          resolve(token);
        }
      );
    });
  };

  static validateToken = (token: string) => {
    return new Promise((resolve) => {
      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
          resolve(null);
          return;
        }
        resolve(decoded);
      });
    });
  };
}
