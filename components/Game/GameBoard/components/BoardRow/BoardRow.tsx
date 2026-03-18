'use client'
import { useEffect, useState } from "react";
import { PlayerData } from "@/types/player";
import tournamentData from "../../../../../datas/tournamentData.json"
import { omitBy } from "lodash";
import Image from 'next/image'
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

const maxRows = 6

const colorMap = {
    "correct": "#006426",
    "partial": "#a57714",
    "wrong": "#a71212"
}

const getMappedAchievements = (achievements: string[]) => {
    const retObj = Object.fromEntries(tournamentData.map(t => ([
        t,
        {
            count : 0,
            url: null
        }
    ])))

    return omitBy(achievements.reduce((acc: any, cur: any) => {
        const tournamentPrefix = tournamentData.find(v => cur.startsWith(v))
        if (tournamentPrefix) {
            return {
                ...acc,
                [tournamentPrefix] : {
                    count : acc[tournamentPrefix].count + 1,
                    url: "/images/tournaments/"+cur.replace(":", "_")+".png"
                }
            }
        }
        
    }, retObj), ({count}) => !count)
    
}

const getAnswerColor = (guess: string[], answer:string[]) => {
    return answer.length === guess.length && answer.every(a => guess.includes(a)) ? 
                    colorMap["correct"]
                    : 
                    answer.some(a => guess.includes(a)) ?
                    colorMap["partial"]
                    :
                    colorMap["wrong"]
}

export default function BoardRow({
    answer,
    rowState,
    isCurrentGuess,
    isPastGuess,
    isFutureGuess,
    boardHeader
} : {
    answer: PlayerData,
    rowState: PlayerData | null,
    isCurrentGuess: boolean,
    isPastGuess: boolean,
    isFutureGuess: boolean,
    boardHeader: {[key: string]: keyof PlayerData}
}) {

    // Past teams not including current ones
    const [pastTeams, setPastTeam ] = useState<string[] | null>(null)

    useEffect(() => {
        if (rowState?.teamHistory && rowState.teams) {
            setPastTeam(rowState.teamHistory.filter(team => !rowState.teams.includes(team)))
        }
        
    }, [rowState, answer])


  return (
    <>
        <div className ="board-item name" style ={{
            backgroundColor : 
                isPastGuess ? 
                    rowState?.playerName === answer.playerName
                    ?
                    colorMap.correct
                    :
                    colorMap.wrong
                    :
                    "transparent"
        }}>
            {
                rowState?.playerName ?? "?"
            }
        </div>
        <div className ="board-item nationality" style ={{
            backgroundColor : 
                isPastGuess ? 
                getAnswerColor(rowState?.nationality ?? [], answer.nationality)
                :
                "transparent"
        }}>
            {
                rowState?.nationality && !isCurrentGuess && !isFutureGuess? 
                    rowState.nationality.map((nationality, key)=> {
                        return <div key = {key}>{nationality}</div>
                    })
                    : 
                "?"
            }
        </div>
        <div className ="board-item active" style ={{backgroundColor: isPastGuess ? rowState?.["years active"][1] === answer["years active"][1] ? colorMap.correct : colorMap.wrong : "transparent"}} >
            {
                rowState?.["years active"] && !isCurrentGuess && !isFutureGuess? 
                    rowState?.["years active"]?.[1] !== null ? "Inactive" : "Active"
                :
                "?"
            }
        
        </div>
        <div className ="board-item earnings" style={{backgroundColor: isPastGuess ? rowState?.["approx. total winnings"] === answer["approx. total winnings"] ? colorMap.correct : colorMap.wrong : "transparent"}}>
            <div style ={{visibility: isPastGuess && rowState?.["approx. total winnings"] && rowState?.["approx. total winnings"] < answer["approx. total winnings"] ? "visible" : "hidden"}}>
                <FaCaretUp/> Higher
            </div>
            <div>
                {
                    rowState?.["approx. total winnings"] && !isCurrentGuess && !isFutureGuess? 
                        "$"+rowState["approx. total winnings"].toLocaleString('en-US')
                        : 
                    "?"
                }
            </div>
            <div style ={{visibility: isPastGuess && rowState?.["approx. total winnings"] && rowState?.["approx. total winnings"] > answer["approx. total winnings"] ? "visible" : "hidden"}}>
                <FaCaretDown/> Lower
            </div>
        
        </div>
        <div className ="board-item games"  style={{backgroundColor: isPastGuess ? getAnswerColor(rowState?.games ?? [], answer.games) : "transparent"}}>
            {
                rowState?.games && !isCurrentGuess && !isFutureGuess? 
                    rowState.games.map((game, index) => {
                        return <div key ={index}>{game}</div>
                    })
                    : 
                "?"
            }
        </div>
        <div className ={`board-item teams ${isPastGuess ? "guessed" : ""}`} style={{backgroundColor: isPastGuess ? getAnswerColor(rowState?.teamHistory ?? [], answer.teamHistory) : "transparent"}}>
            {
                rowState?.teams && pastTeams && !isCurrentGuess && !isFutureGuess? 
                    <>
                    <div className="team-header"><b>Past teams:</b></div>
                    <ul>
                    {
                        pastTeams.length ? pastTeams.map((team, index) => {
                            return <li key ={index} className = "past-team-name">{team}</li>
                        })
                        :
                        <li>None</li>
                    }
                    </ul>
                    <div className="team-header"><b>Current teams:</b></div>
                    <ul>
                    {
                        rowState.teams.length ? rowState.teams.map((team, index) => {
                            return <li key ={index} className = "past-team-name">{team}</li>
                        })
                        :
                        <li>None</li>
                    }
                    </ul>
                    
                    
                    </>
                    : 
                "?"
            }
        </div>
        <div className ={`board-item achievements ${isPastGuess && Object.entries(getMappedAchievements(rowState?.achievements ?? [])).length ? "guessed" : ""}`} style ={{backgroundColor: isPastGuess && rowState?.achievements ? getAnswerColor(Object.keys(getMappedAchievements(rowState.achievements)), Object.keys(getMappedAchievements(answer.achievements))) : "transparent"}}>
            {
                rowState?.achievements && !isCurrentGuess && !isFutureGuess ? 
                Object.entries(getMappedAchievements(rowState.achievements)).length ? 
                    Object.entries(getMappedAchievements(rowState.achievements)).map(([tournamentPrefix, {count, url}], index) => {
                        return (
                            <div key = {index}>
                                <span>{count}x</span>
                                <Image src ={url} height= {20} width={20} alt ={tournamentPrefix} title={tournamentPrefix} unoptimized/>
                                <span>{tournamentPrefix}</span>
                            </div>
                        )
                    })
                    :
                    "N/A"
                    :
                    "?"
            }
        </div>
    </> 
  );
}
