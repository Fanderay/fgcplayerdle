import Game from "@/components/Game/Game";
import Image from "next/image";

export default function Home() {
  return (
    <div className = "home-container">
      <h1>FGC Playerdle</h1>
      <h4>Guessing game for FGC pros</h4>
      <Game/>
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
