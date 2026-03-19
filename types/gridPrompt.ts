import {PlayerData} from "./player"

export type GridPrompt = {
    "title": string,
    "validationFunc": (playerData: PlayerData, allPlayerData: PlayerData[]) => boolean,
    "disallowFunc"?: (PlayerData: PlayerData) => {
        allowed: boolean,
        text: string
    }
}

export type BoardGridPrompts = {
        rowPrompts: GridPrompt[],
        columnPrompts: GridPrompt[],
    }
