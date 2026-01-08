
import WaveTrack from "@/components/track/wave.track";
import { sendRequest } from "@/utils/api";
import { useSearchParams } from "next/navigation";

const DetailsTrackPage = async (props: any) => {
      const { params } = props;
      const res = await sendRequest<IBackendRes<ITrackTop>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${params.slug}`,
            method: "GET",
      })
      return (
            <>
                  <WaveTrack
                        track={res?.data ?? null}
                  />
            </>
      )
}
export default DetailsTrackPage;