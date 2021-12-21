import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon } from 'react-native-elements';
import Constants from "expo-constants";
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("db.db");

function useForceUpdate() {
  const [value, setValue] = useState(0);
  return [() => setValue(value + 1), value];
}

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
              <Icon style={styles.icon} name={done ? "done" : "pending"} />
            </View>
            <View ><Text style={{ color: "#000", fontSize: 15 }}>{value}  </Text></View>
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
export default function App() {
  const [text, setText] = React.useState(null);
  const [forceUpdate, forceUpdateId] = useForceUpdate();

  React.useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists items (id integer primary key not null, done int, value text);"
      );
    });
  }, []);

  const add = (text) => {
    // is text empty?
    if (text === null || text === "") {
      return false;
    }

    db.transaction(
      (tx) => {
        tx.executeSql("insert into items (done, value) values (0, ?)", [text]);
        tx.executeSql("select * from items", [], (_, { rows }) =>
          console.log(JSON.stringify(rows))
        );
      },
      null,
      forceUpdate
    );
  };
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>ToDo App</Text>
      <>
        <View style={styles.flexRow}>
          <TextInput
            onChangeText={(text) => setText(text)}
            onSubmitEditing={() => {
              add(text);
              setText(null);
            }}
            placeholder="What do you need to do?"
            style={styles.input}
            value={text}
          />
        </View>
        <ScrollView style={styles.listArea}>
          <Items
            key={`forceupdate-todo-${forceUpdateId}`}
            done={false}
            onPressItem={(id) =>
              db.transaction(
                (tx) => {
                  tx.executeSql(`update items set done = 1 where id = ?;`, [
                    id,
                  ]);
                },
                null,
                forceUpdate
              )
            }
          />
          <Items
            done
            key={`forceupdate-done-${forceUpdateId}`}
            onPressItem={(id) =>
              db.transaction(
                (tx) => {
                  tx.executeSql(`delete from items where id = ?;, [id]`);
                },
                null,
                forceUpdate
              )
            }
          />
        </ScrollView>
      </>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  heading: {
    paddingTop: 20,
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  flexRow: {
    flexDirection: "row",
    paddingBottom: 10,
  },
  input: {
    borderColor: "#4630eb",
    borderRadius: 4,
    borderWidth: 1,
    flex: 1,
    height: 48,
    margin: 16,
    padding: 8,
    fontSize: 16,
  },
  listArea: {
    backgroundColor: "#f0f0f0",
    flex: 1,
    paddingTop: 26,

  },
  sectionContainer: {
    marginBottom: 16,
    marginHorizontal: 16,
    alignItems: 'stretch',

  },
  sectionHeading: {
    fontSize: 25,
    marginBottom: 10,
    fontWeight: "bold"
  },
  icon: {
    marginRight: 10,
  },


});