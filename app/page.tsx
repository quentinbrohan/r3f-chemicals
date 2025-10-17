"use client"

import DOM from "@/components/DOM"
import GlobalScene from "@/components/GlobalScene"
import { MonitorsStage } from "@/components/MonitorsStage"

export default function Home() {

  return (
    <>
      <DOM />
      <GlobalScene>
        <MonitorsStage />
      </GlobalScene>
    </>
  )
}
