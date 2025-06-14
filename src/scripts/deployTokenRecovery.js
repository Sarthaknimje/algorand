import algosdk from 'algosdk';
import { algodClient } from '../services/algorand.js';
import fs from 'fs';

const creatorMnemonic = 'alter green actual grab spoon okay faith repeat smile report easily retire plate enact vacuum spin bachelor rate where service settle nice north above soul';
const creatorAccount = algosdk.mnemonicToSecretKey(creatorMnemonic);

async function deployContract() {
    try {
        // Read the compiled TEAL programs
        const approvalProgram = fs.readFileSync('token_recovery_approval.teal', 'utf8');
        const clearProgram = fs.readFileSync('token_recovery_clear.teal', 'utf8');

        // Compile the programs
        const compiledApprovalProgram = await algodClient.compile(approvalProgram).do();
        const compiledClearProgram = await algodClient.compile(clearProgram).do();

        // Get suggested parameters
        const params = await algodClient.getTransactionParams().do();

        // Define schema as integers
        const localInts = 0;
        const localBytes = 0;
        const globalInts = 6;
        const globalBytes = 0;

        console.log('Local schema:', localInts, localBytes);
        console.log('Global schema:', globalInts, globalBytes);

        // Create the application (use integers for schema)
        const txn = algosdk.makeApplicationCreateTxn(
            creatorAccount.addr,
            params,
            algosdk.OnApplicationComplete.NoOpOC,
            new Uint8Array(Buffer.from(compiledApprovalProgram.result, 'base64')),
            new Uint8Array(Buffer.from(compiledClearProgram.result, 'base64')),
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
        const confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4);

        // Get the application ID
        const appId = confirmedTxn['application-index'];

        console.log('Token Recovery Contract deployed successfully!');
        console.log('Application ID:', appId);
        console.log('Transaction ID:', txId);

        return {
            success: true,
            appId,
            txId
        };
    } catch (error) {
        console.error('Error deploying contract:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

deployContract().catch(console.error); 