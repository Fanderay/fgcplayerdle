'use client'

import GridGame from "@/components/GridGame/GridGame";
import { useCallback, useState } from "react";
import { decodeBoardTemplate } from "@/util/generatePrompts";
import { BoardGridPrompts } from "@/types/gridPrompt";
import BoardManagement from "@/components/BoardManagement/BoardManagement";

export default function Home() {

  const [gridPrompt, setGridPrompt] = useState<BoardGridPrompts>(decodeBoardTemplate("b3A:VG9raWRv?bWU:MTAwMDAw!aXQ:UkVKRUNU|VGVhbSBSRUpFQ1Q?ZmM:SmFwYW4|SmFwYW5lc2U")) //generatePromptGrid(3,3)

  const [showBoardManagement, setShowBoardManagement] = useState(true)

  const handleBoardChange = useCallback((boardString: string) => {
    decodeBoardTemplate(boardString)
    setShowBoardManagement(false)
  }, [])

  return (
    <div className = "home-container">
      <h1>FGC Playerdle (Beta)</h1>
      <h4>Guessing game for FGC pros</h4>

      {
        !showBoardManagement ?
          <>
            <button className = "board-browser-button" onClick ={() => setShowBoardManagement(true)}>Browser other boards</button>
          </>
          
          :
          <BoardManagement onBoardChange = {handleBoardChange} onBack = {() => setShowBoardManagement(false)}/>
      }

      <GridGame gridPrompt={gridPrompt} style ={{display: showBoardManagement ? "none":"block"}}/>
      
      <footer>Made by Whale, with no AI. Support ya locals.</footer>
    </div>
  );
}



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