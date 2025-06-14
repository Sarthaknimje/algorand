import algosdk from 'algosdk';

// Configure the Algorand client
const algodServer = 'https://testnet-api.algonode.cloud';
const algodPort = '';
const algodToken = '';

export const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort); 