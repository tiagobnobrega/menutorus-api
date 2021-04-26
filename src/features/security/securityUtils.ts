import bcrypt from 'bcrypt';
import { Token, TokenType, User } from '@prisma/client';
import * as Jwt from '@hapi/jwt';
import config from 'src/config/config';

export interface JwtToken {
  jti: Token['id'];
  exp: number;
  sub: string;
  aud: TokenType;
}

export interface ObfuscatedUser extends User {
  pwd: '***'
}

export default {
  async hash(pwd: string, rounds = 10): Promise<string> {
    return bcrypt.hash(pwd, rounds);
  },
  async compare(data: string, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  },
  obfuscateUser(user:User):ObfuscatedUser {
    return { ...user, pwd: '***' };
  },
  generateToken(payload: JwtToken): string {
    return Jwt.token.generate(payload, config.jwtSecret);
  },
};
