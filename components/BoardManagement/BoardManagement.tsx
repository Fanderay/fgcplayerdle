'use client'
import { BoardInfo } from "@/types/boardManagement"
import BoardBrowser from "./components/BoardBrowser/BoardBrowser"
import BoardCreation from "./components/BoardCreation/BoardCreation"
import "./style.css"
import { useState } from "react"

const featuredBoards: BoardInfo[] = [
    {
        boardId: "123",
        boardName: "A board of all time",
        boardString: "b3A:VG9raWRv?bWU:MTAwMDAw!aXQ:UkVKRUNU|VGVhbSBSRUpFQ1Q?ZmM:SmFwYW4|SmFwYW5lc2U",
        completedCount : 2,
        attemptedCount: 5,
        creationTimestamp: 1774667787,
        authorName: "Whale"
    },
    {
        boardId: "1234",
        boardName: "A second board of all time",
        boardString: "b3A:VG9raWRv?bWU:MTAwMDAw!aXQ:UkVKRUNU|VGVhbSBSRUpFQ1Q?ZmM:SmFwYW4|SmFwYW5lc2U",
        completedCount : 2,
        attemptedCount: 5,
        creationTimestamp: 1774667787,
        authorName: "Whale"
    }
]

const communityBoards: BoardInfo[] = [
    {
        boardId: "123",
        boardName: "A community board of all time",
        boardString: "b3A:VG9raWRv?bWU:MTAwMDAw!aXQ:UkVKRUNU|VGVhbSBSRUpFQ1Q?ZmM:SmFwYW4|SmFwYW5lc2U",
        completedCount : 2,
        attemptedCount: 5,
        creationTimestamp: 1774667787,
        authorName: "Whale"
    }
]

export default function BoardManagement({
    onBoardChange,
    onBack
}:{
    onBoardChange: (boardString: string) => void,
    onBack: () => void
}) {

    const [selectedMenu, setSelectedMenu] = useState("featuredBoards")
    const [boardBrowserItems, setBoardBrowserItems] = useState<BoardInfo[]>(featuredBoards)

    const handleSelection = (e: any) => {
        const menuItem = e.target.id

        setSelectedMenu(menuItem)

        if (menuItem === "communityBoards") {
            setBoardBrowserItems(communityBoards)
        }
        else if (menuItem === "featuredBoards") setBoardBrowserItems(featuredBoards)
    }


    return (
        <div className = "board-management-modal">
            <div className = "menu-item">
                <button onClick = {handleSelection} id = {"featuredBoards"} disabled ={selectedMenu==="featuredBoards"}>
                    Featured boards
                </button>
                <button onClick = {handleSelection} id = {"communityBoards"} disabled ={selectedMenu==="communityBoards"}>
                    Community boards
                </button>
                <button onClick = {handleSelection} id = {"boardCreation"} disabled ={selectedMenu==="boardCreation"}>
                    Create your own board
                </button>
            </div>
            <div>
                {
                    selectedMenu === "boardCreation" ?
                        <BoardCreation/>
                        :
                        <BoardBrowser 
                            onSelect = {onBoardChange} 
                            browserItems = {boardBrowserItems} 
                            categoryName = {selectedMenu==="featuredBoards" ? "Featured boards" : "Community boards"}
                        />

                }

            </div>
            
            <button onClick={onBack}>Back</button>
        </div>
    )
}