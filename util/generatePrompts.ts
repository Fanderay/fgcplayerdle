import { GridPrompt , BoardGridPrompts, InputType, PromptTemplate, PromptTemplateBoard} from "@/types/gridPrompt";
import { PlayerData } from "@/types/player";
import { error } from "console";
import {find} from "lodash"
import playerData from "../datas/playerData.json"


const encodeBase64Url = (string: Buffer): string => {
    return string.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

const decodeBase64Url = (string: string): string => {
    return Buffer.from(string.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')
}

export const generatePromptGrid = (rowLength: number, colLength: number): BoardGridPrompts => {
    return {
        rowPrompts: [
            promptTemplate.olderThanPlayer.func(find(playerData, (p: PlayerData) => p.canonicalPlayerName === "Tokido") as PlayerData),
            promptTemplate.moreThanEarning.func(100000),
            promptTemplate.achievementIn.func("Evolution Championship Series", "an EVO")
        ],
        columnPrompts: [
            promptTemplate.inTeam.func("REJECT", "team REJECT"),
            promptTemplate.fromCountry.func("United States", "American"),
            promptTemplate.fromCountry.func("Japan", "Japanese")
        ]
    }
}


export const promptTemplate : PromptTemplate = {
    "olderThanPlayer" : {
        func : (inputPlayer: PlayerData) => {
            if (!(inputPlayer?.age ?? null)) throw "promptTemplate: olderThanPlayer - Must specify a player with an age value"
            return {
                "title": `Older than ${inputPlayer.playerName}`, 
                validationFunc: (p:PlayerData) => {
                    return (p.age ?? 0) > (inputPlayer?.age  ?? 0)
                }, 
                disallowFunc: (p:PlayerData) => {
                    if (!p.age) {
                        return { allowed: false, text:"this user does not have an age in their data"}
                    }
                    else if (p.canonicalPlayerName === inputPlayer.canonicalPlayerName) {
                        return { allowed: false, text:`you know ${inputPlayer.playerName} is not older than ${inputPlayer.playerName} right?`}
                    }
                    else return { allowed: true, text:""}
                }
            }
        },
        inputTypes: ["playerData"],
        shorthand: "op"
    } ,
    "youngerThanPlayer" : {
        func: (inputPlayer: PlayerData) => {
            if (!(inputPlayer?.age ?? null)) throw "promptTemplate: youngerThanPlayer - Must specify a player with an age value"
            return {
                "title": `Younger than ${inputPlayer.playerName}`, 
                validationFunc: (p:PlayerData) => {
                    return (p.age ?? 0) < (inputPlayer?.age  ?? 0)
                },
                disallowFunc: (p:PlayerData) => {
                    if (!p.age) {
                        return { allowed: false, text:"this user does not have an age in their data"}
                    }
                    else if (p.canonicalPlayerName === inputPlayer.canonicalPlayerName) {
                        return { allowed: false, text:`you know ${inputPlayer.playerName} is not older than ${inputPlayer.playerName} right?`}
                    }
                    else return { allowed: true, text:""}
                }
            }
        },
        inputTypes: ["playerData"],
        shorthand: "yp"
    },
    "moreThanEarning": {
        func :  (inputValue: number) => {
            return {
                "title": `More than $${inputValue.toLocaleString()} earning`,
                validationFunc: (p:PlayerData) => p["approx. total winnings"] > inputValue
            }
        },
        inputTypes: ["number"],
        shorthand: "me"
    },
    "lessThanEarning": {
        func: (inputValue: number) => {
            return {
                "title": `Less than $${inputValue.toLocaleString()} earning`,
                validationFunc: (p:PlayerData) => p["approx. total winnings"] < inputValue
            }
        },
        inputTypes: ["number"],
        shorthand: "le"
    },
    "achievementIn" : { 
        func :(tournamentPrefix: string, tournamentName: string) => {
            return {
                "title": `Won ${tournamentName}`,
                validationFunc: (p:PlayerData) => p.achievements.some(a => a.startsWith(tournamentPrefix))
            }
        },
        inputTypes: ["string", "string"],
        shorthand: "ai"
    },
    "inTeam" : {
        func :(teamNameValue: string,teamName: string) => {
            return {
                "title": `Currently in ${teamName}`,
                validationFunc: (p:PlayerData) => p.teams.includes(teamNameValue)
            }
        },
        inputTypes: ["string", "string"],
        shorthand: "it"
    },
    "inTeamHistory" : {
        func :(teamNameValue: string, teamName: string) => {
            return {
                "title": `Played for ${teamName}`,
                validationFunc: (p:PlayerData) => p.teams.includes(teamNameValue)
            }
        },
        inputTypes: ["string", "string"],
        shorthand: "ith"
    },
    "fromCountry" : {
        func: (countryValue: string, nationalityName: string) => {
            return {
                "title": `Is ${nationalityName}`, 
                validationFunc: (p:PlayerData) => p.nationality.includes(countryValue)
            }
        },
        inputTypes: ["string", "string"],
        shorthand: "fc"
    }

}

const generatePrompt = (promptText: "string", promptTemplateName: string) => {

}

const encodePrompt = (promptKey: keyof PromptTemplate, promptInputs: any[]) : string => {

    if (promptTemplate?.[promptKey]) {
        
        const encodedPromptKey = encodeBase64Url(Buffer.from(promptTemplate[promptKey].shorthand as string, 'utf8'))

        const inputTypes = promptTemplate[promptKey].inputTypes

        if (inputTypes.length !== promptInputs.length) {
            throw `Invalid input length for ${promptKey}. Got ${promptInputs.length}. Expecting: ${inputTypes.length}`
        }

        const prompts = promptInputs.map((input, index) => {
            const inputType = inputTypes?.[index] ?? null
            if (inputType) {
                if (typeof(input) === "string" && inputType === "string") {
                    return encodeBase64Url(Buffer.from(input, 'utf8'))
                }
                else if (typeof(input) === "number" && inputType === "number") {
                    return encodeBase64Url(Buffer.from(input.toString(), 'utf8'))
                }
                else if (typeof(input) === "string" && inputType === "playerData") {
                    const playerFromName = find(playerData, (p: PlayerData) => p.canonicalPlayerName === input)
                    if (playerFromName) return  encodeBase64Url(Buffer.from(input, 'utf8'))
                    else throw `Invalid player name, cannot be found: ${input}`
                    
                }
                else throw `Invalid inputs type: inputValue: ${input} inputType: ${inputType}`
            }
            else throw `Invalid inputs: inputValue: ${input} inputType: ${inputType}`
        })
        

        return `${encodedPromptKey}:${prompts.join("|")}`
    }
    else throw `Invalid promptkey ${promptKey}`

}

export const encodeBoardTemplate = (promptTemplateBoard : PromptTemplateBoard) : string => {
    const rowPrompt = promptTemplateBoard.rowPrompts
    const columnPrompt = promptTemplateBoard.columnPrompts

    const encodedRowPrompts = rowPrompt.map(template => encodePrompt(template.templateKey, template.inputValue)).join("?")
    const encodedColPrompts = columnPrompt.map(template => encodePrompt(template.templateKey, template.inputValue)).join("?")

    return `${encodedRowPrompts}!${encodedColPrompts}`
}

export const decodeBoardTemplate = (encodedTemplateBoard: string) : BoardGridPrompts => {
    // Rows and col are split by "!"
    // Prompts are split by "?"
    // Each prompt are in templateKey":"input1"|"input2

    const boardSplit = encodedTemplateBoard.split("!")
    const encodedRowPrompts = boardSplit[0]
    const encodedColPrompts = boardSplit[1]

    if (encodedRowPrompts && encodedColPrompts) {
        const decodedRowPrompt = encodedRowPrompts.split("?").map(encodedPrompt => decodePrompt(encodedPrompt))
        const decodedColPrompt = encodedColPrompts.split("?").map(encodedPrompt => decodePrompt(encodedPrompt))

        return {
            rowPrompts: decodedRowPrompt,
            columnPrompts: decodedColPrompt
        }
    }
    else throw `Invalid board split: ${encodedTemplateBoard}`
}

const decodePrompt = (encodedString: string) : GridPrompt => {
    // Each prompt are in templateKey":"input1"|"input2
    const splitPrompt = encodedString.split(":")
    const encodedTemplateKey = splitPrompt?.[0]

    if (!encodedTemplateKey) throw `Invalid templateKey: ${encodedTemplateKey} for ${encodedString}`

    const templateKey = decodeBase64Url(encodedTemplateKey)

    const templateData = find(Object.values(promptTemplate), ({shorthand}) => shorthand === templateKey)

    if (templateData && splitPrompt[1]) {
        const encodedInputValues = splitPrompt[1].split("|")
        const inputTypes = templateData.inputTypes

        if (encodedInputValues.length !== inputTypes.length) throw `Invalid length of inputTypes. Got ${ encodedInputValues.length}. Expecting: ${inputTypes.length}`

        // Validate typing of the input and map it back to expected values
        const decodedInputValues = encodedInputValues.map((encodedValue, index) => {
            const decodedRawValue = decodeBase64Url(encodedValue)
            const inputType = inputTypes[index]

            if (!decodedRawValue) throw `Invalid decoded input value : ${decodedRawValue}`

            if (inputType === "string") return decodedRawValue
            else if (inputType === "number") {
                const parsedInput = parseInt(decodedRawValue)
                if (isNaN(parsedInput)) `Invalid decoded input value : ${decodedRawValue}`
                else return parsedInput
            }
            else if (inputType === "playerData") {
                const player = find(playerData, (p: PlayerData) => p.canonicalPlayerName === "Tokido")
                if (!player) `Invalid player name. Cannot be found : ${decodedRawValue}`
                else return player
            }
            else throw `Invalid input type: ${inputType}`
        })

        const templateFunc = templateData.func

        
        const gridPrompt = templateFunc(...decodedInputValues)

        return gridPrompt 
        
    }
    else throw `Invalid templateKey: ${templateKey} or inputValues for ${encodedString}`

}