'use client'
import "./style.css"

import { BoardInfo } from "@/types/boardManagement"


export default function BoardBrowser({
    onSelect,
    browserItems,
    categoryName
}: {
    onSelect: (boardString: string) => void,
    browserItems: BoardInfo[],
    categoryName: string
}) {

    const handleClick = (e: any) => {
        const boardString = e.target.id

        onSelect(boardString)
    }

    return (
        <div className = "board-browser">
            <h2 className = "board-browser-name">
                {categoryName}
            </h2>
            <div className = "board-browser-items">
                {
                    browserItems.map(item => {
                        const {
                            boardId,
                            boardName,
                            boardString,
                            completedCount,
                            attemptedCount,
                            creationTimestamp,
                            authorName
                        } = item
                        return (
                            <div className = "board-browser-item" key = {boardId}>
                                <div className = "board-browser-item-info">
                                    <ul>
                                        <li title ={boardName}>
                                            Board name: {boardName}
                                        </li>
                                        <li className = "minor-info">
                                            {completedCount}/{attemptedCount} completed
                                        </li>
                                        <li className = "minor-info">
                                            Created: {new Date(creationTimestamp).toLocaleDateString()}
                                        </li>
                                        <li className = "minor-info" title = {authorName}>
                                            Author: {authorName}
                                        </li>
                                    </ul>
                                    
                                </div>
                                <button onClick = {handleClick} id = {boardString}>Use board</button>
                            </div>
                        )
                    })
                }

            </div>
            
        </div>
    )
}