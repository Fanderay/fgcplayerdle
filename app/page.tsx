'use client'

import Game from "@/components/Game/Game";
import GridGame from "@/components/GridGame/GridGame";
import { useState } from "react";

export default function Home() {

  const [showOldGame, setShowOldGame] = useState(false)
  return (
    <div className = "home-container">
      <h1>FGC Playerdle</h1>
      <h4>Guessing game for FGC pros</h4>
      {/*<button onClick = {() => setShowOldGame(s => !s)}>{!showOldGame ? "Try proof of concept game mode": "Return to normal game mode"}</button>*/}
      {
        showOldGame
        ?
        <Game/>
        :
        <GridGame/>
      }
      <footer>Made by Whale, with no AI. Support ya local.</footer>
    </div>
  );
}


//griddle
// same team as player
// min earning
// has won X
// nationality
// active
// game
// team
