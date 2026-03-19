'use client'
import { BoardGridPrompts } from "@/types/gridPrompt";
import { PlayerData } from "@/types/player";
import { validateGridAnswer } from "@/util/validateAnswer";
import { cloneDeep, fill } from "lodash";
import { useCallback, useEffect, useState } from "react";
import GridGameBoard from "../GridGameBoard/GridGameBoard";
import PlayerSelectModal from "../PlayerSelectModal/PlayerSelectModal";
import "./style.css";
import { generatePromptGrid } from "@/util/generatePrompts";
import OutcomeModal from "../OutcomeModal/OutcomeModal";


const generateBoardState = (rowLength: number, columnLength: number) => {
  return fill(new Array(columnLength), fill(new Array(rowLength), null))
}

/*
const testBoardState = [
  [
    {
      "teamHistory": [
        "Mad Catz",
        "Team Beast",
        "Red Bull eSports",
        "Team Beast",
        "Hit Box Arcade",
        "REJECT"
      ],
      "romanized name": "Daigo Umehara",
      "nationality": [
        "Japan"
      ],
      "years active": [
        1998,
        null
      ],
      "teams": [
        "REJECT",
        "Red Bull eSports",
        "Team Beast",
        "Hit Box Arcade"
      ],
      "approx. total winnings": 297584,
      "games": [
        "Street Fighter",
        "Capcom vs. SNK",
        "Guilty Gear"
      ],
      "achievements": [
        "1998 Street Fighter Alpha 3 World Championships",
        "Super Battle Opera 2003 SSFIIT",
        "Evolution Championship Series 2003",
        "Evolution Championship Series 2004",
        "Cooperation Cup 4",
        "Super Battle Opera 2005 SFIII3S",
        "Street Fighter IV International Exhibition",
        "Evolution Championship Series 2009 SFIV",
        "Evolution Championship Series 2010 SSFIV",
        "ReveLAtions 2011 SSFIV:AE",
        "DreamHack 2013 Winter",
        "Topanga World League 1",
        "Capcom Pro Tour 2014 Asia Finals",
        "Topanga League 4",
        "Canada Cup Master Series 2015 USFIV",
        "NorCal Regionals 2015 USFIV",
        "Topanga World League 2",
        "StunFest 2015 USFIV",
        "Topanga League 5",
        "Capcom Cup 2016 Europe",
        "E-Sports Festival Hong Kong 2017",
        "VSFighting 2018",
        "Street Fighter League Japan 2025"
      ],
      "hasPlayerImage": true,
      "canonicalPlayerName": "Daigo_Umehara",
      "playerName": "Daigo Umehara",
      "age": 44
    },
    {
      "teamHistory": [
        "Evil Bizz Gaming",
        "Denial Esports",
        "Cygames Beast",
        "OTF Gaming",
        "Al Qadsiah"
      ],
      "nationality": [
        "United States"
      ],
      "years active": [
        2012,
        null
      ],
      "approx. total winnings": 74234,
      "games": [
        "Street Fighter"
      ],
      "achievements": [
        "Street Fighter League United States 2023",
        "Street Fighter League World Championship 2023",
        "Street Fighter League United States 2025"
      ],
      "hasPlayerImage": true,
      "canonicalPlayerName": "Chris_Tatarian",
      "playerName": "Chris Tatarian",
      "romanized name": null,
      "teams": [],
      "age": 31
    },
    {
      "teamHistory": [
        "RIDDLE"
      ],
      "nationality": [
        "Japan"
      ],
      "years active": [
        2023,
        2025
      ],
      "approx. total winnings": 1616,
      "games": [
        "Street Fighter"
      ],
      "achievements": [],
      "hasPlayerImage": false,
      "canonicalPlayerName": "Adelie",
      "playerName": "Adelie",
      "romanized name": null,
      "teams": [
        "RIDDLE"
      ],
      "age": 20
    }
  ],
  [
    {
      "teamHistory": [
        "Team Razer",
        "Team Grapht",
        "Team Beast",
        "Team Razer",
        "Team Beast",
        "REJECT"
      ],
      "romanized name": "Keita Ai",
      "nationality": [
        "Japan"
      ],
      "years active": [
        2005,
        null
      ],
      "teams": [
        "REJECT",
        "Team Razer"
      ],
      "approx. total winnings": 420965,
      "games": [
        "Street Fighter",
        "Virtua Fighter",
        "Street Fighter X Tekken",
        "SoulCalibur"
      ],
      "achievements": [
        "Super Battle Opera 2005 VF4",
        "Super Battle Opera 2008 VF5",
        "World Cyber Games 2009",
        "Evolution Championship Series 2011",
        "Evolution Championship Series 2012 VF5FS",
        "Super Battle Opera 2012 SSFIV:AE",
        "Topanga League 2",
        "Sega Cup 2013",
        "Sega Cup 2014",
        "DreamHack 2014 Winter",
        "Milan Games Week 2015",
        "E-Sports Festival Hong Kong 2018",
        "SEA Major Singapore 2019",
        "Topanga Championship 4",
        "Topanga Championship 6",
        "Blink Respawn 2025 SF6",
        "Street Fighter League Japan 2025"
      ],
      "hasPlayerImage": true,
      "canonicalPlayerName": "Fuudo",
      "playerName": "Fuudo",
      "age": 40
    },
    {
      "teamHistory": [
        "Panda Global",
        "Echo Fox",
        "Team Reciprocity",
        "Panda",
        "Panda Global",
        "FlyQuest"
      ],
      "nationality": [
        "United States"
      ],
      "years active": [
        2016,
        null
      ],
      "approx. total winnings": 623625,
      "games": [
        "Street Fighter",
        "Guilty Gear",
        "Dragon Ball FighterZ",
        "Marvel vs. Capcom",
        "Injustice",
        "Fatal Fury",
        "DNF Duel",
        "BlazBlue",
        "The King of Fighters",
        "Under Night In-Birth",
        "Melty Blood",
        "Mortal Kombat"
      ],
      "achievements": [
        "NorCal Regionals 2017",
        "DreamHack Austin 2017",
        "ELEAGUE Street Fighter V Invitational 2017",
        "Final Round 2019",
        "Street Grand Battle 2019",
        "Combo Breaker 2019",
        "Street Fighter League United States 2019 Season 1",
        "Street Fighter League United States 2019 Season 1 Mid-Season Championship",
        "First Attack 2019 SFV",
        "Community Effort Orlando 2024 SF6",
        "Evolution Championship Series 2024 SF6",
        "Street Fighter League United States 2024"
      ],
      "hasPlayerImage": true,
      "canonicalPlayerName": "Punk",
      "playerName": "Punk",
      "romanized name": null,
      "teams": [
        "FlyQuest"
      ],
      "age": 27
    },
    null
  ],
  [
    {
      "teamHistory": [
        "The Traveling Circus",
        "Mad Catz",
        "Echo Fox",
        "Rohto",
        "REJECT",
        "Hit Box Arcade"
      ],
      "romanized name": "Hajime Taniguchi",
      "nationality": [
        "Japan"
      ],
      "years active": [
        2002,
        null
      ],
      "teams": [
        "REJECT",
        "Rohto",
        "Hit Box Arcade"
      ],
      "approx. total winnings": 738428,
      "games": [
        "Street Fighter",
        "Capcom vs. SNK",
        "The King of Fighters",
        "Tekken",
        "Guilty Gear",
        "BlazBlue",
        "Marvel vs. Capcom",
        "Virtua Fighter",
        "SoulCalibur",
        "Persona",
        "Dead or Alive",
        "Street Fighter X Tekken",
        "Samurai Shodown",
        "Melty Blood"
      ],
      "achievements": [
        "Cooperation Cup 1",
        "Evolution Championship Series 2002 CvS2",
        "Super Battle Opera 2003 CvS2",
        "Super Battle Opera 2005 CFJ",
        "Evolution Championship Series 2007",
        "Community Effort Orlando 2011 MVC3",
        "Community Effort Orlando 2011 SSFIV:AE",
        "Shadowloo Showdown 2013",
        "Id Global Tournament 2014",
        "Canada Cup 2015 USFIV",
        "Street Fighter V Crash",
        "Community Effort Orlando 2016 SFV",
        "South East Asia Major 2016",
        "Evolution Championship Series 2017 SFV",
        "The Brooklyn Beatdown Round 2",
        "RAGE: Byakko Cup",
        "NorCal Regionals 2018",
        "ELEAGUE Street Fighter V Invitational 2018",
        "Tokyo Game Show 2018",
        "Canada Cup 2018 - SFV",
        "NorCal Regionals 2019",
        "Game Over Tournament 2019",
        "Canada Cup 2019 SFV",
        "Topanga Championship 1",
        "Street Fighter League Japan 2021",
        "Topanga World Championship 2023",
        "Street Fighter League Japan 2023",
        "Capcom Pro Tour 2024 Super Premier Japan",
        "Asian Champions League 2025",
        "Street Fighter League Japan 2025"
      ],
      "hasPlayerImage": true,
      "canonicalPlayerName": "Tokido",
      "playerName": "Tokido",
      "age": 40
    },
    {
      "teamHistory": [
        "NASR eSports",
        "REJECT"
      ],
      "nationality": [
        "United Arab Emirates",
        "Jordan"
      ],
      "years active": [
        2016,
        null
      ],
      "approx. total winnings": 490870,
      "games": [
        "Street Fighter"
      ],
      "achievements": [
        "Street Fighter League United States 2020",
        "Street Fighter League United States 2021",
        "Evolution Championship Series 2023 SF6",
        "FAV CUP 2023 Singles",
        "The MIXUP 2024 SF6",
        "Street Fighter League Europe 2024",
        "Street Fighter League Europe 2025"
      ],
      "hasPlayerImage": true,
      "canonicalPlayerName": "AngryBird",
      "playerName": "AngryBird",
      "romanized name": null,
      "teams": [
        "REJECT"
      ],
      "age": 28
    },
    {
      "teamHistory": [
        "Evil Geniuses",
        "Echo Fox",
        "Victrix Pro",
        "SNB",
        "ZETA DIVISION"
      ],
      "romanized name": "Yusuke Momochi",
      "nationality": [
        "Japan"
      ],
      "years active": [
        2007,
        2025
      ],
      "teams": [
        "ZETA DIVISION",
        "Victrix Pro"
      ],
      "approx. total winnings": 287084,
      "games": [
        "Street Fighter",
        "Dragon Ball FighterZ",
        "Street Fighter X Tekken",
        "Marvel vs. Capcom"
      ],
      "achievements": [
        "Super Battle Opera 2009 SFIII3S",
        "Super Battle Opera 2010 SFIV",
        "Seasons Beatings Velocity 2011 SSFIV",
        "South East Asia Major 2014 USFIV",
        "Capcom Cup 2014",
        "SXSW Gaming Fighters Invitational",
        "Evolution Championship Series 2015 USFIV",
        "StunFest 2016 SFV",
        "Street Fighter V Crash",
        "EVO Japan 2019 - SFV",
        "Tokyo Game Show 2019 SFV"
      ],
      "hasPlayerImage": true,
      "canonicalPlayerName": "Momochi",
      "playerName": "Momochi",
      "age": 40
    }
  ]
]
*/

const attempts = 5

export default function GridGame() {
    const [gridPrompt, setGridPrompt] = useState<BoardGridPrompts>(generatePromptGrid(3,3))

    const [boardState, setBoardState] = useState<(PlayerData|null)[][]>(generateBoardState(gridPrompt.columnPrompts.length, gridPrompt.rowPrompts.length))

    const [isWin, setIsWin] = useState(false)
    const [isLose, setIsLose] = useState(false)

    const [curSelectedGrid, setCurSelectedGrid] = useState<number[]|null[]>([null,null])

    const [attemptsRemaining, setAttemptsRemaining] = useState<number>(attempts)
    // Players disallowed from selection since they have been selected before. Based on their canonical name value
    const [removedPlayers, setRemovedPlayers] = useState<string[]>([])

    const handleGridClick = useCallback((rowIndex: number, colIndex: number) => {
        //Disallow selecting other grid while one is open.
        if (curSelectedGrid.every(g => !g)) {
          setCurSelectedGrid([rowIndex, colIndex])
        }
        
    }, [curSelectedGrid])

    const handlePlayerSelect = (player: PlayerData) => {

        const [rowIndex, colIndex] = curSelectedGrid
        if (rowIndex !== null && colIndex !== null) {

            setBoardState(b => {
                const newArr : (PlayerData|null)[][]  = b.reduce((acc: (PlayerData|null)[][], cur:(PlayerData|null)[]) => {
                    return [...acc,
                        cloneDeep(cur)
                    ]
                }, [])

                newArr[rowIndex][colIndex] = player
                
                return newArr
            })

            if (!validateGridAnswer(player, gridPrompt.rowPrompts[rowIndex], gridPrompt.columnPrompts[colIndex])) {
                setAttemptsRemaining(a => a - 1)
            }
            else {
                setRemovedPlayers(s => [...s, player.canonicalPlayerName])
            }

        }

        
        setCurSelectedGrid([null,null])
    }

    const handlePlayerCancel = () => {
        setCurSelectedGrid([null,null])
    }

    useEffect(() => {
        console.log(boardState)
    }, [boardState])

    useEffect(() => {
        if (attemptsRemaining <= 0) {
            setIsLose(true)
        }
    }, [attemptsRemaining])

    useEffect(() => {
        if (
            attemptsRemaining > 0 && 
            boardState.every((rowArr, rowIndex) => rowArr.every((p, colIndex) => {
                return !p ? false : validateGridAnswer(p, gridPrompt.rowPrompts[rowIndex], gridPrompt.columnPrompts[colIndex])
            }))
        ) {
            setIsWin(true)
        }
    }, [attemptsRemaining, boardState])

    return (
        <div className="grid-game-container">
            <div>
                <b>Attempts left:</b> {attemptsRemaining}
            </div>
            <div className="grid-game-board" style = {{gridTemplateColumns: `repeat(${gridPrompt.columnPrompts.length + 2}, minmax(0px, 1fr))`}}>
                <div className = "grid-game-board-empty col"/>
                {
                    gridPrompt.columnPrompts.map(({title}, index) => {
                        return (
                            <div key = {index} className = "grid-game-header col">{title}</div>
                            )
                        })
                }
                <div className = "grid-game-board-empty col"/>

                    <div className = "grid-game-header row">{gridPrompt.rowPrompts[0].title}</div>
                    <GridGameBoard 
                        onClick = {handleGridClick}
                        gridPrompt={gridPrompt}
                        boardState={boardState}
                    />
                    {
                        gridPrompt.rowPrompts.slice(1).map(({title}, index) => {
                            return <>
                            <div className = "grid-game-header row" key = {index}>{title}</div>
                            <div className = "grid-game-board-empty"/>
                            </>
                        })
                    }
 
                    

            </div>
            
            <PlayerSelectModal
                disabled = {isLose || isWin || attemptsRemaining <= 0}
                isOpen = {curSelectedGrid.every(g => g !== null)}
                onSubmit = {handlePlayerSelect}
                onCancel = {handlePlayerCancel}
                removedPlayers = {removedPlayers}
                disallowSelectionFuncs = {(curSelectedGrid.every(g => g !== null) ? [gridPrompt.rowPrompts[curSelectedGrid[0]]?.disallowFunc, gridPrompt.columnPrompts[curSelectedGrid[1]]?.disallowFunc] : [null,null]) as ((PlayerData: PlayerData) => {allowed: boolean, text: string} | null)[]}
            />

            <OutcomeModal 
              isWin = {isWin}
              isLose= {isLose}
            />
                
        </div>
                    

    )

    
}