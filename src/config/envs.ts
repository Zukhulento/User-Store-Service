import 'dotenv/config';
import { get } from 'env-var';


export const envs = {

  PORT: get('PORT').required().asPortNumber(),
  MONGO_URL: get('MONGO_URL').required().asString(),
  MONGO_DB: get('MONGO_DB').required().asString(),
  JWT_SECRET: get('JWT_SECRET').required().asString(),

}