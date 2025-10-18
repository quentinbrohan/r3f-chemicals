"use client"

import DOM from "@/components/DOM"
import { MonitorsStage } from "@/components/MonitorsStage"
import { Loader } from "@react-three/drei"
import dynamic from "next/dynamic"
import { Suspense, useState } from "react"

const GlobalScene = dynamic(() => import('@/components/GlobalScene'), {
  ssr: false,
})

export default function Home() {
  return (
    <>
      <DOM />
      <Suspense>
        <GlobalScene postprocessing>
          <MonitorsStage />
        </GlobalScene>
      </Suspense>
      <Loader />
    </>
  )
}
