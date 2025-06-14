import algosdk from 'algosdk';
import fs from 'fs';
import { algodClient } from '../services/algorand.js';

const creatorMnemonic = "alter green actual grab spoon okay faith repeat smile report easily retire plate enact vacuum spin bachelor rate where service settle nice north above soul";
const creatorAccount = algosdk.mnemonicToSecretKey(creatorMnemonic);

async function deployContract() {
    try {
        // Read the compiled TEAL programs
        const approvalProgram = fs.readFileSync('src/contracts/token_market_approval.teal', 'utf8');
        const clearProgram = fs.readFileSync('src/contracts/token_market_clear.teal', 'utf8');

        // Compile the programs
        const compiledApprovalProgram = await algodClient.compile(approvalProgram).do();
        const compiledClearProgram = await algodClient.compile(clearProgram).do();

        // Decode base64 to Uint8Array
        const approvalBinary = new Uint8Array(Buffer.from(compiledApprovalProgram.result, 'base64'));
        const clearBinary = new Uint8Array(Buffer.from(compiledClearProgram.result, 'base64'));

        // Get suggested parameters
        const suggestedParams = await algodClient.getTransactionParams().do();

        // Define the schema as integers
        const localInts = 0, localBytes = 0, globalInts = 6, globalBytes = 0;

        // Create the application transaction
        const txn = algosdk.makeApplicationCreateTxn(
            creatorAccount.addr,
            suggestedParams,
            algosdk.OnApplicationComplete.NoOpOC,
            approvalBinary,
            clearBinary,
            localInts,
            localBytes,
            globalInts,
            globalBytes
        );

        // Sign the transaction
        const signedTxn = txn.signTxn(creatorAccount.sk);

        // Submit the transaction
        const { txId } = await algodClient.sendRawTransaction(signedTxn).do();

        // Wait for confirmation
        const result = await algodClient.pendingTransactionInformation(txId).do();
        const appId = result['application-index'];

        console.log('Token Market Contract deployed successfully!');
        console.log('Application ID:', appId);
        console.log('Transaction ID:', txId);

        return { appId, txId };
    } catch (error) {
        console.error('Error deploying contract:', error);
        throw error;
    }
}

deployContract().catch(console.error); 