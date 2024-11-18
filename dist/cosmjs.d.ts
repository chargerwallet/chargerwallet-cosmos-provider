import { ProviderCosmos } from './ChargerwalletCosmosProvider';
import { AccountData, AminoSignResponse, DirectSignResponse, OfflineAminoSigner, OfflineDirectSigner, SignDoc, StdSignDoc } from './types';
export declare class CosmJSOfflineSignerOnlyAmino implements OfflineAminoSigner {
    protected readonly chainId: string;
    protected readonly service: ProviderCosmos;
    constructor(chainId: string, service: ProviderCosmos);
    getAccounts(): Promise<AccountData[]>;
    signAmino(signerAddress: string, signDoc: StdSignDoc): Promise<AminoSignResponse>;
    sign(signerAddress: string, signDoc: StdSignDoc): Promise<AminoSignResponse>;
}
export declare class CosmJSOfflineSigner extends CosmJSOfflineSignerOnlyAmino implements OfflineAminoSigner, OfflineDirectSigner {
    protected readonly chainId: string;
    protected readonly service: ProviderCosmos;
    constructor(chainId: string, service: ProviderCosmos);
    signDirect(signerAddress: string, signDoc: SignDoc): Promise<DirectSignResponse>;
}
