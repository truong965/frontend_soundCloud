'use client'
import Box from '@mui/material/Box';
import * as React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { sendRequest } from '@/utils/api';
import { useToast } from '@/utils/toast';

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
      return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress variant="determinate" {...props} />
                  </Box>
                  <Box sx={{ minWidth: 35 }}>
                        <Typography variant="body2" color="text.secondary">{`${Math.round(
                              props.value,
                        )}%`}</Typography>
                  </Box>
            </Box>
      );
}

function LinearWithValueLabel(props: IProps) {
      return (
            <Box sx={{ width: '100%' }}>
                  <LinearProgressWithLabel value={props.trackUpload.percent} />
            </Box>
      );
}

const VisuallyHiddenInput = styled('input')({
      clip: 'rect(0 0 0 0)',
      clipPath: 'inset(50%)',
      height: 1,
      overflow: 'hidden',
      position: 'absolute',
      bottom: 0,
      left: 0,
      whiteSpace: 'nowrap',
      width: 1,
});

function InputFileUpload(props: any) {
      const toast = useToast();
      const { info, setInfo } = props;
      const { data: session } = useSession();
      const handleUpload = async (image: any) => {
            const formData = new FormData();
            formData.append('fileUpload', image);
            try {
                  const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/upload`,
                        formData, {
                        headers: {
                              Authorization: `Bearer ${session?.access_token}`,
                              "target_type": "images"
                        },

                  })
                  setInfo(({
                        ...info,
                        imgUrl: res.data.data.fileName
                  }))
            } catch (err) {
                  // @ts-ignore
                  toast.error(err?.response?.data?.message);
            }
      }
      return (
            <Button
                  onChange={(e) => {
                        const event = e.target as HTMLInputElement;
                        if (event.files) {
                              handleUpload(event.files[0]);
                        }
                  }}
                  component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                  Upload file
                  <VisuallyHiddenInput type="file" />
            </Button>
      );
}

// --- Component chính ---
interface IProps {
      trackUpload: {
            fileName: string;
            percent: number;
            uploadedTrackName: string;
      }
      setValue: (v: number) => void;
}
interface INewTrack {
      title: string;
      description: string;
      trackUrl: string;
      imgUrl: string;
      category: string;
}


const Step2 = (props: IProps) => {
      const toast = useToast();
      const { data: session } = useSession();
      const [info, setInfo] = useState<INewTrack>({
            title: "",
            description: "",
            trackUrl: "",
            imgUrl: "",
            category: ""
      });
      const { trackUpload, setValue } = props;

      useEffect(() => {
            if (trackUpload && trackUpload.uploadedTrackName) {
                  setInfo({
                        ...info,
                        trackUrl: trackUpload.uploadedTrackName
                  })
            }
      }, [trackUpload])

      const category = [
            {
                  value: 'CHILL',
                  label: 'CHILL',
            },
            {
                  value: 'WORKOUT',
                  label: 'WORKOUT',
            },
            {
                  value: 'PARTY',
                  label: 'PARTY',
            }
      ];
      const handleSubmit = async () => {
            const res = await sendRequest<IBackendRes<ITrackTop[]>>({
                  url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks`,
                  method: "POST",
                  headers: {
                        Authorization: `Bearer ${session?.access_token}`,
                  },
                  body: {
                        title: info.title,
                        description: info.description,
                        trackUrl: info.trackUrl,
                        imgUrl: info.imgUrl,
                        category: info.category,
                  }
            });
            if (res.data) {
                  setValue(0);
                  toast.success("create success");
            } else {
                  toast.error(res?.message);
            }
      }
      return (
            <Box sx={{ width: '100%', mt: 2 }}>
                  {/* Phần Progress Bar */}
                  <Typography gutterBottom>Your uploading track:  {trackUpload.fileName}</Typography>
                  <LinearWithValueLabel trackUpload={trackUpload} setValue={setValue} />

                  {/* Phần Form Layout */}
                  <Grid container spacing={4} sx={{ mt: 2 }}>

                        {/* Cột Trái: Ảnh và Nút Upload */}
                        <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              {/* Placeholder hình vuông màu xám */}
                              <Box
                                    sx={{
                                          width: 200,
                                          height: 200,
                                          bgcolor: '#ccc', // Màu xám như trong hình
                                          mb: 3 // Margin bottom
                                    }}>
                                    {info.imgUrl && <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${info.imgUrl}`}></img>}
                              </Box>
                              {/* Component nút upload có sẵn */}
                              <InputFileUpload setInfo={setInfo} info={info} />
                        </Grid>

                        {/* Cột Phải: Form thông tin */}
                        <Grid item xs={12} sm={8}>
                              <TextField
                                    value={info?.title}
                                    onChange={(e) => setInfo({
                                          ...info,
                                          title: e.target.value,
                                    })}
                                    label="Title"
                                    variant="standard" // Dùng standard để chỉ hiện gạch chân
                                    fullWidth
                                    margin="normal"
                              />

                              <TextField
                                    value={info?.description}
                                    onChange={(e) => setInfo({
                                          ...info,
                                          description: e.target.value,
                                    })}
                                    label="Description"
                                    variant="standard"
                                    fullWidth
                                    margin="normal"
                              />

                              <TextField
                                    value={info?.category}
                                    onChange={(e) => setInfo({
                                          ...info,
                                          category: e.target.value,
                                    })}
                                    select
                                    label="Category"
                                    defaultValue="CHILL"
                                    variant="standard"
                                    fullWidth
                                    margin="normal"
                              >
                                    {category.map((option) => (
                                          <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                          </MenuItem>
                                    ))}
                              </TextField>

                              <Box sx={{ mt: 4 }}>
                                    <Button onClick={() => handleSubmit()} variant="outlined" sx={{ minWidth: '100px' }}>
                                          SAVE
                                    </Button>
                              </Box>
                        </Grid>
                  </Grid>
            </Box>
      )
}

export default Step2;