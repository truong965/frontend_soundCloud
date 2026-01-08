// components/UploadButton.tsx
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

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

interface UploadButtonProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  onChange: (file: File | FileList | null) => void;
}

export const UploadButton = ({
  label = "Upload file",
  accept,
  multiple = false,
  disabled = false,
  onChange
}: UploadButtonProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onChange(multiple ? files : files[0]);
    }
  };

  return (
    <Button
      component="label"
      variant="contained"
      startIcon={<CloudUploadIcon />}
      disabled={disabled}
    >
      {label}
      <VisuallyHiddenInput
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
      />
    </Button>
  );
};