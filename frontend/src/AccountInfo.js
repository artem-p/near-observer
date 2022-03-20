import React, {useState, useEffect} from 'react';
import * as nearApi from 'near-api-js';



function AccountInfo({account}) {
    const { connect } = nearApi;
    const [formattedBalance, setFormattedBalance] = useState({available: 0, staked: 0})

    
    const config = {
        networkId: "testnet",
        // keyStore, // optional if not signing transactions
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
        deps: {}
    };

    
    const formatBalance = (internalBalance) => {
        return parseFloat(nearApi.utils.format.formatNearAmount(internalBalance)).toFixed(5)
    }


    useEffect(() => {
        async function fetchInfo() {
            console.log('connect');
            const near = await connect(config);
            const account = await near.account('artyom-p.testnet')
            const balance = await account.getAccountBalance()
            const details = await account.getAccountDetails()
            console.log(balance);
            console.log(details)

            const formattedBalance = {
                available: formatBalance(balance.available),
                staked: formatBalance(balance.staked)
            }

            console.log(formattedBalance);

            // todo too much queries
            // setFormattedBalance(formattedBalance)
        }

        fetchInfo();
    }, [{account}]);

    return (
    <div>
        <h2>Account: @{account}</h2>
        <p>Available Balance: <b>{parseFloat(formattedBalance.available).toFixed(5)} NEAR</b></p>
        <p>Staked Balance: <b>{parseFloat(formattedBalance.staked).toFixed(5)} NEAR</b></p>
    </div>
  )
}

export default AccountInfo