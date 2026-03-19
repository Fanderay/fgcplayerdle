import "./style.css"

export default function OutcomeModal({
    isWin,
    isLose
}: {
    isWin: boolean,
    isLose: boolean
}) {

    return (
        <div className = "outcome-modal" style ={{visibility: isWin || isLose ? "visible" : "hidden"}}>
            <h2>{isWin ? "You won" : "You lose"}</h2>
            <h4>{isWin ? "Thanks for playing" : "Better luck next time"}</h4>

            <div>
                Hi, I've only created one board so far. Check back in the future once this is done
            </div>

            <div>
                Maybe some kind of stat about your chosen players.
            </div>
             <div>
                Coming soon! (Probably not)
            </div>
        </div>
    )

}