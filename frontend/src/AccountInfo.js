import React, {useState, useEffect} from 'react';
import * as nearApi from 'near-api-js';
import './AccountInfo.css';
import { Container, Row, Col } from 'react-bootstrap';

const { parseContract } = require('near-contract-parser')


let near;

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

    const getContractInfo = async (accountId) => {
        const { code_base64 } = await near.connection.provider.query({
            account_id: accountId,
            finality: 'final',
            request_type: 'view_code',
          });
        
        
        setContract(parseContract(code_base64))
    }

    async function callMethod(event) {
        event.preventDefault();

        const methodName = event.target.text

        const rawResult = await near.connection.provider.query({
            request_type: "call_function",
            // account_id: "guest-book.testnet",
            // method_name: "getMessages",
            account_id: searchAccount,
            method_name: methodName,
            args_base64: "e30=",
            finality: "optimistic",
        });

        console.log(rawResult);

        const formattedResult = JSON.parse(Buffer.from(rawResult.result).toString());
        console.log(formattedResult);
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
            near = await connect(config);
            const account = await near.account(accountId)
            const balance = await account.getAccountBalance()

            const formattedBalance = {
                available: formatBalance(balance.available),
                staked: formatBalance(balance.staked)
            }

            setFormattedBalance(formattedBalance)

            getContractInfo(accountId);
        }

        if (searchAccount) {
            fetchInfo();
        }
    }, [searchAccount]);


    if (searchAccount) {
        return (
        <div className='account-info'>
            <div className='balance'>
                <h2 className='account'>Account: @{searchAccount}</h2>
        
                <p>Available Balance: <b>{parseFloat(formattedBalance.available).toFixed(5)} NEAR</b></p>
                <p>Staked Balance: <b>{parseFloat(formattedBalance.staked).toFixed(5)} NEAR</b></p>
        
            </div>
            

            <Container fluid className='contract'>
                <h3 className='contract__header'>Contract</h3>
                <Row className='contract__info'>
                    <Col md={3}>
                        <h5 className='contract__info__header'>Methods: {contract?.methodNames?.length}</h5>
                        <ul>
                            {contractMethods()}
                        </ul>
                    </Col>
                    
                    <Col md={3}>
                        <h5 className='contract__info__header'>Possible Interfaces: {contract?.probableInterfaces?.length}</h5>
                        <ul>
                            {contractInterfaces()}
                        </ul>
                    </Col>
                </Row>
            </Container>
        </div>
      )
    } else {
        return (
            <h5 className='no-input-placeholder'>Search for account to get contract methods</h5>
        )
    }
}

export default AccountInfo