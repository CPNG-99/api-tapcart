import { SignOptions, sign } from "jsonwebtoken";
import { JwtSignPayload } from "../api/auth/auth.dto";

const JWT_EXPIRES = process.env.JWT_EXPIRES || "";
const JWT_SECRET = process.env.JWT_SECRET || "";

export abstract class IJwtUtils {
  abstract generateToken(payload: JwtSignPayload): string;
}

class JwtUtils implements IJwtUtils {
  generateToken(payload: JwtSignPayload): string {
    const signInOptions: SignOptions = {
      algorithm: "HS256",
      expiresIn: JWT_EXPIRES,
    };
    return sign(payload, JWT_SECRET, signInOptions);
  }
}

export default JwtUtils;
