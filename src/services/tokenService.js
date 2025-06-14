import algosdk from 'algosdk';

const ALGOD_SERVER = 'https://testnet-api.algonode.cloud';
const ALGOD_PORT = 443;
const ALGOD_TOKEN = '';

const algodClient = new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_SERVER, ALGOD_PORT);

export const createToken = async (params) => {
  const {
    creatorAddress,
    tokenName,
    tokenSymbol,
    totalSupply,
    decimals = 6,
    url = '',
    metadataHash = '',
    managerAddress = creatorAddress,
    reserveAddress = creatorAddress,
    freezeAddress = creatorAddress,
    clawbackAddress = creatorAddress
  } = params;

  try {
    // Get suggested parameters
    const suggestedParams = await algodClient.getTransactionParams().do();

    // Create the asset creation transaction
    const txn = algosdk.makeAssetCreateTxnWithSuggestedParams(
      creatorAddress,
      algosdk.encodeObj(metadataHash),
      totalSupply,
      decimals,
      false, // defaultFrozen
      managerAddress,
      reserveAddress,
      freezeAddress,
      clawbackAddress,
      tokenName,
      tokenSymbol,
      url,
      suggestedParams
    );

    return txn;
  } catch (error) {
    console.error('Error creating token:', error);
    throw new Error(`Failed to create token: ${error.message}`);
  }
};

export const signAndSendTransaction = async (txn, peraWallet) => {
  try {
    if (!peraWallet) {
      throw new Error('Pera Wallet is not connected');
    }

    // Convert transaction to Uint8Array
    const txnBlob = algosdk.encodeUnsignedTransaction(txn);

    // Sign the transaction using Pera Wallet
    const signedTxn = await peraWallet.signTransaction([txnBlob]);
    if (!signedTxn || signedTxn.length === 0) {
      throw new Error('Failed to sign transaction');
    }

    // Send the transaction
    const { txId } = await algodClient.sendRawTransaction(signedTxn[0]).do();

    // Wait for confirmation
    const confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4);

    return confirmedTxn;
  } catch (error) {
    console.error('Error signing and sending transaction:', error);
    throw new Error(`Failed to sign and send transaction: ${error.message}`);
  }
}; 