import { CustomError } from "../errors/custom.error";

export class UserEntity {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public emailValidated: boolean,
    public password: string,
    public img: string,
    public role: string,
    public isActive: string
  ) {}

  static fromObject(object: { [key: string]: any}){
    //* Destructuring the object
    const { id,_id, name, email, emailValidated, password, img, role, isActive } = object;

    if(!id && !_id) throw CustomError.badRequest("Missing id");
    if(!name) throw CustomError.badRequest("Missing name");
    if(!email) throw CustomError.badRequest("Missing email");
    if(emailValidated === undefined) throw CustomError.badRequest("Missing emailValidated");
    if(!password) throw CustomError.badRequest("Missing password");
    if(!role) throw CustomError.badRequest("Missing role");
    if(isActive === undefined) throw CustomError.badRequest("Missing isActive");

    //* Creating a new instance of the UserEntity
    return new UserEntity(id || _id, name, email, emailValidated, password, img, role, isActive);
  }
}
