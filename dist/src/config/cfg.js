"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dateFns = __importStar(require("date-fns"));
const ENV = process.env;
function cfg(envKey, defaultValue) {
    const rawValue = ENV[envKey] ?? defaultValue;
    const meta = { isRequired: false, requiredKey: envKey };
    const validateRequired = () => {
        if (meta.isRequired && typeof rawValue === 'undefined')
            throw new Error(`Required environment variable "${meta.requiredKey}" not set.`);
    };
    return {
        required(key) {
            meta.isRequired = true;
            if (key)
                meta.requiredKey = key;
            return this;
        },
        string(stringDefaultValue = '') {
            validateRequired();
            return rawValue || stringDefaultValue;
        },
        int(intDefaultValue) {
            validateRequired();
            return rawValue ? Number.parseInt(rawValue, 10) : intDefaultValue;
        },
        float(floatDefaultValue) {
            validateRequired();
            return rawValue ? Number.parseFloat(rawValue) : floatDefaultValue;
        },
        date(defaultDateValue, format) {
            validateRequired();
            if (rawValue) {
                return format ? dateFns.parse((rawValue), format, new Date()) : dateFns.parseISO(rawValue);
            }
            if (!defaultDateValue)
                return undefined;
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
exports.default = cfg;
