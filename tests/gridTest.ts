import {promptTemplate} from "../util/generatePrompts"
import { uniqBy } from "lodash"

const checkShortHand = () => {
    return (Object.entries(promptTemplate).length) === (uniqBy(Object.entries(promptTemplate), "shorthand").length)
}