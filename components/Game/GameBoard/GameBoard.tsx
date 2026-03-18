'use client'
import { useState } from "react";

import { PlayerData } from "@/types/player";
import BoardRow from "./components/BoardRow/BoardRow";

const defaultBoardState = () => {

}

const maxRows = 6
    /*
        name: string
        nationality: string[]
        earning: number high low
        games: string[]
        achievements: string[]
    */
const boardHeader: {[key: string]: keyof PlayerData} = {
    "Name": "playerName",
    "Nationalities": "nationality",
    "Status": "years active",
    "Approx Earning": "approx. total winnings",
    "Games" : "games",
    "Teams": "teams",
    "Wins": "achievements"
}

export default function GameBoard({
    answer,
    boardState,
    currentGuess,
    currentGuessIndex
} : {
    answer: PlayerData,
    boardState: (PlayerData | null)[],
    currentGuess: PlayerData | null,
    currentGuessIndex: number
}) {



  return (
    <div className = "game-board">
        {
            Object.keys(boardHeader).map((header, key) => {
                return <div className ="board-header" key ={key}>{header}</div>
            })
        }

        {
            boardState.map((rowState, index) => {
                return <BoardRow
                    key = {index}
                    boardHeader = {boardHeader}
                    answer ={answer}
                    rowState = {currentGuessIndex === index ? currentGuess : rowState}
                    isCurrentGuess = {currentGuessIndex === index}
                    isPastGuess = {currentGuessIndex > index}
                    isFutureGuess = {currentGuessIndex < index}
                />
            })
        }
    </div>
  );
}
