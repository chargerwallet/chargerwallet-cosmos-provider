"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CosmJSOfflineSigner = exports.CosmJSOfflineSignerOnlyAmino = void 0;
const long_1 = __importDefault(require("long"));
class CosmJSOfflineSignerOnlyAmino {
    constructor(chainId, service) {
        this.chainId = chainId;
        this.service = service;
    }
    getAccounts() {
        return __awaiter(this, void 0, void 0, function* () {
            const key = yield this.service.getKey(this.chainId);
            return [
                {
                    address: key.bech32Address,
                    // Currently, only secp256k1 is supported.
                    algo: 'secp256k1',
                    pubkey: key.pubKey,
                },
            ];
        });
    }
    signAmino(signerAddress, signDoc) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.chainId !== signDoc.chain_id) {
                throw new Error('Unmatched chain id with the offline signer');
            }
            const key = yield this.service.getKey(signDoc.chain_id);
            if (key.bech32Address !== signerAddress) {
                throw new Error('Unknown signer address');
            }
            return yield this.service.signAmino(this.chainId, signerAddress, signDoc);
        });
    }
    // Fallback function for the legacy cosmjs implementation before the staragte.
    sign(signerAddress, signDoc) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.signAmino(signerAddress, signDoc);
        });
    }
}
exports.CosmJSOfflineSignerOnlyAmino = CosmJSOfflineSignerOnlyAmino;
class CosmJSOfflineSigner extends CosmJSOfflineSignerOnlyAmino {
    constructor(chainId, service) {
        super(chainId, service);
        this.chainId = chainId;
        this.service = service;
    }
    signDirect(signerAddress, signDoc) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.chainId !== signDoc.chainId) {
                throw new Error('Unmatched chain id with the offline signer');
            }
            const key = yield this.service.getKey(signDoc.chainId);
            if (key.bech32Address !== signerAddress) {
                throw new Error('Unknown signer address');
            }
            return yield this.service.signDirect(this.chainId, signerAddress, {
                bodyBytes: signDoc.bodyBytes,
                authInfoBytes: signDoc.authInfoBytes,
                accountNumber: long_1.default.fromValue(signDoc.accountNumber),
                chainId: signDoc.chainId,
            });
        });
    }
}
exports.CosmJSOfflineSigner = CosmJSOfflineSigner;
