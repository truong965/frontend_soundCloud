// hooks/useFileUpload.ts
import { useState, useCallback } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useToast } from '@/utils/toast';

interface UploadOptions {
      targetType: 'tracks' | 'images';
      onProgress?: (percent: number) => void;
      timeout?: number;
}

export const useFileUpload = () => {
      const { data: session } = useSession();
      const toast = useToast();
      const [uploading, setUploading] = useState(false);

      const uploadFile = useCallback(async (
            file: File,
            options: UploadOptions
      ): Promise<string | null> => {
            if (!session?.access_token) {
                  toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
                  return null;
            }

            setUploading(true);
            const formData = new FormData();
            formData.append('fileUpload', file);

            try {
                  const res = await axios.post(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/upload`,
                        formData,
                        {
                              headers: {
                                    Authorization: `Bearer ${session.access_token}`,
                                    "target_type": options.targetType
                              },
                              timeout: options.timeout || 60000,
                              onUploadProgress: (progressEvent) => {
                                    if (options.onProgress && progressEvent.total) {
                                          const percent = Math.floor(
                                                (progressEvent.loaded * 100) / progressEvent.total
                                          );
                                          options.onProgress(percent);
                                    }
                              }
                        }
                  );

                  toast.success("Upload thành công!");
                  return res.data.data.fileName;
            } catch (err: any) {
                  console.error("Upload Error:", err);
                  toast.error(err?.response?.data?.message || "Upload thất bại");
                  return null;
            } finally {
                  setUploading(false);
            }
      }, [session, toast]);

      return { uploadFile, uploading };
};