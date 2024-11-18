import { IInjectedProviderNames } from '@chargerwallet/cross-inpage-provider-types';
import { ProviderBase } from '@chargerwallet/cross-inpage-provider-core';
class ProviderCosmosBase extends ProviderBase {
    constructor(props) {
        super(props);
        this.providerName = IInjectedProviderNames.cosmos;
    }
    request(data) {
        return this.bridgeRequest(data);
    }
}
export { ProviderCosmosBase };
