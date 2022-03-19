import React, {useEffect} from 'react';
import * as nearApi from 'near-api-js';



function AccountInfo({account}) {
    const { connect } = nearApi;

    const config = {
        networkId: "testnet",
        // keyStore, // optional if not signing transactions
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
        deps: {}
    };

    
    useEffect(() => {
        async function nearConnect() {
            console.log('connect');
            const near = await connect(config);
        }

        nearConnect();
    }, [{account}]);

    return (
    <div>
        <h2>Account: @{account}</h2>
    </div>
  )
}

export default AccountInfo