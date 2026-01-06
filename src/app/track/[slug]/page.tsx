
'use client'

import WaveTrack from "@/components/track/wave.track";
import { useSearchParams } from "next/navigation";

const DetailsTrackPage = ({ params }: { params: { slug: string } }) => {
      const searchParams = useSearchParams();
      const search = searchParams.get('audio');
      return (
            <>
                  <span>Detail track</span>
                  <WaveTrack />
            </>
      )
}
export default DetailsTrackPage;