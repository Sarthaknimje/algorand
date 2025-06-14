import algosdk from 'algosdk';
import { algodClient } from './algorand.js';
import { saveToken, getToken, getTokens, updateToken, saveTrade, getTrades, getTokenStats } from './db';

const ALGOD_SERVER = "https://testnet-api.algonode.cloud";
const ALGOD_PORT = 443;
const ALGOD_TOKEN = "";

const algodClient = new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_SERVER, ALGOD_PORT);

const API_URL = 'http://localhost:5000/api';

const RECOVERY_APP_ID = 741193312;
const MARKET_APP_ID = 741193313; // Replace with actual market app ID
const MINT_APP_ID = 741193314;   // Replace with actual mint app ID

// Operations
const SETUP = 'setup';
const TRANSFER = 'transfer';
const INITIATE_RECOVERY = 'initiate_recovery';
const APPROVE_RECOVERY = 'approve_recovery';
const COMPLETE_RECOVERY = 'complete_recovery';
const LOCK = 'lock';
const UNLOCK = 'unlock';
const BUY = 'buy';
const SELL = 'sell';
const MINT = 'mint';
const BURN = 'burn';

// Contract IDs will be stored in MongoDB
let marketContractId = null;
let mintContractId = null;

export const initializeContracts = async () => {
  const tokens = await getTokens();
  if (tokens.length > 0) {
    const token = tokens[0];
    marketContractId = token.marketContractId;
    mintContractId = token.mintContractId;
  }
};

export const getPopularTokens = async () => {
  try {
    const response = await fetch(`${API_URL}/tokens`);
    if (!response.ok) {
      throw new Error('Failed to fetch tokens');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return [];
  }
};

export const getTokenPrice = async (symbol) => {
  try {
    const response = await fetch(`${API_URL}/tokens/${symbol}`);
    if (!response.ok) {
      throw new Error('Failed to fetch token price');
    }
    const token = await response.json();
    return token.price;
  } catch (error) {
    console.error('Error fetching token price:', error);
    return 0;
  }
};

export const getTokenHistory = async (symbol) => {
  try {
    const response = await fetch(`${API_URL}/trades/${symbol}`);
    if (!response.ok) {
      throw new Error('Failed to fetch token history');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching token history:', error);
    return [];
  }
};

export const executeTrade = async (tradeData) => {
  try {
    const response = await fetch(`${API_URL}/trades`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tradeData),
    });
    if (!response.ok) {
      throw new Error('Failed to execute trade');
    }
    return await response.json();
  } catch (error) {
    console.error('Error executing trade:', error);
    throw error;
  }
};

export const createToken = async (name, symbol, totalSupply, url, creator) => {
  try {
    // Create asset transaction
    const params = await algodClient.getTransactionParams().do();
    const txn = algosdk.makeAssetCreateTxnWithSuggestedParams(
      creator.addr,
      algosdk.encodeObj({}),
      totalSupply,
      0,
      false,
      creator.addr,
      creator.addr,
      creator.addr,
      creator.addr,
      params,
      undefined,
      name,
      symbol,
      url
    );

    // Sign and submit transaction
    const signedTxn = txn.signTxn(creator.sk);
    const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
    const result = await algosdk.waitForConfirmation(algodClient, txId, 3);

    const assetId = result['asset-index'];

    // Deploy market contract
    const marketAppId = await deployMarketContract(creator);
    marketContractId = marketAppId;

    // Deploy mint contract
    const mintAppId = await deployMintContract(creator);
    mintContractId = mintAppId;

    // Save token data to MongoDB
    await saveToken({
      assetId,
      name,
      symbol,
      totalSupply,
      url,
      creator: creator.addr,
      marketContractId: marketAppId,
      mintContractId: mintAppId,
      createdAt: new Date()
    });

    return { assetId, marketAppId, mintAppId };
  } catch (error) {
    console.error('Error creating token:', error);
    throw error;
  }
};

export const setupRecoveryContract = async (creatorAccount, assetId) => {
    try {
        const params = await algodClient.getTransactionParams().do();

        const appArgs = [
            new Uint8Array(Buffer.from(SETUP)),
            new Uint8Array(Buffer.from(creatorAccount.addr)),
            new Uint8Array(Buffer.from(assetId.toString()))
        ];

        const txn = algosdk.makeApplicationCallTxn(
            creatorAccount.addr,
            params,
            RECOVERY_APP_ID,
            appArgs
        );

        const signedTxn = txn.signTxn(creatorAccount.sk);
        const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
        await algosdk.waitForConfirmation(algodClient, txId, 4);

        return { success: true, txId };
    } catch (error) {
        console.error('Error setting up recovery contract:', error);
        throw error;
    }
};

export const initiateRecovery = async (recoveryAccount, assetId) => {
    try {
        const params = await algodClient.getTransactionParams().do();

        const appArgs = [
            new Uint8Array(Buffer.from(INITIATE_RECOVERY)),
            new Uint8Array(Buffer.from(assetId.toString()))
        ];

        const txn = algosdk.makeApplicationCallTxn(
            recoveryAccount.addr,
            params,
            RECOVERY_APP_ID,
            appArgs
        );

        const signedTxn = txn.signTxn(recoveryAccount.sk);
        const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
        await algosdk.waitForConfirmation(algodClient, txId, 4);

        return { success: true, txId };
    } catch (error) {
        console.error('Error initiating recovery:', error);
        throw error;
    }
};

export const approveRecovery = async (approverAccount, assetId) => {
    try {
        const params = await algodClient.getTransactionParams().do();

        const appArgs = [
            new Uint8Array(Buffer.from(APPROVE_RECOVERY)),
            new Uint8Array(Buffer.from(assetId.toString()))
        ];

        const txn = algosdk.makeApplicationCallTxn(
            approverAccount.addr,
            params,
            RECOVERY_APP_ID,
            appArgs
        );

        const signedTxn = txn.signTxn(approverAccount.sk);
        const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
        await algosdk.waitForConfirmation(algodClient, txId, 4);

        return { success: true, txId };
    } catch (error) {
        console.error('Error approving recovery:', error);
        throw error;
    }
};

export const completeRecovery = async (recoveryAccount, assetId, newOwnerAddress) => {
    try {
        const params = await algodClient.getTransactionParams().do();

        const appArgs = [
            new Uint8Array(Buffer.from(COMPLETE_RECOVERY)),
            new Uint8Array(Buffer.from(assetId.toString())),
            new Uint8Array(Buffer.from(newOwnerAddress))
        ];

        const txn = algosdk.makeApplicationCallTxn(
            recoveryAccount.addr,
            params,
            RECOVERY_APP_ID,
            appArgs
        );

        const signedTxn = txn.signTxn(recoveryAccount.sk);
        const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
        await algosdk.waitForConfirmation(algodClient, txId, 4);

        return { success: true, txId };
    } catch (error) {
        console.error('Error completing recovery:', error);
        throw error;
    }
};

export const getTokenInfo = async (assetId) => {
    try {
        const assetInfo = await algodClient.getAssetByID(assetId).do();
        return {
            success: true,
            assetInfo
        };
    } catch (error) {
        console.error('Error getting token info:', error);
        throw error;
    }
};

export const getRecoveryStatus = async (assetId) => {
    try {
        const appInfo = await algodClient.getApplicationByID(RECOVERY_APP_ID).do();
        const globalState = appInfo.params['global-state'];
        
        // Find the state for this asset
        const assetState = globalState.find(state => 
            Buffer.from(state.key, 'base64').toString() === assetId.toString()
        );

        return {
            success: true,
            isLocked: assetState?.value?.uint || 0,
            approvals: assetState?.value?.uint || 0
        };
    } catch (error) {
        console.error('Error getting recovery status:', error);
        throw error;
    }
};

export const getMyTokens = async (walletAddress) => {
  try {
    const response = await fetch(`${API_URL}/tokens/my/${walletAddress}`);
    if (!response.ok) {
      throw new Error('Failed to fetch my tokens');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching my tokens:', error);
    return [];
  }
};

export const buyTokens = async (buyer, assetId, amount) => {
  try {
    if (!marketContractId) {
      await initializeContracts();
    }

    const params = await algodClient.getTransactionParams().do();
    
    // Create payment transaction
    const paymentTxn = algosdk.makePaymentTxnWithSuggestedParams(
      buyer.addr,
      algosdk.getApplicationAddress(marketContractId),
      amount * 1000000, // Convert to microAlgos
      undefined,
      undefined,
      params
    );

    // Create asset transfer transaction
    const assetTransferTxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
      algosdk.getApplicationAddress(marketContractId),
      buyer.addr,
      undefined,
      undefined,
      amount,
      undefined,
      assetId,
      params
    );

    // Create application call transaction
    const appCallTxn = algosdk.makeApplicationCallTxnWithSuggestedParams(
      buyer.addr,
      params,
      marketContractId,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      [paymentTxn, assetTransferTxn]
    );

    // Group transactions
    const txnGroup = [paymentTxn, assetTransferTxn, appCallTxn];
    algosdk.assignGroupID(txnGroup);

    // Sign transactions
    const signedTxns = txnGroup.map(txn => txn.signTxn(buyer.sk));

    // Submit transactions
    const { txId } = await algodClient.sendRawTransaction(signedTxns).do();
    await algosdk.waitForConfirmation(algodClient, txId, 3);

    // Save trade to MongoDB
    await saveTrade({
      type: 'buy',
      assetId,
      amount,
      price: 1, // 1 ALGO per token
      buyer: buyer.addr,
      timestamp: new Date()
    });

    return txId;
  } catch (error) {
    console.error('Error buying tokens:', error);
    throw error;
  }
};

export const sellTokens = async (seller, assetId, amount) => {
  try {
    if (!marketContractId) {
      await initializeContracts();
    }

    const params = await algodClient.getTransactionParams().do();
    
    // Create asset transfer transaction
    const assetTransferTxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
      seller.addr,
      algosdk.getApplicationAddress(marketContractId),
      undefined,
      undefined,
      amount,
      undefined,
      assetId,
      params
    );

    // Create payment transaction
    const paymentTxn = algosdk.makePaymentTxnWithSuggestedParams(
      algosdk.getApplicationAddress(marketContractId),
      seller.addr,
      amount * 1000000, // Convert to microAlgos
      undefined,
      undefined,
      params
    );

    // Create application call transaction
    const appCallTxn = algosdk.makeApplicationCallTxnWithSuggestedParams(
      seller.addr,
      params,
      marketContractId,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      [assetTransferTxn, paymentTxn]
    );

    // Group transactions
    const txnGroup = [assetTransferTxn, paymentTxn, appCallTxn];
    algosdk.assignGroupID(txnGroup);

    // Sign transactions
    const signedTxns = txnGroup.map(txn => txn.signTxn(seller.sk));

    // Submit transactions
    const { txId } = await algodClient.sendRawTransaction(signedTxns).do();
    await algosdk.waitForConfirmation(algodClient, txId, 3);

    // Save trade to MongoDB
    await saveTrade({
      type: 'sell',
      assetId,
      amount,
      price: 1, // 1 ALGO per token
      seller: seller.addr,
      timestamp: new Date()
    });

    return txId;
  } catch (error) {
    console.error('Error selling tokens:', error);
    throw error;
  }
};

export const mintTokens = async (minter, assetId, amount) => {
  try {
    if (!mintContractId) {
      await initializeContracts();
    }

    const params = await algodClient.getTransactionParams().do();
    
    // Create asset transfer transaction
    const assetTransferTxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
      algosdk.getApplicationAddress(mintContractId),
      minter.addr,
      undefined,
      undefined,
      amount,
      undefined,
      assetId,
      params
    );

    // Create application call transaction
    const appCallTxn = algosdk.makeApplicationCallTxnWithSuggestedParams(
      minter.addr,
      params,
      mintContractId,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      [assetTransferTxn]
    );

    // Group transactions
    const txnGroup = [assetTransferTxn, appCallTxn];
    algosdk.assignGroupID(txnGroup);

    // Sign transactions
    const signedTxns = txnGroup.map(txn => txn.signTxn(minter.sk));

    // Submit transactions
    const { txId } = await algodClient.sendRawTransaction(signedTxns).do();
    await algosdk.waitForConfirmation(algodClient, txId, 3);

    // Update token supply in MongoDB
    const token = await getToken(assetId);
    await updateToken(assetId, {
      totalSupply: token.totalSupply + amount
    });

    return txId;
  } catch (error) {
    console.error('Error minting tokens:', error);
    throw error;
  }
};

export const burnTokens = async (burner, assetId, amount) => {
  try {
    if (!mintContractId) {
      await initializeContracts();
    }

    const params = await algodClient.getTransactionParams().do();
    
    // Create asset transfer transaction
    const assetTransferTxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
      burner.addr,
      algosdk.getApplicationAddress(mintContractId),
      undefined,
      undefined,
      amount,
      undefined,
      assetId,
      params
    );

    // Create application call transaction
    const appCallTxn = algosdk.makeApplicationCallTxnWithSuggestedParams(
      burner.addr,
      params,
      mintContractId,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      [assetTransferTxn]
    );

    // Group transactions
    const txnGroup = [assetTransferTxn, appCallTxn];
    algosdk.assignGroupID(txnGroup);

    // Sign transactions
    const signedTxns = txnGroup.map(txn => txn.signTxn(burner.sk));

    // Submit transactions
    const { txId } = await algodClient.sendRawTransaction(signedTxns).do();
    await algosdk.waitForConfirmation(algodClient, txId, 3);

    // Update token supply in MongoDB
    const token = await getToken(assetId);
    await updateToken(assetId, {
      totalSupply: token.totalSupply - amount
    });

    return txId;
  } catch (error) {
    console.error('Error burning tokens:', error);
    throw error;
  }
};

export const setupMarketContract = async (creatorAccount, assetId) => {
  try {
    const suggestedParams = await algodClient.getTransactionParams().do();

    // Create the application call transaction
    const txn = algosdk.makeApplicationCallTxn(
      creatorAccount,
      suggestedParams,
      MARKET_APP_ID,
      ['setup'],
      [algosdk.encodeUint64(assetId)],
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    );

    // Sign and submit the transaction
    const signedTxn = txn.signTxn(creatorAccount.sk);
    const { txId } = await algodClient.sendRawTransaction(signedTxn).do();

    // Wait for confirmation
    await algodClient.pendingTransactionInformation(txId).do();

    return {
      success: true,
      txId
    };
  } catch (error) {
    console.error('Error setting up market contract:', error);
    throw error;
  }
};

export const setupMintContract = async (creatorAccount, assetId) => {
  try {
    const suggestedParams = await algodClient.getTransactionParams().do();

    // Create the application call transaction
    const txn = algosdk.makeApplicationCallTxn(
      creatorAccount,
      suggestedParams,
      MINT_APP_ID,
      ['setup'],
      [algosdk.encodeUint64(assetId)],
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    );

    // Sign and submit the transaction
    const signedTxn = txn.signTxn(creatorAccount.sk);
    const { txId } = await algodClient.sendRawTransaction(signedTxn).do();

    // Wait for confirmation
    await algodClient.pendingTransactionInformation(txId).do();

    return {
      success: true,
      txId
    };
  } catch (error) {
    console.error('Error setting up mint contract:', error);
    throw error;
  }
};

export const getTokenDetails = async (assetId) => {
  try {
    const token = await getToken(assetId);
    if (!token) {
      throw new Error('Token not found');
    }

    const stats = await getTokenStats(assetId);
    const trades = await getTrades(assetId);

    return {
      ...token,
      stats,
      recentTrades: trades
    };
  } catch (error) {
    console.error('Error getting token details:', error);
    throw error;
  }
};

export const getAllTokens = async () => {
  try {
    const tokens = await getTokens();
    const tokensWithStats = await Promise.all(
      tokens.map(async (token) => {
        const stats = await getTokenStats(token.assetId);
        return {
          ...token,
          stats
        };
      })
    );
    return tokensWithStats;
  } catch (error) {
    console.error('Error getting all tokens:', error);
    throw error;
  }
}; 