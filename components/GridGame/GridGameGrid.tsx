'use client'
import { PlayerData } from "@/types/player";
import Image from 'next/image';
import { useEffect, useState } from "react";
import playerData from "../../datas/playerData.json";
import "./style.css";




export default function GridGameGrid({
    gridValidationFuncs,
    onClick,
    rowIndex, 
    colIndex,
    curAnswer,
    className = ""
}: {
    gridValidationFuncs : ((playerData: PlayerData, allPlayerData: PlayerData[]) => boolean)[]
    onClick: (rowIndex: number, colIndex: number) => void,
    rowIndex: number,
    colIndex: number,
    curAnswer: null | PlayerData,
    className: string
}) {

    const [isValid, setIsValid] = useState(false)

    const [playerImageUrl, setPlayerImageUrl] = useState("")



    useEffect(() => {
      if (curAnswer) setPlayerImageUrl(`/images/players/${curAnswer.canonicalPlayerName}.png`)
    }, [curAnswer])

    useEffect(() => {
        if (!curAnswer) setIsValid(false)
        else {
            setIsValid(gridValidationFuncs.every(func => func(curAnswer, playerData)))
        }
        
    }, [gridValidationFuncs, curAnswer])

    const handleClick = () => {
        if (!isValid) onClick(rowIndex, colIndex)
       
    }

    return (
 
        <div className={`grid-game-grid-container ${className} ${isValid ? "valid" : ""}`} onClick = {handleClick}>
        
                
        
            {   
                curAnswer && isValid ?

                    curAnswer?.hasPlayerImage ?
                        <div className="grid-game-grid-image-container" style ={{visibility:`${isValid && curAnswer ? "visible": "hidden"}`}}>
                            <Image height= {200} width = {100} alt={curAnswer?.playerName ?? "Player name"} src = {playerImageUrl} unoptimized className="player-img" /> 
                        </div>
                        :
                        null
                    :
                    null
            }
            
            

        
            <div>{isValid && curAnswer ? curAnswer.playerName : "?"}</div>
        </div>


    )

    
}