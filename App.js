import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("db.db");

function Items({ done: doneHeading, onPressItem }) {
  const [items, setItems] = React.useState(null);

  React.useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from items where done = ?;`,
        [doneHeading ? 1 : 0],
        (_, { rows: { _array } }) => setItems(_array)
      );
    });
  }, []);
  const heading = doneHeading ? "Completed" : "Todo";

  if (items === null || items.length === 0) {
    return null;
  }
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeading}>{heading}</Text>
      {items.map(({ id, done, value }) => (
        <TouchableOpacity
          key={id}
          onPress={() => onPressItem && onPressItem(id)}
          style={{
            backgroundColor: done ? "#FB2968" : "#fff",
            borderColor: "#29F6FB",
            borderWidth: 1,
            padding: 8,
            borderRadius: 8,
            marginBottom: 3,
            
          }}
        >
          <Text style={{ color: done ? "#fff" : "#000" }}>
           
            <View >
              <Icon style={styles.icon} name= {done ? "done" : "pending"}/>
            </View>
            <View ><Text style={{color:"#000", fontSize:15 }}>{value}  </Text></View>
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
export default function App(){
  return(
    <View>
      
    </View>
  );
}