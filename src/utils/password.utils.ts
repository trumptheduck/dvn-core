import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
const scryptAsync = promisify(scrypt);

export interface HashedPassword {
    hash: string,
    salt: string
}

export interface PermissionsObject {
  permissions: string[];
}

export class PasswordUtils {

    static async hashPassword(password: string): Promise<HashedPassword> {
      const salt = randomBytes(16).toString("hex");
      const buf = (await scryptAsync(password, salt, 64)) as Buffer;
      return {
        hash: buf.toString("hex"),
        salt: salt
      }
    }
  
    static async comparePassword(
      hashedPassword: HashedPassword,
      suppliedPassword: string
    ): Promise<boolean> {
      const {hash, salt} = hashedPassword;
      const hashedPasswordBuf = Buffer.from(hash, "hex");
      const suppliedPasswordBuf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
      return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
    }
  }