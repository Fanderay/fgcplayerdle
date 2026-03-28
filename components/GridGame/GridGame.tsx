'use client'
import { BoardGridPrompts } from "@/types/gridPrompt";
import { PlayerData } from "@/types/player";
import { decodeBoardTemplate } from "@/util/generatePrompts";
import { validateGridAnswer } from "@/util/validateAnswer";
import { cloneDeep, fill } from "lodash";
import { Fragment, useCallback, useEffect, useState } from "react";
import GridGameBoard from "../GridGameBoard/GridGameBoard";
import OutcomeModal from "../OutcomeModal/OutcomeModal";
import PlayerSelectModal from "../PlayerSelectModal/PlayerSelectModal";
import "./style.css";

const generateBoardState = (rowLength: number, columnLength: number) => {
  return fill(new Array(columnLength), fill(new Array(rowLength), null))
}


const attempts = 5


export default function GridGame({
    gridPrompt,
    style 
}: {
    gridPrompt: BoardGridPrompts,
    style : any
}) {

    const [boardState, setBoardState] = useState<(PlayerData|null)[][]>(generateBoardState(gridPrompt.columnPrompts.length, gridPrompt.rowPrompts.length)) //

    const [isWin, setIsWin] = useState(false)
    const [isLose, setIsLose] = useState(false)

    const [curSelectedGrid, setCurSelectedGrid] = useState<number[]|null[]>([null,null])

    const [shakeAttempt, setShakeAttempt] = useState(false)
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
        let timer: any;
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

                // Set the shake animation
                setShakeAttempt(true)
                timer = setTimeout(() => {
                  setShakeAttempt(false)
                }, 1000)
            }
            else {
                setRemovedPlayers(s => [...s, player.canonicalPlayerName])
            }


        }

        
        setCurSelectedGrid([null,null])
        return () => {
          clearTimeout(timer);
          setShakeAttempt(false)
        };
    }

    const handlePlayerCancel = () => {
        setCurSelectedGrid([null,null])
    }


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
        <div className="grid-game-container" style ={{...style}}>
            <div className = "grid-game-attempts">
                <b>Attempts left:</b> <span className={shakeAttempt ? "shake-text" : ""}>{attemptsRemaining}</span>
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
                            return <Fragment key = {index}>
                            <div className = "grid-game-header row" >{title}</div>
                            <div className = "grid-game-board-empty"/>
                            </Fragment>
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
              playerList={boardState.flat().filter(p=>p !== null)}
            />
                
        </div>
                    

    )

    
}