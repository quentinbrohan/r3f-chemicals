"use client"

import DOM from "@/components/DOM"
import GlobalScene from "@/components/GlobalScene"
import { MonitorsStage } from "@/components/MonitorsStage"
import { Loader } from "@react-three/drei"
import { useState } from "react"

export default function Home() {
  return (
    <>
      <DOM />
      <GlobalScene postprocessing>
        <MonitorsStage />
      </GlobalScene>
      <Loader  />
    </>
  )
}
