'use client'
import { useTrackContext } from '@/lib/track.wrapper';
import { useHasMounted } from '@/utils/customHook';
import { Container } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import { useEffect, useRef } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const AppFooter = () => {
      const hasMounted = useHasMounted();
      const playerRef = useRef(null);
      const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;
      useEffect(() => {
            if (playerRef?.current) {
                  if (currentTrack?.isPlaying) {
                        //@ts-ignore
                        playerRef.current.audio.current.play();
                  } else {
                        //@ts-ignore
                        playerRef.current.audio.current.pause();
                  }
            }
      }, [currentTrack.isPlaying]);
      if (!hasMounted) return (<></>)//fragment
      return (
            <div style={{ marginTop: 50 }}>
                  <AppBar position="fixed"
                        sx={{
                              top: 'auto', bottom: 0,
                              background: "#f2f2f2"
                        }}
                  >
                        <Container sx={{ display: "flex", gap: 20, ".rhap_main .rhap_controls-section": { gap: "20px" } }}>
                              <AudioPlayer
                                    ref={playerRef}
                                    onPause={() => {
                                          setCurrentTrack({ ...currentTrack, isPlaying: false })
                                    }}
                                    onPlay={() => {
                                          setCurrentTrack({ ...currentTrack, isPlaying: true })
                                    }}
                                    layout="horizontal-reverse"
                                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${currentTrack.trackUrl}`}
                                    volume={0.5}
                                    style={{
                                          boxShadow: "unset",
                                          background: "#f2f2f2"
                                    }}
                              />
                              <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "start",
                                    justifyContent: "center",
                                    minWidth: 100
                              }}>
                                    <div style={{ color: "#ccc" }}>{currentTrack?.uploader?.name}</div>
                                    <div style={{ color: "black" }}>{currentTrack?.title}</div>
                              </div>
                        </Container>
                  </AppBar>
            </div>
      )
}

export default AppFooter;