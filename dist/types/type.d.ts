export interface Key {
    readonly name: string;
    readonly algo: string;
    readonly pubKey: Uint8Array;
    readonly address: Uint8Array;
    readonly bech32Address: string;
    readonly isNanoLedger: boolean;
}
export type KeyHex = Key & {
    pubKey: string;
    address: string;
};
export type KeplrMode = 'extension' | 'mobile-web' | 'walletconnect';
export interface KeplrIntereactionOptions {
    readonly sign?: KeplrSignOptions;
}
export interface KeplrSignOptions {
    readonly preferNoSetFee?: boolean;
    readonly preferNoSetMemo?: boolean;
    readonly disableBalanceCheck?: boolean;
}
export interface BIP44 {
    readonly coinType: number;
}
export interface Bech32Config {
    readonly bech32PrefixAccAddr: string;
    readonly bech32PrefixAccPub: string;
    readonly bech32PrefixValAddr: string;
    readonly bech32PrefixValPub: string;
    readonly bech32PrefixConsAddr: string;
    readonly bech32PrefixConsPub: string;
}
export declare enum EthSignType {
    MESSAGE = "message",
    TRANSACTION = "transaction",
    EIP712 = "eip-712"
}
