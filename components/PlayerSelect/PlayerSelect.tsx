'use client'
import { useEffect, useState } from "react";

import { PlayerData } from "@/types/player";
import playerDatas from "../../datas/playerData.json"
import { uniqBy } from "lodash";
import Select from "react-select";

export default function PlayerSelect({
  onChange,
  currentPlayer
} : {
  onChange : (playerName: PlayerData|null) => void
  currentPlayer: PlayerData | null
}) {

  const [curVal, setCurVal] = useState<any>(null)

  const handleSelect = (value: any) => {
    setCurVal(value)
  }



  useEffect(() => {
    onChange(curVal?.value ?? null)
  },[onChange, curVal])

  return (
    <div className = "player-select-container">
         <Select
                options = {
                    uniqBy(playerDatas, "canonicalPlayerName").sort(({playerName : avalue},{playerName: bvalue}) => avalue.localeCompare(bvalue)).map((playerData)=> ({
                        value: playerData,
                        label: playerData.playerName
                    })) 
                }
                onChange = {handleSelect}
                className = "selector"
                value = {curVal}
            />
    </div>
  );
}
