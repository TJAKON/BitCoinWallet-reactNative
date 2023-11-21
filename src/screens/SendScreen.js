import React, { useState } from 'react';
import { ethers } from 'ethers';
import { View, Text, TextInput, Button, StyleSheet, Linking, Alert } from 'react-native';
import { Appbar, Card, Title, Paragraph, TextInput as PaperTextInput } from 'react-native-paper';
import mobXStore from './MobXStore';
import apiEndpoints from './apiEndpoints';

import { Picker } from '@react-native-picker/picker';

import { Buffer } from 'buffer';
global.Buffer = Buffer;


const SendScreen = () => {
  const [receiverAddress, setReceiverAddress] = useState('');
  const [amount, setAmount] = useState('');
  // const [selectedNetwork, setSelectedNetwork] = useState('')
  const [selectedNetwork, setSelectedNetwork] = useState('Bitcoin'); // Default value

  const handleNetworkChange = (value) => {
    setSelectedNetwork(value);
    // SendScreen.setSelectedNetwork(value)
    if (value === 'Bitcoin') {
      mobXStore.setApiEndpoint(apiEndpoints.bitcoinPrice);
    } 
    else if (value === 'Polygon') {
      mobXStore.setApiEndpoint(apiEndpoints.polygonPrice);
    }
  };

  // const network = "Polygon"

  const handleSendTransaction = async () => {
  const amountNumber = parseFloat(amount);
  if (isNaN(amountNumber) || amountNumber <= 0) {
    Alert.alert('Invalid Amount', 'Please enter a valid amount.');
    return;
  }

  if (selectedNetwork === 'Bitcoin') {
    try {
      // Assuming sendTransaction method for Bitcoin is present in mobXStore
      // await mobXStore.sendTransactionBitcoin(receiverAddress, amountNumber);
      await mobXStore.sendTransactionBitcoin(receiverAddress,amountNumber,selectedNetwork);
      // await mobXStore.sendTransactionBitcoin();
      // Alert.alert('Transaction sent', 'Bitcoin transaction was successful!');
      // Alert.alert('Transaction sent', 'bitcoinJs is not supported!');
    } catch (error) {
      console.error('Error sending Bitcoin transaction:', error.message);
      Alert.alert('Transaction failed', error.message);
    }
  } else if (selectedNetwork === 'Polygon') {
    try {
      // Assuming sendTransactionPolygon method for Polygon is present in mobXStore
      await mobXStore.sendTransactionPolygon(receiverAddress, amountNumber,selectedNetwork, () => {
        alert('Transaction sent successfully:', receipt);
      }, (error) => {
        console.error('Error sending transaction:', error);
      });
    } catch (error) {
      console.error('Error sending Polygon transaction:', error.message);
      Alert.alert('Transaction failed', error.message);
    }
  }
  
  };
  

  const handleOpenLink = () => {
    const blockExplorerLink = `https://blockexplorer.com/tx/${Math.random()}`;
    // alert(`Transaction sent! View on Block Explorer: ${blockExplorerLink}`);
    Linking.openURL(blockExplorerLink);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Send Digital Currencies</Text>

      <Card style={styles.card}>
        <Card.Content style={styles.pickerContainer}>
        <Text style={styles.label}>Select Network: </Text>
        <Picker
          selectedValue={selectedNetwork}
          onValueChange={(itemValue) => handleNetworkChange(itemValue)}
          style={{ height: 50, width: 150 }}
        >
          <Picker.Item label="Bitcoin" value="Bitcoin" />
          <Picker.Item label="Polygon" value="Polygon" />
        </Picker>
        </Card.Content>
      </Card>

      {/* Receiver address input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Receiver Address:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setReceiverAddress(text)}
          value={receiverAddress}
          placeholder="Enter receiver address"
        />
      </View>

      {/* Amount input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Amount (BTC/USDT):</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setAmount(text)}
          value={amount}
          placeholder="Enter amount"
          keyboardType="numeric"
        />
      </View>

      {/* Send button */}
      <Button title="Send" onPress={handleSendTransaction} />

      {/* Block Explorer link */}
      <Text 
        style={styles.blockExplorerLink}
        onPress={handleOpenLink}>
        Transaction Link on Block Explorer
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3498db',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    color: '#2c3e50',
  },
  input: {
    height: 40,
    borderColor: '#3498db',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: 'white',
  },
  blockExplorerLink: {
    marginTop: 20,
    color: '#3498db',
    textDecorationLine: 'underline',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 10,
    marginHorizontal: 30,
  },
  card: {
    margin: 16,
    backgroundColor: '#ecf0f1',
  },
  cardTitle: {
    color: '#2c3e50',
  },
  cardText: {
    color: '#7f8c8d',
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    color: 'black',
  },
});

export default SendScreen;


// metamask connection
// import React, { useEffect, useState } from 'react';
// import { View, Text, Button, StyleSheet, Linking } from 'react-native';
// import { init } from '@metamask/dapp';

// const App = () => {
//   const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

//   useEffect(() => {
//     async function initializeMetaMask() {
//       try {
//         // Initialize MetaMask
//         await init();

//         // Check if MetaMask is installed
//         const isInstalled = await ethereum.request({ method: 'eth_accounts' });

//         setIsMetaMaskInstalled(Boolean(isInstalled && isInstalled.length > 0));
//       } catch (error) {
//         console.error('Error initializing MetaMask:', error.message);
//       }
//     }

//     initializeMetaMask();
//   }, []);

//   const handleOpenMetaMask = () => {
//     Linking.openURL('metamask:');
//   };

//   const handleSendTransaction = async () => {
//     try {
//       // Request user accounts
//       const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

//       // Your transaction details
//       const transaction = {
//         from: accounts[0],
//         to: 'recipient_address',
//         value: '0x1', // Wei amount (hex)
//       };

//       // Sign and send the transaction
//       const txHash = await ethereum.request({ method: 'eth_sendTransaction', params: [transaction] });

//       console.log('Transaction sent. Transaction hash:', txHash);
//     } catch (error) {
//       console.error('Error sending transaction:', error.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>React Native MetaMask Integration</Text>

//       {isMetaMaskInstalled ? (
//         <>
//           <Text style={styles.infoText}>MetaMask is installed!</Text>
//           <Button title="Open MetaMask" onPress={handleOpenMetaMask} />
//           <Button title="Send Transaction" onPress={handleSendTransaction} />
//         </>
//       ) : (
//         <Text style={styles.infoText}>Please install MetaMask to use this feature.</Text>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   header: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   infoText: {
//     marginBottom: 20,
//   },
// });

// export default App;


// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
// import bitcoin from 'bitcoinjs-lib';

// const WalletImportScreen = () => {
//   const [privateKey, setPrivateKey] = useState('');
//   const [walletAddress, setWalletAddress] = useState('');

//   const generateRandomWallet = () => {
//     const keyPair = bitcoin.ECPair.makeRandom();
//     const address = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey }).address;
//     const privateKey = keyPair.toWIF();

//     setPrivateKey(privateKey);
//     setWalletAddress(address);
//   };

//   const importWallet = () => {
//     // Your wallet import logic here
//     // For simplicity, just display the imported wallet details
//     alert(`Wallet imported successfully!\nAddress: ${walletAddress}\nPrivate Key: ${privateKey}`);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Crypto Wallet Import</Text>

//       <View style={styles.buttonContainer}>
//         <Button title="Generate Random Wallet" onPress={generateRandomWallet} />
//       </View>

//       <View style={styles.inputContainer}>
//         <Text>Private Key: </Text>
//         <TextInput
//           style={styles.input}
//           onChangeText={(text) => setPrivateKey(text)}
//           value={privateKey}
//           placeholder="Enter private key"
//         />
//       </View>

//       <View style={styles.buttonContainer}>
//         <Button title="Import Wallet" onPress={importWallet} />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   header: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   buttonContainer: {
//     marginBottom: 20,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     flex: 1,
//     marginLeft: 10,
//   },
// });

// export default WalletImportScreen;
