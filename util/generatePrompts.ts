import { GridPrompt , BoardGridPrompts} from "@/types/gridPrompt";
import { PlayerData } from "@/types/player";

const promptList : GridPrompt[] = [
    {
        "title": "Older than Tokido", 
        validationFunc: () => true, 
        disallowFunc: (p:PlayerData) => {
            if (!p.age) {
                return { allowed: false, text:"this user does not have an age in their data"}
            }
            else if (p.playerName === "Tokido") {
                return { allowed: false, text:"you know Tokido is not older than Tokido right?"}
            }
            else return { allowed: true, text:""}
        }
    },
    {"title": "More than $100,000 earning", validationFunc: (p:PlayerData) => p["approx. total winnings"] > 100000 },
    {"title": "Won an EVO", validationFunc: (p:PlayerData) => p.achievements.some(a => a.startsWith("Evolution Championship Series"))},
    {"title": "Played for Team REJECT", validationFunc: (p:PlayerData) => p.teamHistory.includes("REJECT")},
    {"title": "Is American", validationFunc: (p:PlayerData) => p.nationality.includes("United States")},
    {"title": "Is Japanese", validationFunc: (p:PlayerData) => p.nationality.includes("Japan")}
]


export const generatePromptGrid = (rowLength: number, colLength: number): BoardGridPrompts => {
    return {
        rowPrompts: [promptList[0],promptList[1],promptList[2]],
        columnPrompts: [promptList[3],promptList[4],promptList[5]]
    }
}