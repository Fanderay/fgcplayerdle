import { PlayerData } from "@/types/player"
import "./style.css"
import { useState, useEffect } from "react"
import Image from "next/image"

const chooseRandPlayer = (playerList: PlayerData[]) => {
    if (playerList.length) {
        const randIndex = Math.floor(Math.random() * playerList.length)
        return playerList[randIndex]
    }
    return null
    
}

export default function OutcomeModal({
    isWin,
    isLose,
    playerList
}: {
    isWin: boolean,
    isLose: boolean,
    playerList: PlayerData[]
}) {

    const [randPlayer, setRandPlayer] = useState<PlayerData|null>(chooseRandPlayer(playerList))
    const [playerImageUrl, setPlayerImageUrl] = useState<string|null>(null)

    useEffect(() => {
        if (randPlayer?.hasPlayerImage) setPlayerImageUrl(`/images/players/${randPlayer.canonicalPlayerName}.png`)
    }, [randPlayer])

    return (
        <div className = "outcome-modal" style ={{visibility: isWin || isLose ? "visible" : "hidden"}}>
            <h2>{isWin ? "You won" : "You lose"}</h2>
            <h4>{isWin ? "Thanks for playing" : "Better luck next time"}</h4>

            {
                isWin && randPlayer?
                    <div className = "highlight-player">
                        <h3>Your highlight player: <b>{randPlayer.playerName}</b></h3>

                        {
                            playerImageUrl ? <Image height= {100} width = {100} alt={randPlayer?.playerName} src = {playerImageUrl} unoptimized className="player-img" /> : <div>Player does not have an image</div>
                        }

      
                        <label>Nationality:</label>
                        {randPlayer.nationality.map(n => <div key = {n}>{n}</div>)}

                        <label>Approx. Earnings:</label>
                        <div>{"$"+randPlayer["approx. total winnings"].toLocaleString('en-US')}</div>

                        <label>Current Team(s):</label>
                        {
                        randPlayer.teams.length ?
                            randPlayer.teams.map(team => <div key = {team}>{team}</div>)
                            :
                            <div>Not currently in a team</div>
                        }


                        <label>Trophy Collection:</label>
                        <div className = "highlight-trophy-collection">
                        {
                            randPlayer.achievements?.length ?
                                randPlayer.achievements?.map(achievement => {
                                    return <Image key ={achievement} className="tourney-img" src ={`/images/tournaments/${encodeURIComponent(achievement.replace(":", "_"))}.png`} height= {10} width={10} alt ={achievement} title={achievement} unoptimized/>
                                })
                            :
                                "Nothing here :("
                        }
                        </div>

                    </div>
                    :
                    null
            }
        </div>
    )

}