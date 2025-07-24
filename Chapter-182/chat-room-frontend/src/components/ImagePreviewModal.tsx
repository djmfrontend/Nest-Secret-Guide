import { useState, type FC, type PropsWithChildren } from "react";
import Modal from "./Modal";

interface Props {
  download?: boolean;
  data?: PreviewImageData;
  closeModal: () => void;
}
export interface PreviewImageData {
  originUrl: string;
  thumbnail?: string;
  downloadLink?: string;
  name?: string;
  type?: string;
}
const ImagePreviewModal: FC<Props> = ({
  download = true,
  data,
  closeModal,
}) => {
  const [url, setUrl] = useState(data?.thumbnail);
  const [loading, setLoading] = useState(true);
  if (!data) return null;
  return (
    <Modal>
      <div className="w-screen h-screen flex justify-center bg-black/90">
        <div className="relative flex flex-col justify-start gap-3">
          <div className="overflow-auto">
            <img
              src={url}
              alt="preview"
              className="max-w-[70vw] max-h-[80vh]"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
