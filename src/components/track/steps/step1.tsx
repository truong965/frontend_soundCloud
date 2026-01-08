// components/steps/step1.tsx
import { FileWithPath, useDropzone } from 'react-dropzone';
import "./theme.css";
import { useCallback } from 'react';
import { UploadButton } from '../../UploadButton';
import { useFileUpload } from '@/hooks/useFileUpload';

interface Step1Props {
      setValue: (v: number) => void;
      setTrackUpload: (upload: any) => void;
      trackUpload: {
            fileName: string;
            percent: number;
            uploadedTrackName: string;
      };
}

const Step1 = ({ setValue, setTrackUpload, trackUpload }: Step1Props) => {
      const { uploadFile } = useFileUpload();

      const onDrop = useCallback(async (acceptedFiles: FileWithPath[]) => {
            if (acceptedFiles.length === 0) return;

            const audio = acceptedFiles[0];

            // Chuyển sang tab 2 ngay lập tức
            setValue(1);

            // Cập nhật tên file
            setTrackUpload({
                  ...trackUpload,
                  fileName: audio.name,
                  percent: 0
            });

            // Upload file với progress tracking
            const uploadedFileName = await uploadFile(audio, {
                  targetType: 'tracks',
                  onProgress: (percent) => {
                        setTrackUpload((prev: any) => ({
                              ...prev,
                              fileName: audio.name,
                              percent
                        }));
                  }
            });

            // Cập nhật tên file đã upload
            if (uploadedFileName) {
                  setTrackUpload((prev: any) => ({
                        ...prev,
                        uploadedTrackName: uploadedFileName
                  }));
            }
      }, [uploadFile, setValue, setTrackUpload, trackUpload]);

      const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
            onDrop,
            accept: { 'audio/mpeg': ['.mp3'] },
            maxFiles: 1
      });

      const files = acceptedFiles.map((file: FileWithPath) => (
            <li key={file.path}>
                  {file.path} - {(file.size / 1024 / 1024).toFixed(2)} MB
            </li>
      ));

      return (
            <section className="container">
                  <div {...getRootProps({ className: 'dropzone' })}>
                        <input {...getInputProps()} />
                        <UploadButton
                              label="Upload files"
                              onChange={() => { }} // Dropzone handles this
                        />
                        <p>Drag 'n' drop some files here, or click to select files</p>
                  </div>
                  <aside>
                        <h4>Files</h4>
                        <ul>{files}</ul>
                  </aside>
            </section>
      );
};

export default Step1;