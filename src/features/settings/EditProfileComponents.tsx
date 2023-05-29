import { ChangeEvent, useId, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { Camera, ZoomIn, ZoomOut } from 'react-feather';
import useSyncTextareaHeight from '../../common/useSyncTextareaHeight';

const getCroppedImg = async (
  imageSrc: string,
  cropData: Area,
  customWidth?: number,
  customHeight?: number
) => {
  const createImage = (url: string) => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        resolve(image);
      };
      image.onerror = (err) => {
        reject(err);
      };
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });
  };
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // customWidth/Height set size of the final image in pixels
  // otherwise, the actual size of the cropped area is used
  canvas.width = customWidth || cropData.width;
  canvas.height = customHeight || cropData.height;

  ctx.drawImage(
    image,
    cropData.x,
    cropData.y,
    cropData.width,
    cropData.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg');
  });
  if (!blob) return null;

  return new File([blob], 'cropped_image', {
    lastModified: Date.now(),
    type: blob.type,
  });
};

export const ImageCropper = ({
  imageUrl,
  aspect,
  finalWidth,
  finalHeight,
  onApply,
  objectFit = 'contain',
}: {
  imageUrl: string;
  aspect: number;
  finalWidth?: number;
  finalHeight?: number;
  onApply: (image: File) => void;
  objectFit?: 'contain' | 'horizontal-cover' | 'vertical-cover' | 'auto-cover';
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropData, setCropData] = useState<Area | null>(null);

  return (
    <div className="flex flex-col">
      <div className="relative w-full h-[70vh]">
        <Cropper
          image={imageUrl}
          crop={crop}
          maxZoom={7}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={(_, croppedAreaPixels) => {
            setCropData(croppedAreaPixels);
          }}
          showGrid={false}
          objectFit={objectFit}
        />
      </div>
      <div className="my-3 w-[90%] mx-auto flex gap-3 items-center">
        <ZoomOut size={20} />
        <input
          className="grow"
          type="range"
          min="1"
          max="7"
          step="0.1"
          value={zoom}
          onChange={(e) => {
            setZoom(Number(e.target.value));
          }}
        />
        <ZoomIn size={20} />
      </div>
      <div className="w-[90%] mx-auto flex justify-end">
        <button
          onClick={async () => {
            if (cropData) {
              const img = await getCroppedImg(
                imageUrl,
                cropData,
                finalWidth,
                finalHeight
              );
              if (img) {
                onApply(img);
              }
            }
          }}
          className={`bg-accent rounded-full py-1.5 px-8 font-bold text-accent-inverted transition-colors hover:bg-accent/80 active:bg-accent/60`}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export const EditProfileFileUploadButton = ({
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
      <label htmlFor={id} title="Add photo">
        <div className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-colors bg-backdrop/80 text-accent-inverted hover:bg-backdrop/60 active:bg-backdrop/40">
          <Camera size={20} />
        </div>
      </label>
    </>
  );
};

export const EditProfileNameField = ({
  name,
  nameError,
  nameLimit,
  handleChange,
}: {
  name: string;
  nameError: boolean;
  nameLimit: number;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className="relative">
      <input
        className={`peer w-full bg-transparent placeholder-transparent border border-primary rounded-md p-2 pt-6 outline-none ${
          nameError ? 'outline-error' : 'focus:outline-accent'
        }`}
        type="text"
        name="name"
        id="name"
        placeholder="Name"
        value={name}
        onChange={handleChange}
      />
      <label
        className={`absolute left-0 top-0 px-2 pt-1 text-sm ${
          !!nameError ? 'text-error' : 'text-muted'
        } transition-all peer-placeholder-shown:py-4 peer-placeholder-shown:text-base peer-focus:px-2 peer-focus:pt-1 peer-focus:text-sm ${
          !nameError ? 'peer-focus:text-accent' : ''
        }`}
        htmlFor="name"
      >
        Name
      </label>
      <span className="absolute right-0 top-0 px-2 pt-1 text-sm text-muted">
        {name.length}/{nameLimit}
      </span>
      {nameError && (
        <span className="text-sm text-error" data-cy="form-error">
          Name can't be blank and must be a maximum of {nameLimit} characters
        </span>
      )}
    </div>
  );
};

export const EditProfileDescriptionField = ({
  description,
  descriptionError,
  descriptionLimit,
  handleChange,
}: {
  description: string;
  descriptionError: boolean;
  descriptionLimit: number;
  handleChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}) => {
  const inputFieldRef = useSyncTextareaHeight(description);

  return (
    <div className="relative">
      <textarea
        className={`resize-none peer w-full bg-transparent placeholder-transparent border border-primary rounded-md p-2 pt-6 outline-none ${
          descriptionError ? 'outline-error' : 'focus:outline-accent'
        }`}
        name="description"
        id="description"
        ref={inputFieldRef}
        placeholder="Description"
        value={description}
        onChange={handleChange}
      />
      <label
        className={`absolute left-0 top-0 px-2 pt-1 text-sm ${
          !!descriptionError ? 'text-error' : 'text-muted'
        } transition-all peer-placeholder-shown:py-4 peer-placeholder-shown:text-base peer-focus:px-2 peer-focus:pt-1 peer-focus:text-sm ${
          !descriptionError ? 'peer-focus:text-accent' : ''
        }`}
        htmlFor="description"
      >
        Description
      </label>
      <span className="absolute right-0 top-0 px-2 pt-1 text-sm text-muted">
        {description.length}/{descriptionLimit}
      </span>
      {descriptionError && (
        <span className="text-sm text-error">
          Description must be a maximum of {descriptionLimit} characters
        </span>
      )}
    </div>
  );
};
