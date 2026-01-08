
import CommentTrack from "@/components/track/comment.track";
import WaveTrack from "@/components/track/wave.track";
import { sendRequest } from "@/utils/api";
import { useSearchParams } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
const DetailsTrackPage = async (props: any) => {

      const session = await getServerSession(authOptions);
      const { params } = props;
      const res = await sendRequest<IBackendRes<ITrackTop>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${params.slug}`,
            method: "GET",
            nextOption: { cache: "no-store" }
      })
      const commentRes = await sendRequest<IBackendRes<IModelPaginate<ITrackComment>>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/comments`,
            method: "POST",
            queryParams: {
                  current: 1,
                  pageSize: 10,
                  trackId: params.slug,
                  sort: "-createdAt"
            }
      });


      return (
            <>
                  <WaveTrack
                        track={res?.data ?? null}
                        comments={commentRes?.data?.result ?? []}
                  />

            </>
      )
}
export default DetailsTrackPage;