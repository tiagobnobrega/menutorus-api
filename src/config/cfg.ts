import * as dateFns from 'date-fns';

const ENV = process.env;

interface CfgMetaData {
  isRequired:boolean;
  requiredKey:string;
}
interface Cfg {
  required():RequiredCfg;
  string():string|undefined;
  boolean():boolean;
  int(radix?:number):number|undefined;
  float():number|undefined;
  date(format:string):Date|undefined;
}
interface RequiredCfg {
  string():string;
  boolean():boolean;
  int(radix?:number):number;
  float():number;
  date(format:string):Date;
}
function cfg(envKey:string):Cfg;
function cfg(envKey:string, defaultValue: string):RequiredCfg;

function cfg(envKey:string, defaultValue?: string):Cfg|RequiredCfg {
  const rawValue = ENV[envKey] ?? defaultValue;
  const meta: CfgMetaData = { isRequired: false, requiredKey: envKey };

  const validateRequired = ():void => {
    if (meta.isRequired && typeof rawValue === 'undefined') throw new Error(`Required environment variable "${meta.requiredKey}" not set.`);
  };

  return {
    required(key?:string) {
      meta.isRequired = true;
      if (key) meta.requiredKey = key;
      return this as RequiredCfg;
    },
    string() {
      validateRequired();
      return rawValue || '';
    },
    int(radix = 10) {
      validateRequired();
      return rawValue ? Number.parseInt(rawValue, radix) : undefined;
    },
    float() {
      validateRequired();
      return rawValue ? Number.parseFloat(rawValue) : undefined;
    },
    date(format?:string) {
      validateRequired();
      if (!rawValue) return undefined;
      return format ? dateFns.parse(rawValue, format, new Date()) : dateFns.parseISO(rawValue);
    },
    boolean() {
      validateRequired();
      const valueToCheck = (rawValue ?? '').toLowerCase();
      if (!['true', 'false'].includes(valueToCheck)) {
        throw new Error(`Unparseable boolean value "${rawValue}" for environment variable "${meta.requiredKey}"`);
      }
      return valueToCheck === 'true';
    },
  };
}

export default cfg;
