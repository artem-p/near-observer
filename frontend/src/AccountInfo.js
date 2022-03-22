import React, {useState, useEffect} from 'react';
import * as nearApi from 'near-api-js';
import './AccountInfo.css';
import { Container, Row, Col } from 'react-bootstrap';

const { parseContract } = require('near-contract-parser')



function AccountInfo({searchAccount}) {
    const { connect } = nearApi;
    const [formattedBalance, setFormattedBalance] = useState({available: 0, staked: 0})
    const [contract, setContract] = useState({})
    
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

    const getContractInfo = async (near, accountId) =>{
        const { code_base64 } = await near.connection.provider.query({
            account_id: accountId,
            finality: 'final',
            request_type: 'view_code',
          });
        
        
        console.log(code_base64)
        console.log(parseContract(code_base64))

        setContract(parseContract(code_base64))
    }

    const contractMethods = () => {
        if (contract && contract.methodNames && contract.methodNames.length > 0) {
            return contract.methodNames.map((method) => {return <li key={method}>{method}</li>})
        }
    }

    const contractInterfaces = () => {
        if (contract && contract.probableInterfaces && contract.probableInterfaces.length > 0) {
            return contract.probableInterfaces.map((contractInterface) => {return <li key={contractInterface}>{contractInterface}</li>})
        }
    }

    useEffect(() => {
        async function fetchInfo() {
            const accountId = searchAccount || 'tenk.testnet';

            console.log('connect');
            const near = await connect(config);
            const account = await near.account(accountId)
            const balance = await account.getAccountBalance()
            const details = await account.getAccountDetails()
            console.log(details)

            const formattedBalance = {
                available: formatBalance(balance.available),
                staked: formatBalance(balance.staked)
            }

            setFormattedBalance(formattedBalance)

            getContractInfo(near, accountId);
            
        }

        fetchInfo();
    }, [searchAccount]);

    return (
    <div>
        <h2>Account: @{searchAccount}</h2>

        <h3>Balance</h3>
        <p>Available Balance: <b>{parseFloat(formattedBalance.available).toFixed(5)} NEAR</b></p>
        <p>Staked Balance: <b>{parseFloat(formattedBalance.staked).toFixed(5)} NEAR</b></p>

        <h3>Contract</h3>
        
        <Container fluid>
            <Row>
                <Col xs={3}>
                    <h5>Methods: {contract?.methodNames?.length}</h5>
                    <ul>
                        {contractMethods()}
                    </ul>
                </Col>
                
                <Col xs={3}>
                    <h5>Possible Interfaces: {contract?.probableInterfaces?.length}</h5>
                    <ul>
                        {contractInterfaces()}
                    </ul>
                </Col>
            </Row>
        </Container>
    </div>
  )
}

export default AccountInfo