import { bcryptAdapter, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, RegisterUserDto, UserEntity } from "../../domain";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";

export class AuthService {
  // DI
  constructor() {}
  public async registerUser(registerUserDto: RegisterUserDto) {
    const existUser = await UserModel.findOne({ email: registerUserDto.email });
    if (existUser) throw CustomError.badRequest("Email already registered");
    // Es buena práctica siempre cuando se haga una operación de base de datos,hacerla en un try catch
    try {
      const user = new UserModel(registerUserDto);
      // Encriptar la contraseña
      user.password = bcryptAdapter.hash(registerUserDto.password);
      // Generar el JWT
      await user.save();
      // Email de confirmación

      const { password, ...userEntity } = UserEntity.fromObject(user);
      return {
        user: userEntity,
        token: "token",
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
    const token = await JwtAdapter.generateToken(
      { id: userEntity.id, email: userEntity.email },
      "2H"
    );
    if (!token)
      throw CustomError.internalServerError("Error while creating JWT");
    return {
      user: userEntity,
      token: token,
    };
  }
}
