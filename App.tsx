import { StatusBar } from "expo-status-bar";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "./src/constants";
import Keyboard from "./src/components/Keyboard";

const MAX_ATTEMPTS = 6;
type Word = string[];

export default function App() {
  const word = "world";
  const letters = word.split("");
  // const rows = [
  //   ["a", "p", "p", "l", "e"],
  //   ["", "", "", "", ""],
  //   ["", "", "", "", ""],
  //   ["", "", "", "", ""],
  //   ["", "", "", "", ""],
  //   ["", "", "", "", ""],
  // ];
  const rows: Word[] = new Array(MAX_ATTEMPTS).fill(
    new Array(word.length).fill("a")
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>WORDLE</Text>
      {rows.map((row, indexRow) => {
        console.log("indexRow", indexRow, row);
        return (
          <View style={styles.map} key={indexRow}>
            <View style={styles.row}>
              {row.map((cell, indexCell) => (
                <View
                  style={styles.cell}
                  key={`${cell}-${indexRow}${indexCell}`}
                >
                  <Text style={styles.cellText}>{cell}</Text>
                </View>
              ))}
            </View>
          </View>
        );
      })}
      <Keyboard />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: "center",
  },
  title: {
    color: colors.lightgrey,
    fontWeight: "bold",
    fontSize: 32,
    letterSpacing: 6,
  },
  map: {
    alignSelf: "stretch",
  },
  row: {
    flexDirection: "row",
    alignSelf: "stretch",
    justifyContent: "center",
  },
  cell: {
    borderColor: colors.darkgrey,
    borderWidth: 3,
    flex: 1,
    maxWidth: 70,
    aspectRatio: 1,
    margin: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  cellText: {
    textTransform: "uppercase",
    color: colors.lightgrey,
    fontSize: 28,
    fontWeight: "bold",
  },
});
