// MobXStore.js
import { makeAutoObservable, action } from 'mobx';
import axios from 'axios';
import apiEndpoints from './apiEndpoints';
import { ethers, parseUnits } from 'ethers';
import { Alert } from 'react-native';
import Buffer  from 'buffer';
import TransactionHistoryScreen from './TransactionHistoryScreen';
import { fetchTransactionsFromReceipt } from './TransactionUtils';
import { getRandomBytes } from 'react-native-get-random-values';
import secureRandom from 'secure-random';

// import Bitcoin from 'react-native-expo-bitcoinjs-lib'
// import { testnet } from 'react-native-bitcoinjs-lib/src/networks';


// import { Realm } from "realm";

// const app = new Realm.App({ id: 'application-0-pvjbu' });


class WalletStore {
  RpcProvider = '';
  signer;
  provider;
  WalletPrivateKey = '';
  livePriceBitcoin = 0;
  WalletAddress = '';
  RecieversAddress = '';
  livePriceUsdt = 0;
  transactionHistory = [];
  apiEndpoint= apiEndpoints.bitcoinPrice;  // network


  // Define the Transaction schema
  // TransactionSchema = {
  //   name: 'Transaction',
  //   properties: {
  //     blockHash: 'string',
  //     blockNumber: 'int',
  //     from: 'string',
  //     to: 'string',
  //     gasUsed: 'int',
  //     // Add more fields as needed
  //   },
  // };

  // Function to connect to MongoDB Realm
  // connectToRealm = async() => {
  //   const user = await Realm.logInAnonymous();
  //   return new Realm({
  //     schema: [TransactionSchema],
  //     sync: {
  //       user: user,
  //       partitionValue: 'transactions',
  //     },
  //   });
  // }
  


  setApiEndpoint(endpoint) {
    this.apiEndpoint = endpoint;
  }
  fetchLivePrice() {
    // const polygonValue = 0.695768;

    axios.get(apiEndpoints.bitcoinPrice).then((response) => {
      this.setLivePriceBitcoin(response.data.bitcoin.usd);
      console.log(this.livePriceBitcoin)
      return this.livePriceBitcoin
    }) .catch((error) => {
        console.error('Error fetching live price:', error);
      });

    axios.get(apiEndpoints.usdtPrice).then((response) => {
      this.setLivePriceUsdt(response.data.data.rateUsd);
      console.log(this.livePriceUsdt)
      return this.livePriceUsdt
    }) .catch((error) => {
        console.error('Error fetching live price:', error);
      });
  }
  constructor() {
    makeAutoObservable(this, {
      setWalletAddress: action,
      setLivePrice: action,
      addToTransactionHistory: action,
    });
  }
// correct
  setWalletAddressBitcoin(privateKey, onSuccess, onError) {
    try {
      const keyPair = Bitcoin.ECPair.fromWIF(privateKey)
      // console.log(keyPair)
      console.log(Bitcoin.networks.testnet)
      const bitcoinAddress = keyPair.getAddress()
      console.log("backend",bitcoinAddress)
      // const bitcoinAddress = payment.address(testnet);
      this.WalletPrivateKey = privateKey;
      this.WalletAddress = bitcoinAddress;
      this.RpcProvider = "";
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(this.WalletAddress,this.RpcProvider);
      }
    } catch (error) {
      console.error('Error importing wallet:', error.message);
      if (onError && typeof onError === 'function') {
        onError(error.message);
      }
    }
  }
  setWalletAddressPolygon(privateKey, onSuccess, onError) {
    try {
      // provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/974a213860b54adf82f5cffff7fac289');
      // signer = provider.getSigner()
      provider = ethers.getDefaultProvider('sepolia');
      const wallet = new ethers.Wallet(privateKey, provider);
      this.RpcProvider = provider;
      this.WalletAddress = wallet.address;
      this.WalletPrivateKey = privateKey;
      // this.signers = signer;
      // console.log(this.RpcProvider,this.WalletPrivateKey,this.WalletAddress)
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(this.WalletAddress, this.RpcProvider);
      }
    } catch (error) {
      console.error('Error importing wallet:', error.message);
      if (onError && typeof onError === 'function') {
        onError(error.message);
      }
    }
  }
  setLivePriceBitcoin(price) {
    this.livePriceBitcoin = price;
  }
  setLivePriceUsdt(price) {
    this.livePriceUsdt = price;
  }
  addToTransactionHistory(transaction) {
    this.transactionHistory.push(transaction);
  }
  sendTransactionBitcoin = async (receiverAddress, amount, selectedNetwork) =>{
      // try{
      //   const keyPair = Bitcoin.ECPair.fromWIF(this.WalletPrivateKey, Bitcoin.networks.testnet);
      //   console.log(keyPair)
      //   console.log("backend",this.WalletPrivateKey)
      //   console.log("backend",this.WalletAddress)
      //   console.log("backend",selectedNetwork)
      //   console.log(receiverAddress,amount)
        
      //   // Fetch UTXOs associated with the sender's address
      //   const utxos = await axios.get(`https://blockstream.info/testnet/api/address/${this.WalletAddress}/utxo`);
      //   console.log(utxos)
        
      //   const privateKey = this.WalletPrivateKey
      //   const txb = new Bitcoin.TransactionBuilder(Bitcoin.networks.testnet);

      //    // Iterate over UTXOs and add them as inputs to the transaction
      //   utxos.data.forEach((utxo) => {
      //     txb.addInput(utxo.txid, utxo.vout);
      //   });

      //   // Add the output to the transaction
      //   txb.addOutput(receiverAddress, amount);

      //   // Sign the transaction with the private key for each input
      //   utxos.data.forEach((utxo, index) => {
      //     txb.sign(index, privateKey);
      //   });

      //      // Build and broadcast the transaction
      //   const txHex = txb.build().toHex();
      //   await axios.post('https://blockstream.info/testnet/api/tx', { tx: txHex });
        
      //   // Add the transaction to the transaction history
      //   this.addToTransactionHistory({
      //     id: 'yourTxId', // Replace with actual transaction ID
      //     status: 'Pending',
      //     amount: `${amount} BTC`,
      //     fee: '0.001 BTC', // Placeholder for fee, replace with actual fee calculation
      //   });

      //   console.log('Bitcoin Transaction sent successfully!');
      // }catch(error){
      //   console.log(error)
      // }


// Set up test wallets
    const walletA = {
      addr: 'mvMNtSvSrgSLioBUko38jQpnuyHZ6kokpa',
      privateKey: 'cPoYirxiXpmTRMkAzCEciDEvcmn6waBC884NChrd55VCMNNiAR7u',
    };

    const walletB = {
      addr: 'mzFP1gCnQgrofYWuBaLZUNCpZ14HVapBk5',
      privateKey: 'cUPF2hLtLXoHSt4avqPnaW3WYksHKRSKPYzGW3w4mgSLwUgf6o8S',
    };

    function sendBTC(fromAddress, toAddress, privateKey, amount) {
      const network = 'BTCTEST';

      axios
        .get(`https://sochain.com/api/v2/get_tx_unspent/BTCTEST/mvMNtSvSrgSLioBUko38jQpnuyHZ6kokpa`)
        .then((firstResponse) => {
          const inputs = [];
          const utxos = firstResponse.data.data.txs;

          let totalAmountAvailable = 0;
          let inputCount = 0;

          for (const element of utxos) {
            const utxo = {
              satoshis: Math.floor(Number(element.value) * 100000000),
              script: element.script_hex,
              address: firstResponse.data.data.address,
              txid: element.txid,
              outputIndex: element.output_no,
            };

            totalAmountAvailable += utxo.satoshis;
            inputCount += 1;

            inputs.push(utxo);
          }

          const transaction = new bitcore.Transaction();
          const satoshiToSend = amount * 100000000;
          const outputCount = 2;

          const transactionSize = inputCount * 180 + outputCount * 34 + 10 - inputCount;
          const fee = transactionSize * 33;

          if (totalAmountAvailable - satoshiToSend - fee < 0) {
            throw new Error('Insufficient funds');
          }

          transaction.from(inputs);
          transaction.to(toAddress, satoshiToSend);
          transaction.change(fromAddress);
          transaction.fee(Math.round(fee));
          transaction.sign(privateKey);

          const serializedTransaction = transaction.serialize();

          axios({
            method: 'POST',
            url: `https://sochain.com/api/v2/send_tx/${network}`,
            data: { tx_hex: serializedTransaction },
          }).then((result) => {
            console.log(result.data.data);
          });
        })
        .catch((error) => {
          console.error('Error:', error.message);
        });
    }

    // Example usage
    sendBTC(walletA.addr, walletB.addr, walletA.privateKey, 0.001);

  }

  // sendTransactionBitcoin = async () => {
  //   try {
  //     // Generate a random key pair
  //     const randomKeyPair = Bitcoin.ECPair.makeRandom({ network: Bitcoin.networks.testnet });
  //     console.log(ran)
  //     const randomPrivateKey = randomKeyPair.toWIF();
  //     const randomPublicKey = randomKeyPair.publicKey.toString('hex');
  
  //     console.log("Random Private Key:", randomPrivateKey);
  //     console.log("Random Public Key:", randomPublicKey);
  
  //     // Fetch UTXOs associated with the sender's address
  //     const utxos = await axios.get(`https://blockstream.info/testnet/api/address/${randomKeyPair.getAddress()}/utxo`);
  //     console.log("UTXOs:", utxos.data);
  
  //     const txb = new Bitcoin.TransactionBuilder(Bitcoin.networks.testnet);
  
  //     // Iterate over UTXOs and add them as inputs to the transaction
  //     utxos.data.forEach((utxo) => {
  //       txb.addInput(utxo.txid, utxo.vout);
  //     });
  
  //     // Add the output to the transaction
  //     txb.addOutput(receiverAddress, amount);
  
  //     // Sign the transaction with the private key for each input
  //     utxos.data.forEach((utxo, index) => {
  //       txb.sign(index, randomKeyPair);
  //     });
  
  //     // Build and broadcast the transaction
  //     const txHex = txb.build().toHex();
  //     await axios.post('https://blockstream.info/testnet/api/tx', { tx: txHex });
  
  //     // Add the transaction to the transaction history
  //     this.addToTransactionHistory({
  //       id: 'yourTxId', // Replace with actual transaction ID
  //       status: 'Pending',
  //       amount: `${amount} BTC`,
  //       fee: '0.001 BTC', // Placeholder for fee, replace with actual fee calculation
  //     });
  
  //     console.log('Bitcoin Transaction sent successfully!');
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
// ...


// sendTransactionBitcoin = async () => {
//   try {
//     // Generate a random key pair
//     const randomBytes = secureRandom(32, { type: 'Buffer' });
//     // const randomKeyPair = Bitcoin.ECPair.fromPrivateKey(Buffer.from(randomBytes), { network: Bitcoin.networks.testnet });
//     const randomKeyPair = Bitcoin.ECPair.randomBytes(randomBytes);
//     const randomPrivateKey = randomKeyPair.toWIF();
//     const randomPublicKey = randomKeyPair.publicKey.toString('hex');

//     console.log("Random Private Key:", randomPrivateKey);
//     console.log("Random Public Key:", randomPublicKey);

//     // Fetch UTXOs associated with the sender's address
//     const utxos = await axios.get(`https://blockstream.info/testnet/api/address/${randomKeyPair.getAddress()}/utxo`);
//     console.log("UTXOs:", utxos.data);

//     const txb = new Bitcoin.TransactionBuilder(Bitcoin.networks.testnet);

//     // Iterate over UTXOs and add them as inputs to the transaction
//     utxos.data.forEach((utxo) => {
//       txb.addInput(utxo.txid, utxo.vout);
//     });

//     // Add the output to the transaction
//     txb.addOutput(receiverAddress, amount);

//     // Sign the transaction with the private key for each input
//     utxos.data.forEach((utxo, index) => {
//       txb.sign(index, randomKeyPair);
//     });

//     // Build and broadcast the transaction
//     const txHex = txb.build().toHex();
//     await axios.post('https://blockstream.info/testnet/api/tx', { tx: txHex });

//     // Add the transaction to the transaction history
//     this.addToTransactionHistory({
//       id: 'yourTxId', // Replace with the actual transaction ID
//       status: 'Pending',
//       amount: `${amount} BTC`,
//       fee: '0.001 BTC', // Placeholder for the fee, replace with actual fee calculation
//     });

//     console.log('Bitcoin Transaction sent successfully!');
//   } catch (error) {
//     console.log(error);
//   }
// };


  sendTransactionPolygon = async (toAddress, amount) => {
    try {
      // const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/974a213860b54adf82f5cffff7fac289")
      const provider = new ethers.JsonRpcProvider("https://polygon-mumbai.infura.io/v3/974a213860b54adf82f5cffff7fac289")
      // signer = await provider.getSigner()
      const wallet = new ethers.Wallet(this.WalletPrivateKey, provider);
      console.log(provider)
        const amountStr = String(amount)
        // Sign the transaction
      const signedTransaction = await wallet.sendTransaction({
        to: toAddress,
        value: parseUnits(amountStr, 'ether')
      });
      // Wait for the transaction to be mined
      const receipt = await signedTransaction.wait();
      console.log(receipt)
      // TransactionHistoryScreen.fetchTransactionsFromReceipt(receipt.blockHash,receipt.blockNumber.receipt.from,receipt.to,receipt.gasUsed)
      
      // TransactionHistoryScreen(
      //   receipt.blockHash,
      //   receipt.blockNumber,
      //   receipt.from,
      //   receipt.to,
      //   receipt.gasUsed
      // );

      // console.log(parsedTransaction)

      // Connect to MongoDB Realm
    const realm = await connectToRealm();

    // Store transaction data in MongoDB Realm
      // realm.write(() => {
      //   realm.create('Transaction', {
      //     blockHash: receipt.blockHash,
      //     blockNumber: receipt.blockNumber,
      //     from: receipt.from,
      //     to: receipt.to,
      //     gasUsed: receipt.gasUsed,
      //     // Add more fields as needed
      //   });
      // });

      return receipt.to;
    } catch (error) {
      console.error('Error sending transaction:', error.message);
    }
  };
  verifyAddress(privateKey, network) {
    try {
      if (network === 'Bitcoin') {
        // const payment = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
        // const bitcoinAddress = payment.address;

        // const keyPair = bitcoin.ECPair.fromWIF(privateKey);
        // const publicKey = keyPair.publicKey;

        // const payment = bitcoin.payments.p2pkh({ pubkey: publicKey });
        // const bitcoinAddress = payment.address;
        // validateBitcoinAddress(bitcoinAddress);

        return [true,"Bitcoin"];
      } else if (network === 'Polygon') {
        // const wallet = new ethers.Wallet(privateKey);
        // console.log(wallet.address)
        // validatePolygonAddress(wallet.address);
        return [true,"Polygon"];
      } else {
        console.error('Invalid network:', network);
        return false;
      }
    } catch (error) {
      console.error('Error verifying address:', error.message);
      return false;
    }
    function validateBitcoinAddress(address) {
      try {
        const decoded = bitcoin.address.fromBase58Check(address);
        return decoded.version === bitcoin.networks.bitcoin.pubKeyHash ||
          decoded.version === bitcoin.networks.bitcoin.scriptHash;
        // bitcoin.address.toOutputScript(address);
        return true;
      } catch (error) {
        console.error('Invalid Bitcoin address:', error.message);
        return false;
      }
    }
    function validatePolygonAddress(address) {
      try {
        const validAddress = ethers.utils.getAddress(address); // This will throw if the address is invalid
        console.log(validAddress)
        return true;
      } catch (error) {
        console.error('Invalid Polygon address:', error.message);
        return false;
      }
    }
  }
}

const mobXStore = new WalletStore();
export default mobXStore;