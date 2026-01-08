import { sendRequest } from "@/utils/api";
import { FavoriteOutlined, PlayCircleFilledOutlined } from "@mui/icons-material";
import { Chip } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface IProps {
      track: ITrackTop | null;
}
const LikeTrack = (props: IProps) => {
      const { track } = props;
      const { data: session } = useSession();
      const router = useRouter();
      const [trackLikes, setTrackLikes] = useState<ITrackLike[] | null>(null);
      const fetchData = async () => {
            if (session?.access_token) {
                  const res = await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
                        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
                        method: "GET",
                        queryParams: {
                              current: 1,
                              pageSize: 100,
                              sort: "-createdAt"
                        },
                        headers: {
                              Authorization: `Bearer ${session?.access_token}`,
                        },
                  });
                  if (res?.data?.result) {
                        setTrackLikes(res?.data?.result);
                  }

            }
      }
      useEffect(() => {
            fetchData();
      }, [session])
      const handleLikeTrack = async () => {
            await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
                  url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
                  method: "POST",
                  body: {
                        track: track?._id,
                        quantity: trackLikes?.some(t => t._id === track?._id) ? -1 : 1,
                  },
                  headers: {
                        Authorization: `Bearer ${session?.access_token}`,
                  },
            });
            fetchData();
            router.refresh();
      }
      return (<>
            <div style={{ margin: "20px 10px 0 10px", display: "flex", justifyContent: "space-between" }}>
                  <Chip
                        onClick={() => handleLikeTrack()}
                        sx={{ borderRadius: "5px" }}
                        size="medium"
                        variant="outlined"
                        // Logic đổi màu nút: Nếu user đã like track này rồi thì màu đỏ (error), ngược lại màu xám (default)
                        color={trackLikes?.some(t => t._id === track?._id) ? "error" : "default"}
                        clickable
                        icon={<FavoriteOutlined />} label="Like"
                  />
                  <div style={{ display: "flex", width: "100px", gap: "20px", color: "#999" }}>
                        <span style={{ display: "flex", alignItems: "center" }}>
                              <PlayCircleFilledOutlined sx={{ fontSize: "20px" }} />
                              {track?.countPlay}
                        </span>
                        <span style={{ display: "flex", alignItems: "center" }}>
                              <FavoriteOutlined sx={{ fontSize: "20px" }} />
                              {track?.countLike}

                        </span>
                  </div>
            </div>
      </>)
}
export default LikeTrack;