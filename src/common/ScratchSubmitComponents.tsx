import { ChangeEvent, useId } from 'react';
import { Image, X } from 'react-feather';
import usePreviewImage from './usePreviewImage';

export const ScratchSubmitImagePreview = ({
  file,
  handleRemoveFileInput,
}: {
  file: File | null;
  handleRemoveFileInput: () => void;
}) => {
  const [previewImage] = usePreviewImage(file);

  if (!previewImage) {
    return null;
  }

  return (
    <div className="relative my-2 rounded-2xl overflow-hidden">
      <button
        className="absolute top-2 left-2 p-1.5 rounded-full transition-colors bg-backdrop text-accent-inverted hover:bg-backdrop/80 active:bg-backdrop/60"
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
  const id = useId();

  return (
    <>
      <input
        id={id}
        type="file"
        name="file"
        className="hidden"
        accept="image/png, image/jpeg, image/webp, image/gif"
        onClick={(e) => {
          // clear out last value on click
          // otherwise chromium browsers don't trigger onChange event if same file is selected
          // this causes issues in parent components where file is cleared only in state (in image preview)
          // user flow of selecting file -> removing it -> selecting the same file again doesn't work
          // as chromium ignores the last action since the dom file input keeps the old file
          // another solution is passing ref from parent and clearing there when cleaning state, but is messier
          e.currentTarget.value = '';
        }}
        onChange={handleFileInputChange}
      />
      <label htmlFor={id} title="Media">
        <div className="relative text-accent cursor-pointer">
          <div className="absolute inset-0 -m-2 rounded-full transition-colors hover:bg-accent/10 active:bg-accent/20"></div>
          <Image size={20} />
        </div>
      </label>
    </>
  );
};
