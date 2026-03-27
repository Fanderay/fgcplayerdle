'use client'
import { useCallback, useEffect, useState } from "react";
import playerData from "../../datas/playerData.json"
import { PlayerData } from "@/types/player";
import { fill } from "lodash";
import GameBoard from "./GameBoard/GameBoard";
import PlayerSelect from "../PlayerSelect/PlayerSelect";
import { Settings } from "@/types/settings";
import SettingModal from "../SettingModal/SettingModal";
import Image from 'next/image'
import { encodeBoardTemplate, decodeBoardTemplate } from "@/util/generatePrompts";



const defaultBoardState = () => {
  return fill(new Array(maxRow), null)
}

const getRandomAnswer = (allowedGames: string[] | null, allowedNationalities: string[] | null) => {
  const allowedPlayers = playerData.filter(({games, nationality}) => {
    const gamesAllowed = allowedGames === null ? true : games.some(g => allowedGames.includes(g))
    const nationalityAllowed = allowedNationalities === null ? true : nationality.some(g => allowedNationalities.includes(g))
    return gamesAllowed && nationalityAllowed
  })

  const randIndex = Math.floor(Math.random() * allowedPlayers.length)

  return allowedPlayers[randIndex]

}

const getDefaultSettings = () => {
  return {
    allowedGames: ["Street Fighter"],
    allowedNationalities: null
  }
}

const maxRow = 6

export default function Game() {

    const [showSettings, setShowSettings] = useState(false)
    const [settings, setSettings] = useState<Settings|null>(null)

    const [answer, setAnswer] = useState<PlayerData | null>(null)

    const [boardState, setBoardState] = useState<(PlayerData|null)[]>(defaultBoardState())

    const [currentGuess, setCurrentGuess] = useState<PlayerData|null>(null)
    const [currentGuessIndex, setCurrentGuessIndex] = useState(0)

    const [isWin, setIsWin] = useState(false)
    const [isLose, setIsLose] = useState(false)

    const [playerImageUrl, setPlayerImageUrl] = useState("")

    const onSelect = useCallback((playerData: PlayerData | null) => {
      setCurrentGuess(playerData)
    }, [])

    const onSubmit = () => {
      if (currentGuess) {
        setBoardState(b => {
          const currentBoard = [...b]
          currentBoard[currentGuessIndex] = currentGuess
          return currentBoard
        })
        if (currentGuess.playerName === answer?.playerName) {
          setIsWin(true)
        }
        else if (currentGuessIndex === maxRow - 1) {
          setIsLose(true)
          setCurrentGuessIndex(i=>i+1)
        }
        else {
          setCurrentGuessIndex(i=>i+1)
          setCurrentGuess(null)
        }

        
      }
      
    }

    const onNewAnswer = () => {
      setAnswer(getRandomAnswer(settings?.allowedGames ?? null, null))
      setCurrentGuess(null)
      setCurrentGuessIndex(0)
      setBoardState(defaultBoardState())

      setIsLose(false)
      setIsWin(false)

    }

    const handleSettingSave = useCallback((settings: Settings) => {
        setSettings(settings)
        localStorage.setItem("settings", JSON.stringify(settings))
    }, [])

    useEffect(() => {
        setSettings({...(getDefaultSettings()), ...JSON.parse(localStorage.getItem("settings") ?? "{}")})
    }, [])

    useEffect(() => {
      console.log(answer)
    }, [answer])

    useEffect(() => {
      console.log(settings)
        if (settings) {
            setAnswer(getRandomAnswer(settings?.allowedGames ?? null, null))
        }
    }, [settings])

    useEffect(() => {
      if (answer) setPlayerImageUrl(`/images/players/${answer.canonicalPlayerName}.png`)
    }, [answer])

  return (
    <div className = "game-container">
      <div className = "option-container">
        <button onClick={onNewAnswer}>Generate new answer</button>
        <button onClick={() => setShowSettings(true)} disabled = {!settings}>Settings</button>
        
      </div>
      <div>
        {
          Object.values(settings??{}).some(a => a !== null) ? "Filters applied" : null
        }
      </div>
      <div className = "select-container">
        <PlayerSelect
          onChange={onSelect}
          currentPlayer={currentGuess}
        />
      </div>
      <div className = "submit-container">
        <button onClick = {onSubmit} disabled = {!currentGuess}>Submit</button>
      </div>
      <div className = "game-board-container">
        {
          answer ?
            <GameBoard
              answer = {answer}
              boardState = {boardState}
              currentGuess = {currentGuess}
              currentGuessIndex={currentGuessIndex}
            />
            :
            null
        }
        
      </div>
      {
        settings ? 
        <SettingModal
          settings={settings} 
          isVisible = {showSettings} 
          onSave = {handleSettingSave} 
          onClose={() => setShowSettings(false)}
          getDefaultSetting= {getDefaultSettings}
        />
        :
        null
      }

      
         <div className = "winner-modal" style ={{visibility:  isWin || isLose ? "visible" : "hidden" }}>
            <h2>{isWin ? "Correct!" : "Incorrect"}</h2>
            <div>The answer was: </div>
            <h3>{answer?.playerName}</h3>
            <div>
            {
              answer?.hasPlayerImage ? <Image height= {100} width = {100} alt={answer?.playerName} src = {playerImageUrl} unoptimized className="player-img" /> : <div>Player does not have an image</div>
            }

            </div>
            
            <div className = "answer-player-info">
              <label>Nationality:</label>
              <div>{answer?.nationality}</div>
            </div>

            <div className = "answer-player-info">
              <label>Approx. Earnings:</label>
              <div>{"$"+answer?.["approx. total winnings"].toLocaleString('en-US')}</div>
            </div>

            <div className = "answer-player-info">
              <label>Current Team(s):</label>
              {
                answer?.teams.length ?
                answer.teams.map(team => <div>{team}</div>)
                :
                <div>Not currently in a team</div>
              }
              
            </div>

            <div className = "answer-player-info">
              <label>Trophy Collection:</label>
              <div className = "answer-trophy-collection">
              {
                answer?.achievements?.length ?
                  answer?.achievements?.map(achievement => {
                    return <Image className="tourney-img" src ={`/images/tournaments/${encodeURIComponent(achievement.replace(":", "_"))}.png`} height= {0} width={0} alt ={achievement} title={achievement} unoptimized/>
                  })
                  :
                  "Nothing here :("
              }
              </div>
              
            </div>


            <a href = {`https://liquipedia.net/fighters/${answer?.canonicalPlayerName}`} target="_blank" rel="noopener noreferrer">Check them on Liquipedia</a>
            <button onClick = {onNewAnswer} className="new-answer-button">Generate New Answer</button>  
          </div>
          
      </div>
  );
}
