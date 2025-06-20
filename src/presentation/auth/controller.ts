// El controlador está encargador de retornar la respuesta al cliente

import { Request, Response } from "express";
import { CustomError, RegisterUserDto } from "../../domain";
import { AuthService } from "../services/auth.service";
import { LoginUserDto } from "../../domain";

export class AuthController {
  // DI
  constructor(private readonly authService: AuthService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({
        error: error.message,
      });
      return;
    }
    console.log(`Error: ${error}`);
    res.status(500).json({
      error: "Internal server error",
    });
  };

  registerUser = (req: Request, res: Response) => {
    //* Validación de los datos con el DTO
    const [errorMessage, registerUserDto] = RegisterUserDto.create(req.body);
    if (errorMessage) return res.status(400).json({ errorMessage });
    this.authService
      .registerUser(registerUserDto!)
      .then((user) => {
        res.json(user);
      })
      .catch((e) => this.handleError(e, res));
  };
  loginUser = (req: Request, res: Response) => {
    const [errorMessage, loginUserDto] = LoginUserDto.create(req.body);
    if (errorMessage) return res.status(400).json({ errorMessage });
    this.authService
      .loginUser(loginUserDto!)
      .then((user) => {
        res.json(user);
      })
      .catch((e) => this.handleError(e, res));
  };
  validateUser = (req: Request, res: Response) => {
    res.json("validateUser");
  };
}
