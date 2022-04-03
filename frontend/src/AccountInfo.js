import React, {useState, useEffect} from 'react';
import * as nearApi from 'near-api-js';
import './AccountInfo.css';
import { Container, Row, Col, ListGroup, Placeholder } from 'react-bootstrap';

const { parseContract } = require('near-contract-parser')


let near;

function AccountInfo({searchAccount}) {
    const { connect } = nearApi;
    const [formattedBalance, setFormattedBalance] = useState({available: 0, staked: 0})
    const [contract, setContract] = useState({})
    const [noAccountFound, setNoAccountFound] = useState(false);
    const [noContractFound, setNoContractFound] = useState(false);

    
    const testnet_config = {
        networkId: "testnet",
        // keyStore, // optional if not signing transactions
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
        deps: {}
    };

    const mainnet_config = {
        networkId: "mainnet",
        // keyStore,
        nodeUrl: "https://rpc.mainnet.near.org",
        walletUrl: "https://wallet.mainnet.near.org",
        helperUrl: "https://helper.mainnet.near.org",
        explorerUrl: "https://explorer.mainnet.near.org",
        deps: {}
    };

    
    const formatBalance = (internalBalance) => {
        return parseFloat(nearApi.utils.format.formatNearAmount(internalBalance)).toFixed(5)
    }

    const getContractInfo = async (accountId) => {
        try {
            const { code_base64 } = await near.connection.provider.query({
                account_id: accountId,
                finality: 'final',
                request_type: 'view_code',
              });

              setContract(parseContract(code_base64))
        } catch(error) {
            setNoContractFound(true);
        }
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
        if (contract && contract.methodNames) {
            if (contract.methodNames.length > 0) {
                return contract.methodNames.map((method) => {return <ListGroup.Item variant='secondary' key={method}>{method}</ListGroup.Item>})
                // return contract.methodNames.map((method) => {return <ListGroup.Item variant='secondary' key={method}><a href='#' onClick={callMethod}>{method}</a></ListGroup.Item>})
            } else {
                return ''
            }
        } else {
            return [...Array(8)].map((val, index) => {
                    return  <Placeholder as="p" key={index} animation="glow">
                                <Placeholder xs={12} size='lg' />
                            </Placeholder>
                }
            ) 
        }
    }

    const contractInterfaces = () => {
        if (contract && contract.probableInterfaces) {
            if (contract.probableInterfaces.length > 0) {
                return contract.probableInterfaces.map((contractInterface) => {return <ListGroup.Item variant='secondary' key={contractInterface}>{contractInterface}</ListGroup.Item>})
            } else {
                return ''
            }
        } else {
            return [...Array(5)].map((val, index) => {
                return  <Placeholder as="p" key={index} animation="glow">
                            <Placeholder xs={12} size='lg' />
                        </Placeholder>
                }
            )
        }
    }

    useEffect(() => {
        async function fetchInfo() {
            setNoAccountFound(false);
            setNoContractFound(false);
            setContract({});

            const accountId = searchAccount;
            
            let config;

            if (accountId.slice(-8) == '.testnet') {
                config = testnet_config;
            } else if (accountId.slice(-5) == '.near') {
                config = mainnet_config
            } else {
                config = testnet_config;
            }


            let account;

            near = await connect(config);

            try {
                account = await near.account(accountId)

                const balance = await account.getAccountBalance()

                const formattedBalance = {
                    available: formatBalance(balance.available),
                    staked: formatBalance(balance.staked)
                }

                setFormattedBalance(formattedBalance)

                getContractInfo(accountId);
            } catch (error) {
                console.log('no account found')
                setNoAccountFound(true);
                return;
            }
        }

        if (searchAccount) {
            fetchInfo();
        }
    }, [searchAccount]);


    if (searchAccount) {
        if (!noAccountFound) {
            return (
                <div className='account-info'>
                    <div className='balance'>
                        <h2 className='account'>Account: @{searchAccount}</h2>

                        <div className='balances'>
                            <div className='balance__available'>Available Balance: <b>{parseFloat(formattedBalance.available).toFixed(5)} NEAR</b></div>
                            <div className='balance__staked'>Staked Balance: <b>{parseFloat(formattedBalance.staked).toFixed(5)} NEAR</b></div>
                        </div>
                    </div>
                    
        
                    <Container fluid className='contract'>
                        <h3 className='contract__header'>Contract</h3>
                        <ContractInfo />
                    </Container>
                </div>
            )    
        } else {
            return <h5 className='no-account-placeholder'>Account does not exist.</h5>
        }
        
      
    } else {
        return (
            <h5 className='no-account-placeholder'>Search for account to get contract methods.</h5>
        )
    }


    function ContractInfo() {
        if (!noContractFound) {
            return <Row className='contract__info'>
                        <Col md={3}>
                            <h5 className='contract__info__header'>Methods: {contract?.methodNames?.length}</h5>
                            <ListGroup>
                                {contractMethods()}
                            </ListGroup>
                        </Col>
                        
                        <Col md={3}>
                            <h5 className='contract__info__header'>Possible Interfaces: {contract?.probableInterfaces?.length}</h5>
                            <ListGroup>
                                {contractInterfaces()}
                            </ListGroup>
                        </Col>
                    </Row>
        } else {
            return <h5 className='contract__info__header'>No contract found</h5>
        }
    }
}
 

export default AccountInfo