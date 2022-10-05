import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

const db = SQLite.openDatabase('cartdb.db');

export default function App() {

  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [cart, setCart] = useState([]);
  
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists cart (id integer primary key not null, product text, amount text);');
    }, null, updateList); 
  }, []);

  

  const saveProduct = () => {
    db.transaction(tx => {
        tx.executeSql('insert into cart (product, amount) values (?, ?);', [product, amount]);    
      }, null, updateList);

      setProduct('');
      setAmount('');
  }

  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from cart;', [], (_, { rows }) =>
        setCart(rows._array)); 
    });
  }

  const deleteProduct = (id) => {
    db.transaction(
      tx => {
        tx.executeSql('delete from cart where id = ?;', [id]);
      }, null, updateList);    
  }

 

  return (
    <View style={styles.container}>

   
      <View style= {styles.inbutton}>
      <TextInput style={styles.input}
        placeholder='Product'
        value={product}
        onChangeText={product => setProduct(product)}
      />
      <TextInput style={styles.input}
        placeholder='Amount'
        value={amount}
        onChangeText={amount => setAmount(amount)}
      />
      <Button 
        title='SAVE'
        onPress={saveProduct}
      />
      </View>
      <Text>Shopping List</Text>
      <FlatList style={styles.list}
      keyExtractor={item => item.id.toString()}
      renderItem={({item}) =>
          <View style={styles.list}>
            <Text>{item.product}, {item.amount}</Text>
            <Text style={styles.dtext} onPress={() => deleteProduct(item.id)}>  bought</Text>
          </View>}
        data={cart}
      />
    

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input : {
    marginTop: 2,
    borderColor: 'blue',
    borderWidth: 1,
    width: 150
  },
  list: {
   
    flexDirection: 'row',
     
  }, 
  inbutton: {
    marginTop: 50
  },
  dtext: {
    color: '#ff0000',
    fontWeight: 'bold'
  }
 
 
});
