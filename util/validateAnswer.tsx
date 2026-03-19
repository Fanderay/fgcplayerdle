
import { GridPrompt } from "@/types/gridPrompt";
import { PlayerData } from "@/types/player";
import playerData from "../datas/playerData.json";




export const validateGridAnswer = (guess: PlayerData, rowPrompt: GridPrompt, columnPrompt: GridPrompt) => {

    return rowPrompt.validationFunc(guess, playerData) && columnPrompt.validationFunc(guess, playerData)

} 
