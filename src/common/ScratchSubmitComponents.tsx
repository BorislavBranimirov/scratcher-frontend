import { ChangeEvent, useEffect, useState } from 'react';
import { Image, X } from 'react-feather';

export const ScratchSubmitImagePreview = ({
  file,
  handleRemoveFileInput,
}: {
  file: File | null;
  handleRemoveFileInput: () => void;
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage(null);
    }
  }, [file]);

  if (!previewImage) {
    return null;
  }

  return (
    <div className="relative my-2 rounded-2xl overflow-hidden">
      <button
        className="absolute top-2 left-2 p-1.5 rounded-full transition-colors bg-neutral hover:bg-neutral/80 active:bg-neutral/60"
        onClick={handleRemoveFileInput}
        title="Remove"
      >
        <X />
      </button>
      <img src={previewImage} alt="attachment" className="w-full h-auto" />
    </div>
  );
};

export const ScratchSubmitFileUploadButton = ({
  handleFileInputChange,
}: {
  handleFileInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <>
      <input
        id="file"
        type="file"
        name="file"
        className="hidden"
        accept=".png, .jpeg, .webp, .gif"
        onChange={handleFileInputChange}
      />
      <label htmlFor="file">
        <div className="relative text-post-btn-default cursor-pointer">
          <div className="absolute top-0 left-0 right-0 bottom-0 -m-2 rounded-full transition-colors hover:bg-blue/10 active:bg-blue/20"></div>
          <Image size={20} />
        </div>
      </label>
    </>
  );
};
