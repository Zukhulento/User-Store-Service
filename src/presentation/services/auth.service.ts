import { bcryptAdapter, envs, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, RegisterUserDto, UserEntity } from "../../domain";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";
import { EmailService } from "./email.service";

export class AuthService {
  // DI
  constructor(private readonly emailService: EmailService) {}
  public async registerUser(registerUserDto: RegisterUserDto) {
    const existUser = await UserModel.findOne({ email: registerUserDto.email });
    if (existUser) throw CustomError.badRequest("Email already registered");
    // Es buena práctica siempre cuando se haga una operación de base de datos,hacerla en un try catch
    try {
      const user = new UserModel(registerUserDto);
      // Encriptar la contraseña
      user.password = bcryptAdapter.hash(registerUserDto.password);
      // Generar el JWT
      const token = await JwtAdapter.generateToken({ id: user.id }, "2H");
      if (!token)
        throw CustomError.internalServerError("Error while creating JWT");
      // Email de confirmación
      await this.sendEmailWithValidationLink(user.email);
      await user.save();

      const { password, ...userEntity } = UserEntity.fromObject(user);
      return {
        user: userEntity,
        token: token,
      };
    } catch (error) {
      throw CustomError.internalServerError(`Error: ${error}`);
    }
  }

  public async loginUser(loginUserDto: LoginUserDto) {
    const existUser = await UserModel.findOne({ email: loginUserDto.email });
    if (!existUser) throw CustomError.badRequest("Invalid credentials");
    const isMatch = bcryptAdapter.compare(
      loginUserDto.password,
      existUser.password
    );
    if (!isMatch) throw CustomError.badRequest("Invalid credentials");
    const { password, ...userEntity } = UserEntity.fromObject(existUser);
    const token = await JwtAdapter.generateToken({ id: userEntity.id }, "2H");
    if (!token)
      throw CustomError.internalServerError("Error while creating JWT");
    return {
      user: userEntity,
      token: token,
    };
  }

  public validateEmail = async (token: string) => {
    const payload = await JwtAdapter.validateToken(token);
    if (!payload) throw CustomError.unauthorized("Invalid token");
    const { email } = payload as { email: string };
    if(!email) throw CustomError.internalServerError("Email not included")

    const user = await UserModel.findOne({ email });
    if (!user) throw CustomError.badRequest("User with this email not found");
    user.emailValidated = true;
    await user.save();
    return true;
  };

  private sendEmailWithValidationLink = async (email: string) => {
    const token = await JwtAdapter.generateToken({ email });
    if (!token) {
      throw CustomError.internalServerError("Error while creating JWT");
    }
    const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
    const htmlBody = `
    <h1>Validate your email</h1>
    <p>Click in the following link to validate your email</p>
    <a href="${link}">Validate your email</a>
    `;
    const options = {
      to: email,
      subject: "Validate your email",
      htmlBody: htmlBody,
    };
    const isSent = await this.emailService.sendEmail(options);
    if (!isSent) {
      throw CustomError.internalServerError("Error while sending email");
    }
    return true;
  };
}
