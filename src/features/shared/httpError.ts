import * as Boom from '@hapi/boom';
import config from 'src/config/config';

export interface HttpError {
  status(statusCode:number):HttpError;
  payload(payload:Record<string, never>):HttpError;
  err(addErrorStack?:boolean):Boom.Boom;
}

function httpError(e: string | Error | Boom.Boom, causedBy?: Error | Boom.Boom):HttpError {
  const err = (e instanceof Error) ? e : new Error(e);
  const error = ((e as Boom.Boom).isBoom) ? (e as Boom.Boom) : Boom.internal(err.message);
  return {
    status(statusCode:number) {
      error.output.statusCode = statusCode;
      return this;
    },
    payload(payload:Record<string, never>) {
      error.output.payload = { ...error.output.payload, payload };
      return this;
    },
    err(addErrorStack = config.addErrorStack) {
      error.reformat();
      if (!addErrorStack) return error;
      error.output.payload = { ...error.output.payload, stack: error.stack };
      if (causedBy) {
        error.output.payload.causedBy = [
          ...((error.output.payload.causedBy as []) || []),
          causedBy.stack,
          ...((causedBy as Boom.Boom)?.output?.payload?.causedBy as [] || []),
        ];
      }
      return error;
    },
  };
}

export default httpError;
