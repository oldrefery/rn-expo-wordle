import { StatusBar } from "expo-status-bar";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CLEAR, colors, colorsToEmoji, ENTER } from "./src/constants";
import Keyboard from "./src/components/Keyboard";
import { useEffect, useState } from "react";
import * as Clipboard from "expo-clipboard";
import { faker } from "@faker-js/faker/locale/en";

const MAX_ATTEMPTS = 6;
export type Word = string[];

const copyArray = (arr: Word[]) => arr.map((row: Word) => [...row]);
const enum GameStatus {
  PLAYING = "playing",
  WON = "won",
  LOST = "lost",
}
const word = faker.random.word();

export default function App() {
  const wordLength = word.length;
  const letters = word.split("");
  const [rows, setRows] = useState<Word[]>(
    new Array(MAX_ATTEMPTS).fill(new Array(wordLength).fill(""))
  );
  const [currentRow, setCurrentRow] = useState<number>(0);
  const [currentColumn, setCurrentColumn] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.PLAYING);

  useEffect(() => {
    if (currentRow > 0) {
      checkGameState();
    }
  }, [currentRow]);

  const checkGameState = () => {
    if (checkIfWon()) {
      setGameStatus(GameStatus.WON);
      Alert.alert("Hooray!", "You won!", [
        { text: "Share", onPress: shareScore },
      ]);
    } else if (checkIfLost()) {
      setGameStatus(GameStatus.LOST);
      Alert.alert("Meh...", "Try again tomorrow");
    }
  };

  const shareScore = () => {
    const textMap = rows
      .map((row, indexRow) =>
        row
          .map(
            (cell, indexColumn) =>
              colorsToEmoji[getCellBackgroundColor(indexRow, indexColumn)]
          )
          .join("")
      )
      .filter((row) => row)
      .join("\n");
    const textToShare = `Wordle result \n${textMap}`;

    Clipboard.setStringAsync(textToShare);
  };
  const checkIfWon = (): boolean => {
    const lastTypedWord = rows[currentRow - 1].join("");
    return lastTypedWord === word;
  };
  const checkIfLost = (): boolean => {
    return currentRow === MAX_ATTEMPTS;
  };

  const onKeyPressed = (key: string) => {
    if (gameStatus != GameStatus.PLAYING) {
      return;
    }

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
    indexRow: number,
    indexCell: number
  ): string => {
    const letter = rows[indexRow][indexCell];
    if (indexRow >= currentRow) {
      return colors.black;
    }
    if (isRightPlace(letter, indexCell)) {
      return colors.primary;
    }
    if (letters.includes(letter)) {
      return colors.secondary;
    }
    return colors.darkgrey;
  };

  const isRightPlace = (letter: string, indexCell: number) => {
    return letter === letters[indexCell];
  };

  const lettersWithColor = (color: string) => {
    // @ts-ignore
    return rows.flatMap((row: Word[], indexRow: number) =>
      row.filter(
        (cell, indexCell) =>
          getCellBackgroundColor(indexRow, indexCell) === color
      )
    );
  };
  const greenCaps = lettersWithColor(colors.primary);

  const yellowCaps = lettersWithColor(colors.secondary);
  const greyCaps: Word[] = lettersWithColor(colors.darkgrey);

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
      <Keyboard
        onKeyPressed={onKeyPressed}
        greenCaps={greenCaps}
        yellowCaps={yellowCaps}
        greyCaps={greyCaps}
      />
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
