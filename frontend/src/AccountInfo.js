import React, {useState, useEffect} from 'react';
import * as nearApi from 'near-api-js';



function AccountInfo({account}) {
    const { connect } = nearApi;
    const [availableBalance, setAvailableBalance] = useState(0)

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
        async function fetchInfo() {
            console.log('connect');
            const near = await connect(config);
            const account = await near.account('artyom-p.testnet')
            const balance = await account.getAccountBalance()
            const details = await account.getAccountDetails()
            console.log(balance);
            console.log(details)

            const availableBalance = nearApi.utils.format.formatNearAmount(balance.available);
            console.log(availableBalance);
            setAvailableBalance(availableBalance)
        }

        fetchInfo();
    }, [{account}]);

    return (
    <div>
        <h2>Account: @{account}</h2>
        <p>Available Balance: <b>{parseFloat(availableBalance).toFixed(5)} NEAR</b></p>
    </div>
  )
}

export default AccountInfo