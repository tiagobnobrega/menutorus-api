import * as dateFns from 'date-fns';

const ENV = process.env;

interface CfgMetaData {
  isRequired:boolean;
  requiredKey:string;
}

interface Cfg {
  required():RequiredCfg;
  string(stringDefaultValue: string):string;
  string():string|void;
  boolean():boolean;
  boolean(booleanDefaultValue: boolean):boolean;
  int(intDefaultValue:number):number;
  int():number|void;
  float():number|void;
  float(floatDefaultValue: number):number;
  date(defaultDateValue:undefined, format?:string):Date|void;
  date(defaultDateValue?:Date, format?:string):Date;
}
interface RequiredCfg {
  string():string;
  boolean():boolean;
  int():number;
  float():number;
  date(format?:string):Date;
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
    string(stringDefaultValue = '') {
      validateRequired();
      return rawValue || stringDefaultValue;
    },
    int(intDefaultValue?: number) {
      validateRequired();
      return rawValue ? Number.parseInt(rawValue, 10) : (intDefaultValue as number);
    },
    float(floatDefaultValue?: number) {
      validateRequired();
      return rawValue ? Number.parseFloat(rawValue) : (floatDefaultValue as number);
    },
    date(defaultDateValue?:Date, format?:string) {
      validateRequired();
      if (rawValue) {
        return format ? dateFns.parse((rawValue), format, new Date()) : dateFns.parseISO(rawValue);
      }
      if (!defaultDateValue) return (undefined as unknown as Date);
      return defaultDateValue;
    },
    boolean(booleanDefaultValue = false) {
      validateRequired();
      const valueToCheck = (rawValue ?? booleanDefaultValue.toString()).toLowerCase();
      if (!['true', 'false'].includes(valueToCheck)) {
        throw new Error(`Unparseable boolean value "${rawValue}" for environment variable "${meta.requiredKey}"`);
      }
      return valueToCheck === 'true';
    },
  };
}

export default cfg;
