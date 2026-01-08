// components/steps/step2.tsx
'use client'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { sendRequest } from '@/utils/api';
import { useToast } from '@/utils/toast';
import { UploadButton } from '../../UploadButton';
import { useFileUpload } from '@/hooks/useFileUpload';

interface Step2Props {
      trackUpload: {
            fileName: string;
            percent: number;
            uploadedTrackName: string;
      };
      setValue: (v: number) => void;
}

interface TrackInfo {
      title: string;
      description: string;
      trackUrl: string;
      imgUrl: string;
      category: string;
}

const CATEGORIES = [
      { value: 'CHILL', label: 'CHILL' },
      { value: 'WORKOUT', label: 'WORKOUT' },
      { value: 'PARTY', label: 'PARTY' }
];

const Step2 = ({ trackUpload, setValue }: Step2Props) => {
      const toast = useToast();
      const { data: session } = useSession();
      const { uploadFile, uploading } = useFileUpload();

      const [info, setInfo] = useState<TrackInfo>({
            title: "",
            description: "",
            trackUrl: "",
            imgUrl: "",
            category: ""
      });

      // Tự động cập nhật trackUrl khi upload xong
      useEffect(() => {
            if (trackUpload?.uploadedTrackName) {
                  setInfo(prev => ({
                        ...prev,
                        trackUrl: trackUpload.uploadedTrackName
                  }));
            }
      }, [trackUpload.uploadedTrackName]);

      // Handle image upload
      const handleImageUpload = async (file: File) => {
            const uploadedFileName = await uploadFile(file, {
                  targetType: 'images'
            });

            if (uploadedFileName) {
                  setInfo(prev => ({
                        ...prev,
                        imgUrl: uploadedFileName
                  }));
            }
      };

      // Handle form submit
      const handleSubmit = async () => {
            // Validation
            if (!info.title || !info.description || !info.category) {
                  toast.error("Vui lòng điền đầy đủ thông tin");
                  return;
            }

            if (!info.trackUrl) {
                  toast.error("Chưa có file track được upload");
                  return;
            }

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
                  // Reset form
                  setInfo({
                        title: "",
                        description: "",
                        trackUrl: "",
                        imgUrl: "",
                        category: ""
                  });
                  setValue(0);
                  toast.success("Tạo track thành công!");
            } else {
                  toast.error(res?.message || "Có lỗi xảy ra");
            }
      };

      // Handle input change
      const handleInputChange = (field: keyof TrackInfo) => (
            e: React.ChangeEvent<HTMLInputElement>
      ) => {
            setInfo(prev => ({
                  ...prev,
                  [field]: e.target.value
            }));
      };

      return (
            <Box sx={{ width: '100%', mt: 2 }}>
                  {/* Progress Bar */}
                  <Typography gutterBottom>
                        Your uploading track: {trackUpload.fileName}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                              <LinearProgress
                                    variant="determinate"
                                    value={trackUpload.percent}
                              />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                              <Typography variant="body2" color="text.secondary">
                                    {`${Math.round(trackUpload.percent)}%`}
                              </Typography>
                        </Box>
                  </Box>

                  {/* Form Layout */}
                  <Grid container spacing={4}>
                        {/* Left Column: Image Upload */}
                        <Grid
                              item
                              xs={12}
                              sm={4}
                              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                        >
                              <Box
                                    sx={{
                                          width: 200,
                                          height: 200,
                                          bgcolor: '#f5f5f5',
                                          mb: 3,
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          overflow: 'hidden',
                                          borderRadius: 1,
                                          border: '1px solid #eee'
                                    }}
                              >
                                    {info.imgUrl ? (
                                          <Box
                                                component="img"
                                                sx={{
                                                      width: '100%',
                                                      height: '100%',
                                                      objectFit: 'cover'
                                                }}
                                                alt="Track cover"
                                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${info.imgUrl}`}
                                          />
                                    ) : (
                                          <Typography color="text.secondary">No image</Typography>
                                    )}
                              </Box>
                              <UploadButton
                                    accept="image/*"
                                    onChange={(file) => handleImageUpload(file as File)}
                                    disabled={uploading}
                              />
                        </Grid>

                        {/* Right Column: Track Information */}
                        <Grid item xs={12} sm={8}>
                              <TextField
                                    value={info.title}
                                    onChange={handleInputChange('title')}
                                    label="Title"
                                    variant="standard"
                                    fullWidth
                                    margin="normal"
                                    required
                              />

                              <TextField
                                    value={info.description}
                                    onChange={handleInputChange('description')}
                                    label="Description"
                                    variant="standard"
                                    fullWidth
                                    margin="normal"
                                    required
                                    multiline
                                    rows={3}
                              />

                              <TextField
                                    value={info.category}
                                    onChange={handleInputChange('category')}
                                    select
                                    label="Category"
                                    variant="standard"
                                    fullWidth
                                    margin="normal"
                                    required
                              >
                                    {CATEGORIES.map((option) => (
                                          <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                          </MenuItem>
                                    ))}
                              </TextField>

                              <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                                    <Button
                                          onClick={handleSubmit}
                                          variant="contained"
                                          disabled={trackUpload.percent < 100 || uploading}
                                    >
                                          SAVE
                                    </Button>
                                    <Button
                                          onClick={() => setValue(0)}
                                          variant="outlined"
                                    >
                                          CANCEL
                                    </Button>
                              </Box>
                        </Grid>
                  </Grid>
            </Box>
      );
};

export default Step2;