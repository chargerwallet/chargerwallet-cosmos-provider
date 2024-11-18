"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONUint8Array = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// The JSON encoder that supports the `Uint8Array`.
const hex_1 = require("./hex");
class JSONUint8Array {
    static parse(text) {
        return JSON.parse(text, (key, value) => {
            // Prevent potential prototype poisoning.
            if (key === "__proto__") {
                throw new Error("__proto__ is disallowed");
            }
            if (value &&
                typeof value === "string" &&
                value.startsWith("__uint8array__")) {
                return (0, hex_1.fromHex)(value.replace("__uint8array__", ""));
            }
            return value;
        });
    }
    static stringify(obj) {
        return JSON.stringify(obj, (key, value) => {
            // Prevent potential prototype poisoning.
            if (key === "__proto__") {
                throw new Error("__proto__ is disallowed");
            }
            if (value &&
                (value instanceof Uint8Array ||
                    (typeof value === "object" &&
                        "type" in value &&
                        "data" in value &&
                        value.type === "Buffer" &&
                        Array.isArray(value.data)))) {
                const array = value instanceof Uint8Array ? value : new Uint8Array(value.data);
                return `__uint8array__${(0, hex_1.toHex)(array)}`;
            }
            return value;
        });
    }
    static wrap(obj) {
        if (obj === undefined)
            return undefined;
        return JSON.parse(JSONUint8Array.stringify(obj));
    }
    static unwrap(obj) {
        if (obj === undefined)
            return undefined;
        return JSONUint8Array.parse(JSON.stringify(obj));
    }
}
exports.JSONUint8Array = JSONUint8Array;
