'use client'
import { Settings } from "@/types/settings";
import { cloneDeep, uniq } from "lodash";
import { useState } from "react";
import Select from "react-select";
import playerData from "../../datas/playerData.json"


const allGames = uniq(playerData.map(({games}) => games).flat())
const allNationalities= uniq(playerData.map(({nationality}) => nationality).flat())

export default function SettingModal({
    settings,
    isVisible,
    onSave,
    onClose,
    getDefaultSetting
} : {
    settings: Settings
    isVisible: boolean
    onSave: (setting: any) => any
    onClose: () => any,
    getDefaultSetting: () => Settings
}) {

    const [curSetting, setCurSetting] = useState<Settings>(cloneDeep(settings))

    const handleGameCheck = (e: any) => {
        const {checked, value}= e.target

        setCurSetting(cur => {
            const curAllowedGames = cur?.allowedGames ?? allGames
            let newAllowedGames
            if (checked) {
                newAllowedGames = uniq([...curAllowedGames, value ])
            }
            else {
                newAllowedGames = curAllowedGames.filter(game => game !== value)
            }

            if (newAllowedGames.length === allGames.length) {
                return {
                    ...cur,
                    allowedGames: null
                } 
            }
            return {
                ...cur,
                allowedGames: newAllowedGames
            } 

        })
        
    }

    const handleAllGameCheck = (e: any) => {
        if (e.target.checked) setCurSetting(curSetting => ({
            ...curSetting,
            allowedGames: null
        }))
        else {
            setCurSetting(curSetting => ({
            ...curSetting,
            allowedGames: []
        }))
        }
      
    }

    return <div className = "setting-modal" style ={{display: isVisible? "block" : "none" }}>
        
        <div className="setting-button-container">
            <button onClick = {() => {onSave(curSetting);onClose();}}>Save</button>
            <button onClick = {onClose}>Close</button>
            <button onClick = {() => setCurSetting(getDefaultSetting())}>Restore default</button>
        </div>

        

        <div className = "setting-games-container">
            <h4>Allowed games</h4>   
            <div>
                <div>
                    <input type = "checkbox" checked = {!curSetting.allowedGames} onChange={handleAllGameCheck}/>
                    <label>All games</label>
                </div>
            {
                allGames.map(game => <div>
                    <input type = "checkbox" checked = {curSetting.allowedGames?.includes(game) ?? true} onChange={handleGameCheck} value = {game}/>
                    <label>{game}</label>
                </div>)
            }
            </div> 
            
            
        </div>

        
    </div>


}