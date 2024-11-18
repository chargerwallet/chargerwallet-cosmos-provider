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
exports.ProviderCosmos = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable tsdoc/syntax */
const utils_1 = require("@noble/hashes/utils");
const extension_bridge_injected_1 = require("@chargerwallet/extension-bridge-injected");
const ProviderCosmosBase_1 = require("./ProviderCosmosBase");
const long_1 = __importDefault(require("long"));
const cosmjs_1 = require("./cosmjs");
const lodash_1 = require("lodash");
const uint8_array_1 = require("./utils/uint8-array");
const PROVIDER_EVENTS = {
    'connect': 'connect',
    'disconnect': 'disconnect',
    'keplr_keystorechange': 'keplr_keystorechange',
    'accountChanged': 'accountChanged',
    'message_low_level': 'message_low_level',
};
function isWalletEventMethodMatch({ method, name }) {
    return method === `wallet_events_${name}`;
}
class ProviderCosmos extends ProviderCosmosBase_1.ProviderCosmosBase {
    constructor(props) {
        super(Object.assign(Object.assign({}, props), { bridge: props.bridge || (0, extension_bridge_injected_1.getOrCreateExtInjectedJsBridge)({ timeout: props.timeout }) }));
        this.mode = 'extension';
        this._account = null;
        this.defaultOptions = {};
        this._registerEvents();
    }
    _registerEvents() {
        window.addEventListener('chargerwallet_bridge_disconnect', () => {
            this._handleDisconnected();
        });
        this.on(PROVIDER_EVENTS.message_low_level, (payload) => {
            if (!payload)
                return;
            const { method, params } = payload;
            if (isWalletEventMethodMatch({ method, name: PROVIDER_EVENTS.accountChanged })) {
                this._handleAccountChange(params);
            }
        });
        this.on(PROVIDER_EVENTS.keplr_keystorechange, () => {
            window.dispatchEvent(new Event(PROVIDER_EVENTS.keplr_keystorechange));
        });
        window.addEventListener('message', (e) => {
            const data = e.data;
            if (data && data.type === 'proxy-request' && data.method) {
                const method = data.method;
                if (this[method]) {
                    const unwrapedArgs = uint8_array_1.JSONUint8Array.unwrap(data.args);
                    this[method](...unwrapedArgs).then((res) => {
                        window.postMessage({
                            type: 'proxy-request-response',
                            id: data.id,
                            result: uint8_array_1.JSONUint8Array.wrap({
                                return: res,
                            }),
                        });
                    }).catch((err) => {
                        window.postMessage({
                            type: 'proxy-request-response',
                            id: data.id,
                            result: {
                                error: err.message,
                            },
                        });
                    });
                }
                else {
                    window.postMessage({
                        type: 'proxy-request-response',
                        id: data.id,
                        result: {
                            error: 'not found method',
                        },
                    });
                }
            }
        });
    }
    _callBridge(params) {
        return this.bridgeRequest(params);
    }
    _handleConnected(account, options = { emit: true }) {
        this._account = account;
        if (options.emit && this.isConnectionStatusChanged('connected')) {
            this.connectionStatus = 'connected';
            const address = account !== null && account !== void 0 ? account : null;
            this.emit('connect', address);
            // this.emit('keplr_keystorechange');
        }
    }
    _handleDisconnected(options = { emit: true }) {
        this._account = null;
        if (options.emit && this.isConnectionStatusChanged('disconnected')) {
            this.connectionStatus = 'disconnected';
            this.emit('disconnect');
            // this.emit('keplr_keystorechange');
        }
    }
    isAccountsChanged(account) {
        if (!account)
            return false;
        if (!this._account)
            return true;
        return account.pubKey !== this._account.pubKey;
    }
    // trigger by bridge account change event
    _handleAccountChange(payload) {
        const account = payload;
        if (this.isAccountsChanged(account)) {
            this.emit(PROVIDER_EVENTS.keplr_keystorechange);
        }
        if (!account) {
            this._handleDisconnected();
            return;
        }
        this._handleConnected(account, { emit: false });
    }
    isNetworkChanged(network) {
        return this._network === undefined || network !== this._network;
    }
    isConnected() {
        return this._account !== null;
    }
    on(event, listener) {
        return super.on(event, listener);
    }
    emit(event, ...args) {
        return super.emit(event, ...args);
    }
    enable(chainIds) {
        return this._callBridge({
            method: 'enable',
            params: (0, lodash_1.isArray)(chainIds) ? chainIds : [chainIds],
        });
    }
    disconnect() {
        return this._callBridge({
            method: 'disconnect',
            // @ts-expect-error
            params: undefined,
        });
    }
    getKey(chainId) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = yield this._callBridge({
                method: 'getKey',
                params: chainId,
            });
            return Object.assign(Object.assign({}, key), { 
                // @ts-expect-error
                pubKey: (0, utils_1.hexToBytes)(key.pubKey), 
                // @ts-expect-error
                address: (0, utils_1.hexToBytes)(key.address) });
        });
    }
    ping() {
        return Promise.resolve();
    }
    experimentalSuggestChain(chain) {
        return this._callBridge({
            method: 'experimentalSuggestChain',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            params: chain,
        });
    }
    signAmino(chainId, signer, signDoc, signOptions) {
        return this._callBridge({
            method: 'signAmino',
            // @ts-expect-error
            params: {
                chainId,
                signer,
                signDoc,
                signOptions,
            },
        });
    }
    signDirect(chainId, signer, signDoc, signOptions) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this._callBridge({
                method: 'signDirect',
                // @ts-expect-error
                params: {
                    chainId,
                    signer,
                    signDoc: {
                        bodyBytes: (signDoc === null || signDoc === void 0 ? void 0 : signDoc.bodyBytes) ? (0, utils_1.bytesToHex)(signDoc === null || signDoc === void 0 ? void 0 : signDoc.bodyBytes) : null,
                        authInfoBytes: (signDoc === null || signDoc === void 0 ? void 0 : signDoc.authInfoBytes) ? (0, utils_1.bytesToHex)(signDoc === null || signDoc === void 0 ? void 0 : signDoc.authInfoBytes) : null,
                        chainId: signDoc.chainId,
                        accountNumber: (_a = signDoc === null || signDoc === void 0 ? void 0 : signDoc.accountNumber) === null || _a === void 0 ? void 0 : _a.toString(),
                    },
                    signOptions,
                },
            });
            return Object.assign(Object.assign({}, res), { signed: {
                    // @ts-expect-error
                    bodyBytes: (0, utils_1.hexToBytes)(res.signed.bodyBytes),
                    // @ts-expect-error
                    authInfoBytes: (0, utils_1.hexToBytes)(res.signed.authInfoBytes),
                    // @ts-expect-error
                    accountNumber: long_1.default.fromString(res.signed.accountNumber),
                    chainId: res.signed.chainId,
                } });
        });
    }
    sendTx(chainId, tx, mode) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this._callBridge({
                method: 'sendTx',
                // @ts-expect-error
                params: {
                    chainId,
                    tx: (0, utils_1.bytesToHex)(tx),
                    mode,
                },
            });
            return (0, utils_1.hexToBytes)(res);
        });
    }
    signArbitrary(chainId, signer, data) {
        const newData = typeof data === 'string' ? data : (0, utils_1.bytesToHex)(data);
        return this._callBridge({
            method: 'signArbitrary',
            // @ts-expect-error
            params: {
                chainId,
                signer,
                data: newData,
            },
        });
    }
    verifyArbitrary(chainId, signer, data, signature) {
        return this._callBridge({
            method: 'verifyArbitrary',
            // @ts-expect-error
            params: {
                chainId,
                signer,
                data: typeof data === 'string' ? data : (0, utils_1.bytesToHex)(data),
                signature,
            },
        });
    }
    signEthereum(chainId, signer, data, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this._callBridge({
                method: 'signEthereum',
                // @ts-expect-error
                params: {
                    chainId,
                    signer,
                    data: typeof data === 'string' ? data : (0, utils_1.bytesToHex)(data),
                    type,
                },
            });
            return (0, utils_1.hexToBytes)(res);
        });
    }
    getOfflineSigner(chainId) {
        return new cosmjs_1.CosmJSOfflineSigner(chainId, this);
    }
    getOfflineSignerOnlyAmino(chainId) {
        return new cosmjs_1.CosmJSOfflineSignerOnlyAmino(chainId, this);
    }
    getOfflineSignerAuto(chainId) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = yield this.getKey(chainId);
            if (key.isNanoLedger) {
                return new cosmjs_1.CosmJSOfflineSignerOnlyAmino(chainId, this);
            }
            return new cosmjs_1.CosmJSOfflineSigner(chainId, this);
        });
    }
}
exports.ProviderCosmos = ProviderCosmos;
