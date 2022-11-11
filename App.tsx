import { StatusBar } from "expo-status-bar";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { CLEAR, colors, ENTER } from "./src/constants";
import Keyboard from "./src/components/Keyboard";
import { useState } from "react";

const MAX_ATTEMPTS = 6;
type Word = string[];

const copyArray = (arr: Word[]) => arr.map((row: Word) => [...row]);

export default function App() {
  const word = "world";
  const wordLength = word.length;
  const letters = word.split("");
  const [rows, setRows] = useState<Word[]>(
    new Array(MAX_ATTEMPTS).fill(new Array(wordLength).fill(""))
  );
  const [currentRow, setCurrentRow] = useState<number>(0);
  const [currentColumn, setCurrentColumn] = useState<number>(0);

  const onKeyPressed = (key: string) => {
    const updatedRow = copyArray(rows);
    if (key === CLEAR) {
      if (currentColumn > 0) {
        const prevColumn = currentColumn - 1;
        updatedRow[currentRow][prevColumn] = "";

        setRows(updatedRow);
        setCurrentColumn(prevColumn);
      }

      return;
    }

    if (key === ENTER) {
      if (currentColumn === rows[currentRow].length) {
        setCurrentRow(currentRow + 1);
        setCurrentColumn(0);
      }

      return;
    }

    if (currentColumn < rows[currentRow].length) {
      updatedRow[currentRow][currentColumn] = key;
      setRows(updatedRow);
      setCurrentColumn(currentColumn + 1);
    }
  };

  const isCellActive = (indexCell: number, indexRow: number): boolean => {
    return indexRow === currentRow && indexCell === currentColumn;
  };

  const getCellBackgroundColor = (
    letter: string,
    indexRow: number,
    indexCell: number
  ): string => {
    if (indexRow >= currentRow) {
      return colors.black;
    }
    if (letter === letters[indexCell]) {
      return colors.primary;
    }
    if (letters.includes(letter)) {
      return colors.secondary;
    }
    return colors.darkgrey;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>WORDLE</Text>
      <ScrollView style={styles.map}>
        {rows.map((row, indexRow) => (
          <View style={styles.row} key={indexRow}>
            {row.map((letter, indexCell) => (
              <View
                style={[
                  styles.cell,
                  {
                    borderColor: isCellActive(indexCell, indexRow)
                      ? colors.lightgrey
                      : colors.darkgrey,
                  },
                  {
                    backgroundColor: getCellBackgroundColor(
                      letter,
                      indexRow,
                      indexCell
                    ),
                  },
                ]}
                key={indexCell}
              >
                <Text style={styles.cellText}>{letter}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
      <Keyboard onKeyPressed={onKeyPressed} />
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
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: 7,
  },
  map: {
    alignSelf: "stretch",
    marginTop: 20,
    height: 100,
  },
  row: {
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "center",
  },
  cell: {
    borderWidth: 3,
    borderColor: colors.darkgrey,
    flex: 1,
    maxWidth: 70,
    aspectRatio: 1,
    margin: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  cellText: {
    color: colors.lightgrey,
    fontSize: 28,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
