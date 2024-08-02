import Image from "next/image";
import React, { useState } from "react";
import style from "@/styles/modules/createpPost.module.scss";

interface ImagePreviewProps {
  uploadedImages: File[];
  setUploadedImages: React.Dispatch<React.SetStateAction<File[]>>;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  uploadedImages,
  setUploadedImages,
}) => {
  const [enlargedImage, setEnlargedImage] = useState<File | null>(null);
  const removeImage = (index: number) => {
    const newUploadedImages = [...uploadedImages];
    newUploadedImages.splice(index, 1);
    setUploadedImages(newUploadedImages);
  };
  const closeEnlarge = () => {
    setEnlargedImage(null);
  };
  const enlargeImage = (image: File) => {
    setEnlargedImage(image);
  };
  return (
    <div>
      <div className={style["imagePreview"]}>
        {uploadedImages.map((image, index) => (
          <div key={index} className={style["previewImage"]}>
            <Image
              src={URL.createObjectURL(image)}
              alt="Uploaded Image"
              className={style["previewImage"]}
              width={211}
              height={211}
              onClick={() => enlargeImage(image)}
            />
            <button
              onClick={() => removeImage(index)}
              className={style["close-button"]}>
              <span aria-hidden="true">×</span>
            </button>
          </div>
        ))}
      </div>
      {enlargedImage && (
        <div className={style["enlarged-image-modal"]} onClick={closeEnlarge}>
          <div
            className={style["enlarged-image-container"]}
            onClick={(e) => e.stopPropagation()}>
            <Image
              src={URL.createObjectURL(enlargedImage)}
              alt="Enlarged Image"
              width={500}
              height={500}
              className={style["enlarged-preview-image"]}
            />
            <button onClick={closeEnlarge} className={style["close-enlarge"]}>
              <span aria-hidden="true">×</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
