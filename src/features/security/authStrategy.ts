import * as Hapi from '@hapi/hapi';
import { AuthCredentials, ServerRegisterPluginObject } from '@hapi/hapi';
import * as Jwt from '@hapi/jwt';
import { TokenType } from '@prisma/client';
import tokenService from 'src/features/security/tokenService';
import config from '../../config/config';
import { JwtToken } from './securityUtils';

type ValidationReturn = { isValid: false }|{
  isValid: true,
  credentials: AuthCredentials,
}|{
  response:Hapi.ResponseObject
};

interface JwtArtifacts {
  token: string,
  decoded: {
    header: any,
    payload: JwtToken,
    signature: string
  }
  raw: {
    header: string,
    payload: string,
    signature: string
  }
}

const checkToken = async (jwtArtifacts:JwtArtifacts, tokenTypes: TokenType[]): Promise<ValidationReturn> => {
  console.log('TESTE!!!!!');
  // Fetch the token from DB to verify it's valid
  const { jti } = jwtArtifacts.decoded.payload;
  if (!jti) {
    throw new Error('Malformed jwt token: jti not informed');
  }
  // TODO validate token without going to db after improving token security
  const dbToken = await tokenService.get(jti);
  if (!dbToken) {
    return { isValid: false };
  }
  //! No need to validate this if token can be trusted on its own
  const isTypeValid = tokenTypes.includes(dbToken.tokenType);
  const isDurationValid = dbToken.expiresAt.getTime() > Date.now();

  if (!isTypeValid || !isDurationValid) {
    await tokenService.delete(dbToken.id);
    return { isValid: false };
  }
  return {
    isValid: true,
    credentials: dbToken.user,
  };
};

// Function will be called on every request using the auth strategy
const validateAPIToken = async (
  artifacts: JwtArtifacts,
  request: Hapi.Request,
): Promise<ValidationReturn> => {
  try {
    return await checkToken(artifacts, [TokenType.DEFAULT]);
  } catch (error) {
    request.log(['error', 'auth'], `API auth token error: ${error}`);
    return { isValid: false };
  }
};

const validateConfirmationToken = async (
  artifacts: JwtArtifacts,
  request: Hapi.Request,
): Promise<ValidationReturn> => {
  try {
    return await checkToken(artifacts, [TokenType.EMAIL]);
  } catch (error) {
    request.log(['error', 'auth'], `API auth token error: ${error}`);
    return { isValid: false };
  }
};

export const AUTH_STRATEGIES = {
  API: 'API',
  CONFIRMATION: 'CONFIRMATION',
};

// TODO keys might be a function to implement secret rotation
export const registerAuthStrategy = async (server:Hapi.Server): Promise<void> => {
  await server.register(Jwt as ServerRegisterPluginObject<void>);
  //* API strategy (default)
  const strategyOpts = {
    keys: config.jwtSecret,
    verify: {
      sub: false,
      nbf: false,
      timeSkewSec: 0,
      iss: false,
      aud: TokenType.DEFAULT.toString(),
      exp: true, //! !!!! NumericDate (Secs / not Milliseconds from epoch),
    },
  };
  server.auth.strategy(AUTH_STRATEGIES.API, 'jwt', {
    ...strategyOpts,
    validate: validateAPIToken,
  });

  //* Confrimation strategy
  const confirmOpts = strategyOpts;
  confirmOpts.verify.aud = TokenType.EMAIL;
  server.auth.strategy(AUTH_STRATEGIES.CONFIRMATION, 'jwt', {
    ...confirmOpts,
    validate: validateConfirmationToken,
  });

  server.auth.default(AUTH_STRATEGIES.API);
};
