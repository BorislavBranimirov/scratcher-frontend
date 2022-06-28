import { useEffect, useState } from 'react';

const usePreviewImage = (file: File | null) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    let blob: string | null = null;
    if (file) {
      blob = URL.createObjectURL(file);
      setPreviewImage(blob);
    } else {
      setPreviewImage(null);
    }

    return () => {
      if (blob) {
        URL.revokeObjectURL(blob);
      }
    };
  }, [file]);

  return [previewImage];
};

export default usePreviewImage;
