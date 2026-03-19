'use client'
import { BoardGridPrompts } from "@/types/gridPrompt";
import { PlayerData } from "@/types/player";
import GridGameGrid from "../GridGame/GridGameGrid";
import "./style.css";



export default function GridGameBoard({
    onClick,
    gridPrompt,
    boardState
}: {
    onClick :  (rowIndex: number, colIndex: number) => void,
    gridPrompt: BoardGridPrompts,
    boardState: (PlayerData|null)[][]
}) {

    

    return (
        <>
        <div 
            className ="grid-game-board-container" 
            style = {{
                gridArea: `span ${gridPrompt.rowPrompts.length} / span  ${gridPrompt.columnPrompts.length} `,
                gridTemplateColumns: `repeat(${gridPrompt.columnPrompts.length}, minmax(0px, 1fr))`
            }}
            >
            {
                boardState.map((rows, rowIndex) => {
                    return rows.map((curAnswer, colIndex) => {
                        const {validationFunc : rowValidationFunc, disallowFunc : rowDisallowFunc} = gridPrompt.rowPrompts[rowIndex]
                        const {validationFunc : colValidationFunc, disallowFunc : colDisallowFunc} = gridPrompt.columnPrompts[colIndex]
                         return (
                            <GridGameGrid 
                                key = {rowIndex+colIndex}
                                className = "grid-game-item"
                                gridValidationFuncs = {[colValidationFunc, rowValidationFunc]}
                                onClick = {onClick}
                                rowIndex={rowIndex}
                                colIndex={colIndex}
                                curAnswer={curAnswer}
                            />
                        )
                    })
                })
            }
        
        </div>
        <div className = "grid-game-board-empty"/>
        </>
    )
                    
             
            
    
}