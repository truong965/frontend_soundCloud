'use client';

import { useWavesurfer } from "@/utils/customHook";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import WaveSurfer, { WaveSurferOptions } from 'wavesurfer.js'
// WaveSurfer hook

const WaveTrack = () => {
      const containerRef = useRef<HTMLDivElement>(null);
      const searchParams = useSearchParams();;
      const fileName = searchParams.get('audio');
      const optionsMemo = useMemo(() => {
            return {
                  waveColor: 'rgb(200, 0, 200)',
                  progressColor: 'rgb(100, 0, 100)',
                  url: `/api?audio=${fileName}`,
            }
      }, []);
      const wavesurfer = useWavesurfer(containerRef, optionsMemo);


      return (<>
            <div ref={containerRef}>

            </div>

      </>)
}
export default WaveTrack;