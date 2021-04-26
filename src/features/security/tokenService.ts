import {
  Token, User, Prisma,
} from '@prisma/client';
import config from 'src/config/config';
import securityUtils, { JwtToken } from 'src/features/security/securityUtils';
import { convertPrismaError, prisma } from '../shared/prisma';
import { CrudProvider } from '../shared/types';

const { token } = prisma;
const include = { user: true };

interface RichToken extends Token {user: User}
interface TokenProvider extends CrudProvider<RichToken, string> {
  listForUser(username: string, skip:number, take:number): Promise<Token[]>;
  create(tokenData: Pick<Token, 'owner'|'tokenType'>): Promise<RichToken>;
  toJwt(token:RichToken):JwtToken;
}

function obfuscateToken(srcToken: RichToken): RichToken {
  return { ...srcToken, user: securityUtils.obfuscateUser(srcToken.user) };
}

const tokenService: TokenProvider = {
  async create(tokenData: Pick<Token, 'owner'|'tokenType'>) {
    const { owner, tokenType, ...rest } = tokenData;
    const duration = config.tokenDuration[tokenType];
    const data: Prisma.TokenCreateInput = {
      ...rest,
      expiresAt: new Date(Date.now() + duration),
      tokenType,
      user: { connect: { username: owner } },
    };
    const dbToken = await token.create({ data, include });
    return obfuscateToken(dbToken);
  },
  async delete(id: string) {
    try {
      await prisma.$transaction([
        token.delete({ where: { id } })]);
    } catch (error) { throw convertPrismaError(error); }
  },
  async get(id: string) {
    const dbToken = await token.findUnique({ where: { id }, include });
    return dbToken ? obfuscateToken(dbToken) : undefined;
  },
  async list(skip:number, take:number) {
    return token.findMany({ skip, take, include });
  },
  async update(tokenData) {
    const { owner, ...rest } = tokenData;
    const data: Prisma.TokenUpdateInput = {
      ...rest,
      user: { connect: { username: owner } },
    };
    return token.update({ data, where: { id: tokenData.id }, include });
  },
  async listForUser(username: string, skip:number, take:number) {
    return token.findMany({
      where: { owner: username }, skip, take, include,
    });
  },
  toJwt(tokenData:RichToken):JwtToken {
    return {
      jti: tokenData.id,
      aud: tokenData.tokenType,
      exp: Math.floor(tokenData.expiresAt.getTime() / 1000),
      sub: tokenData.owner,
    };
  },
};

export default tokenService;
