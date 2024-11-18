import type { IInpageProviderConfig } from '@chargerwallet/cross-inpage-provider-core';
import { ProviderCosmosBase } from './ProviderCosmosBase';
import type { IJsonRpcRequest } from '@chargerwallet/cross-inpage-provider-types';
import type { AminoSignResponse, BroadcastMode, DirectSignResponse, DirectSignResponseHex, EthSignType, KeplrIntereactionOptions, KeplrMode, KeplrSignOptions, Key, KeyHex, OfflineAminoSigner, OfflineDirectSigner, StdSignature, StdSignDoc } from './types';
import Long from 'long';
declare const PROVIDER_EVENTS: {
    readonly connect: "connect";
    readonly disconnect: "disconnect";
    readonly keplr_keystorechange: "keplr_keystorechange";
    readonly accountChanged: "accountChanged";
    readonly message_low_level: "message_low_level";
};
type CosmosProviderEventsMap = {
    [PROVIDER_EVENTS.connect]: (account: Key) => void;
    [PROVIDER_EVENTS.disconnect]: () => void;
    [PROVIDER_EVENTS.keplr_keystorechange]: () => void;
    [PROVIDER_EVENTS.message_low_level]: (payload: IJsonRpcRequest) => void;
};
export type CosmosRequest = {
    'enable': (chainIds: string[]) => Promise<void>;
    'disconnect': (chainIds: string[]) => Promise<void>;
    'experimentalSuggestChain': (chain: any) => Promise<void>;
    'getKey': (chainId: string) => Promise<KeyHex>;
    'signAmino': (chainId: string, signer: string, signDoc: StdSignDoc, signOptions?: KeplrSignOptions) => Promise<AminoSignResponse>;
    'signDirect': (chainId: string, signer: string, signDoc: {
        /** SignDoc bodyBytes */
        bodyBytes?: string | null;
        /** SignDoc authInfoBytes */
        authInfoBytes?: string | null;
        /** SignDoc chainId */
        chainId?: string | null;
        /** SignDoc accountNumber */
        accountNumber?: string | null;
    }, signOptions?: KeplrSignOptions) => Promise<DirectSignResponseHex>;
    'sendTx': (chainId: string, tx: string, mode: BroadcastMode) => Promise<string>;
    'signArbitrary': (chainId: string, signer: string, data: string | Uint8Array) => Promise<StdSignature>;
    'verifyArbitrary': (chainId: string, signer: string, data: string | Uint8Array, signature: StdSignature) => Promise<boolean>;
    'signEthereum': (chainId: string, signer: string, data: string | Uint8Array, type: EthSignType) => Promise<string>;
};
export type PROVIDER_EVENTS_STRINGS = keyof typeof PROVIDER_EVENTS;
export interface IProviderCosmos {
    readonly mode: KeplrMode;
    defaultOptions: KeplrIntereactionOptions;
    enable(chainIds: string | string[]): Promise<void>;
    getKey(chainId: string): Promise<Key>;
    experimentalSuggestChain(chain: any): Promise<void>;
    signAmino(chainId: string, signer: string, signDoc: StdSignDoc, signOptions?: KeplrSignOptions): Promise<AminoSignResponse>;
    signDirect(chainId: string, signer: string, signDoc: {
        /** SignDoc bodyBytes */
        bodyBytes?: Uint8Array | null;
        /** SignDoc authInfoBytes */
        authInfoBytes?: Uint8Array | null;
        /** SignDoc chainId */
        chainId?: string | null;
        /** SignDoc accountNumber */
        accountNumber?: Long | null;
    }, signOptions?: KeplrSignOptions): Promise<DirectSignResponse>;
    sendTx(chainId: string, tx: Uint8Array, mode: BroadcastMode): Promise<Uint8Array>;
    signArbitrary(chainId: string, signer: string, data: string | Uint8Array): Promise<StdSignature>;
    verifyArbitrary(chainId: string, signer: string, data: string | Uint8Array, signature: StdSignature): Promise<boolean>;
    signEthereum(chainId: string, signer: string, data: string | Uint8Array, type: EthSignType): Promise<Uint8Array>;
    getOfflineSigner(chainId: string): OfflineAminoSigner & OfflineDirectSigner;
    getOfflineSignerOnlyAmino(chainId: string): OfflineAminoSigner;
    getOfflineSignerAuto(chainId: string): Promise<OfflineAminoSigner | OfflineDirectSigner>;
}
export type ChargerWalletSuiProviderProps = IInpageProviderConfig & {
    timeout?: number;
};
declare class ProviderCosmos extends ProviderCosmosBase implements IProviderCosmos {
    readonly mode: KeplrMode;
    protected _account: Key | null;
    defaultOptions: KeplrIntereactionOptions;
    constructor(props: ChargerWalletSuiProviderProps);
    private _registerEvents;
    private _callBridge;
    private _handleConnected;
    private _handleDisconnected;
    isAccountsChanged(account: KeyHex | undefined): boolean;
    private _handleAccountChange;
    private _network;
    isNetworkChanged(network: string): boolean;
    isConnected(): boolean;
    on<E extends keyof CosmosProviderEventsMap>(event: E, listener: CosmosProviderEventsMap[E]): this;
    emit<E extends keyof CosmosProviderEventsMap>(event: E, ...args: Parameters<CosmosProviderEventsMap[E]>): boolean;
    enable(chainIds: string | string[]): Promise<void>;
    disconnect(): Promise<void>;
    getKey(chainId: string): Promise<Key>;
    ping(): Promise<void>;
    experimentalSuggestChain(chain: any): Promise<void>;
    signAmino(chainId: string, signer: string, signDoc: StdSignDoc, signOptions?: KeplrSignOptions | undefined): Promise<AminoSignResponse>;
    signDirect(chainId: string, signer: string, signDoc: {
        /** SignDoc bodyBytes */
        bodyBytes?: Uint8Array | null | undefined;
        /** SignDoc authInfoBytes */
        authInfoBytes?: Uint8Array | null | undefined;
        /** SignDoc chainId */
        chainId?: string | null | undefined;
        /** SignDoc accountNumber */
        accountNumber?: Long | null | undefined;
    }, signOptions?: KeplrSignOptions | undefined): Promise<DirectSignResponse>;
    sendTx(chainId: string, tx: Uint8Array, mode: BroadcastMode): Promise<Uint8Array>;
    signArbitrary(chainId: string, signer: string, data: string | Uint8Array): Promise<StdSignature>;
    verifyArbitrary(chainId: string, signer: string, data: string | Uint8Array, signature: StdSignature): Promise<boolean>;
    signEthereum(chainId: string, signer: string, data: string | Uint8Array, type: EthSignType): Promise<Uint8Array>;
    getOfflineSigner(chainId: string): OfflineAminoSigner & OfflineDirectSigner;
    getOfflineSignerOnlyAmino(chainId: string): OfflineAminoSigner;
    getOfflineSignerAuto(chainId: string): Promise<OfflineAminoSigner | OfflineDirectSigner>;
}
export { ProviderCosmos };
