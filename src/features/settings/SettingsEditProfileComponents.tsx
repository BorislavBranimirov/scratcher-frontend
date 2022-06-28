import { ChangeEvent } from 'react';
import { Camera } from 'react-feather';

export const EditProfileFileUploadButton = ({
  handleFileInputChange,
  id,
}: {
  handleFileInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  id: string;
}) => {
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
      <label htmlFor={id} title="Add photo">
        <div className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-colors bg-neutral/80 hover:bg-neutral/60 active:bg-neutral/40">
          <Camera size={20} />
        </div>
      </label>
    </>
  );
};
