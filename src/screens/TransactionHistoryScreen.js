// import React, { useState } from 'react';
// import { View, Text, FlatList, StyleSheet } from 'react-native';

// const TransactionHistoryScreen = () => {
//   const [transactions, setTransactions] = useState([
//     { id: '1', status: 'Pending', amount: '0.05 BTC', fee: '0.001 BTC' },
//     { id: '2', status: 'Completed', amount: '0.1 BTC', fee: '0.002 BTC' },
//     { id: '3', status: 'Failed', amount: '0.02 BTC', fee: '0.001 BTC' },
//     // Add more transaction data as needed
//   ]);

//   const renderTransactionItem = ({ item }) => (
//     <View style={styles.transactionItem}>
//       <Text style={styles.statusText}>Status: {item.status}</Text>
//       <Text style={styles.amountText}>Amount: {item.amount}</Text>
//       <Text style={styles.feeText}>Fee: {item.fee}</Text>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Transaction History</Text>

//       {/* Transaction history list */}
//       <FlatList
//         data={transactions}
//         keyExtractor={(item) => item.id}
//         renderItem={renderTransactionItem}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f0f0f0',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: '#3498db',
//   },
//   transactionItem: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 16,
//     marginBottom: 16,
//     borderRadius: 8,
//     backgroundColor: 'white',
//   },
//   statusText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 8,
//     color: '#2ecc71', // Green color for status
//   },
//   amountText: {
//     fontSize: 14,
//     marginBottom: 8,
//   },
//   feeText: {
//     fontSize: 14,
//     color: '#e74c3c', // Red color for fee
//   },
// });

// export default TransactionHistoryScreen;




import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TransactionHistoryScreen = () => {
  const transactions = [
    { id: '1', status: 'Pending', amount: '0.05 BTC', fee: '0.001 BTC' },
    { id: '2', status: 'Completed', amount: '0.1 BTC', fee: '0.002 BTC' },
    { id: '3', status: 'Completed', amount: '0.1 MAT', fee: '0.002 MAT' },
    { id: '4', status: 'Failed', amount: '0.02 BTC', fee: '0.001 BTC' },
    { id: '5', status: 'Pending', amount: '0.01 MAT', fee: '0.01 MAT' },
    // Add more transaction data as needed
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transaction History</Text>

      {/* Transaction history items */}
      {transactions.map((transaction) => (
        <View key={transaction.id} style={styles.transactionItem}>
          <Text style={styles.statusText}>Status: {transaction.status}</Text>
          <Text style={styles.amountText}>Amount: {transaction.amount}</Text>
          <Text style={styles.feeText}>Fee: {transaction.fee}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3498db',
  },
  transactionItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2ecc71', // Green color for status
  },
  amountText: {
    fontSize: 14,
    marginBottom: 8,
  },
  feeText: {
    fontSize: 14,
    color: '#e74c3c', // Red color for fee
  },
});

export default TransactionHistoryScreen;
