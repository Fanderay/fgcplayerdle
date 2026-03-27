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


export type PromptTemplate = {
    [key: string] : {
        func: (...params: any) => GridPrompt,
        inputTypes: InputType[],
        shorthand: string
    }
}

export type PromptTemplateItem = {
    templateKey: keyof PromptTemplate,
    inputValue: any[]
}

export type PromptTemplateBoard = {
    rowPrompts: PromptTemplateItem[],
    columnPrompts: PromptTemplateItem[]
}

export type InputType = "playerData" | "number" | "string"