import WaveTrack from "@/components/track/wave.track";
import { sendRequest } from "@/utils/api";
// import { getServerSession } from "next-auth/next";

// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
      params: Promise<{ slug: string }>
      searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
      { params, searchParams }: Props,
      parent: ResolvingMetadata
): Promise<Metadata> {
      const temp = (await params)?.slug?.split(".html");
      const temp1 = temp[0]?.split("-");
      const id = temp1[temp1.length - 1];


      // fetch post information
      const res = await sendRequest<IBackendRes<ITrackTop>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${id}`,
            method: "GET",
      })
      return {
            title: res.data?.title,
            description: res.data?.description,
            openGraph: {
                  title: 'Truong Clone SoundCloud',
                  description: 'personal project',
                  type: 'website',
                  images: [`https://logos-world.net/wp-content/uploads/2020/10/SoundCloud-Logo-700x394.png`],
            },
      }
}

const DetailsTrackPage = async (props: Props) => {
      // const session = await getServerSession(authOptions);
      const { params } = props;
      const temp = (await params)?.slug?.split(".html");
      const temp1 = temp[0]?.split("-");
      const id = temp1[temp1.length - 1];

      const res = await sendRequest<IBackendRes<ITrackTop>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${id}`,
            method: "GET",
            nextOption: { cache: "no-store" }
      })
      const commentRes = await sendRequest<IBackendRes<IModelPaginate<ITrackComment>>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/comments`,
            method: "POST",
            queryParams: {
                  current: 1,
                  pageSize: 10,
                  trackId: id,
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