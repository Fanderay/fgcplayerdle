'use client'
import { useCallback, useEffect, useState } from "react";

import { PlayerData } from "@/types/player";
import Image from 'next/image';


import PlayerSelect from "../PlayerSelect/PlayerSelect";
import "./style.css";

export default function PlayerSelectModal({
  onSubmit,
  onCancel,
  isOpen,
  disallowSelectionFuncs,
  removedPlayers,
  disabled
} : {
  onSubmit : (playerData: PlayerData) => void
  onCancel: () => void,
  disallowSelectionFuncs: ((PlayerData: PlayerData) => {allowed: boolean, text: string} | null)[]
  isOpen: boolean,
  removedPlayers: string[],
  disabled: boolean
}) {
  const [curPlayer, setCurPlayer] = useState<PlayerData|null>(null)
  const [playerImageUrl, setPlayerImageUrl] = useState("")

  const [isAllowed, setIsAllowed] = useState(false)
  const [disallowedText, setDisallowedText] = useState("")

  const handleChange = useCallback((newPlayer: PlayerData | null) => {
    setCurPlayer(newPlayer)
  }, [])

  useEffect(() => {
      if (curPlayer) setPlayerImageUrl(`/images/players/${curPlayer.canonicalPlayerName}.png`)
    }, [curPlayer])

  const handleCancel = () => {
    onCancel()
    setCurPlayer(null)
    setPlayerImageUrl("")
  }

  const handleSubmit = () => {
    if (curPlayer) {
      setCurPlayer(null)
      setPlayerImageUrl("")
      onSubmit(curPlayer)

    }
  }

  useEffect(() => {
    if (curPlayer) {
      const userInvalid = !disallowSelectionFuncs.every(f => { 
        if (f) {
          const allowInfo = f(curPlayer)
          if (allowInfo?.text && !allowInfo?.allowed) setDisallowedText(allowInfo.text)
          return allowInfo?.allowed ?? true
        }
        else return true
      })
      const userAlreadySelected = removedPlayers.includes(curPlayer.canonicalPlayerName)
      if (userAlreadySelected) setDisallowedText("user has already been played this round")
      setIsAllowed(!(userAlreadySelected || userInvalid))
    }
    else setIsAllowed(false)
  }, [curPlayer, removedPlayers])


  return (
    <div className = "player-select-modal-container" style ={{visibility: `${isOpen && !disabled ? "visible" : "hidden"}`}}>
      <h4>Choose a player</h4>
      <div className="player-select-selection-container">
        <PlayerSelect
          onChange = {handleChange}
          currentPlayer={curPlayer}
        />
      </div>
      
      {
        curPlayer ?
        <div>
          {
            curPlayer.hasPlayerImage ? <Image height= {200} width = {100} alt={curPlayer.playerName} src = {playerImageUrl} unoptimized className="player-img" /> : <div>Player does not have an image</div>
          }
        </div>
        :
        null
      }
      {
        !isAllowed && curPlayer ?
        <div style ={{color: "red"}}>Player not allowed because {disallowedText}</div>
        :
        null
      }
      <div className = "player-select-modal-button-container">
        <button onClick = {handleSubmit} disabled ={!curPlayer || !isAllowed}>Submit</button>
        <button onClick = {handleCancel}>Close</button>
      </div>
      
    </div>
  );
}
