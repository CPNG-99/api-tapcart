import { SignOptions, sign, verify, VerifyOptions, Jwt } from "jsonwebtoken";
import { TokenPayload } from "../api/auth/auth.dto";

const JWT_EXPIRES = process.env.JWT_EXPIRES || "";
const JWT_SECRET = process.env.JWT_SECRET || "";
const SIGN_OPTIONS: SignOptions = {
  algorithm: "HS256",
  expiresIn: JWT_EXPIRES,
};
const VERIFY_OPTIONS: VerifyOptions = {
  algorithms: ["HS256"],
};

export abstract class IJwtUtils {
  abstract generateToken(payload: TokenPayload): string;
  abstract verifyToken(token: string): Jwt;
}

class JwtUtils implements IJwtUtils {
  generateToken(payload: TokenPayload): string {
    return sign(payload, JWT_SECRET, SIGN_OPTIONS);
  }

  verifyToken(token: string): Jwt {
    return verify(token, JWT_SECRET, VERIFY_OPTIONS) as Jwt;
  }
}

export default JwtUtils;
