'use client'

import GridGame from "@/components/GridGame/GridGame";

import { decodeBoardTemplate, encodeBoardTemplate } from "@/util/generatePrompts";

  const encodedBoard = encodeBoardTemplate({
  rowPrompts: [
    {
      templateKey: "olderThanPlayer",
      inputValue: ["Tokido"]
    },
    {
      templateKey: "moreThanEarning",
      inputValue: [100000]
    }
  ],
  columnPrompts: [
    {
      templateKey: "inTeam",
      inputValue: ["REJECT", "Team REJECT"]
    },
    {
      templateKey: "fromCountry",
      inputValue: ["Japan", "Japanese"]
    }
  ]
})

console.log("board", encodedBoard)

console.log("decode", decodeBoardTemplate(encodedBoard))

export default function Home() {

  return (
    <div className = "home-container">
      <h1>FGC Playerdle (Beta)</h1>
      <h4>Guessing game for FGC pros</h4>
      <GridGame/>
      <footer>Made by Whale, with no AI. Support ya locals.</footer>
    </div>
  );
}


//griddle
// animation for win/lose -> fly in from bottom / confetti
// string based encoding of the board, should be doable
// your highlighted player: randomly choose a player and display their information.
// reuse trophjy collection too pog

// anomyous sign in:


// DB schema:
//    - board table:
//        -- PK UUID
//        -- boardString string representation of a board
//        -- completeCount: int
//        -- startedCount: int
//              -- Use the bridge table to ensure a user can only update once per
//        -- createdTimestamp: int
//    - user board info table:
//        -- PK composite key: userId + boardId
//        -- FK userId
//        -- FK boardId
//        -- isCompleted bool
//        -- isStarted bool
//        -- attempedGuesses int
//        -- liked: bool
//    ^^ can create aggregate view which shows avg number of guesses to complete and total likes etc etc which can be queried frmo front end, 