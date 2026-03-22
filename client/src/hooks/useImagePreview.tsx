import { useState, useEffect } from "react";

interface ImagePreview {
  file: File;
  url: string;
}

export const useImagePreview = () => {
  const [image, setImage] = useState<ImagePreview | null>(null);

  const setFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setImage({
      file,
      url,
    });
  };

  const removeFile = () => {
    if (image?.url) {
      URL.revokeObjectURL(image.url);
    }

    setImage(null);
  };

  useEffect(() => {
    return () => {
      if (image?.url) {
        URL.revokeObjectURL(image.url);
      }
    };
  }, [image]);

  return {
    image,
    setFile,
    removeFile,
  };
};
