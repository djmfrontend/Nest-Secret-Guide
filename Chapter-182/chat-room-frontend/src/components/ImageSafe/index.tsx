import { Image, Skeleton } from "antd";
import { useEffect, useState } from "react";
import api from "@/api";
import errorImage from "@/assets/image/error-image.jpg";

interface IProps {
  ossPath: string;
  className?: string;
  width?: string | number;
}
function ImageSafe(props: IProps) {
  const { ossPath, className, width = 50 } = props;
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    function getImageUrl() {
      console.log(ossPath);
      setLoading(true);
      setTimeout(() => {
        api.ossImageUrl({ key: ossPath }).then((res) => {
          setImageUrl(res.url);
          setLoading(false);
        });
      }, 3000);
    }
    getImageUrl();
  }, [ossPath]);
  if (loading) {
    return <Skeleton.Image active className={className} />;
  }
  if (!imageUrl) {
    return <Image src={errorImage} preview={false} width={width}></Image>;
  }
  return (
    <>
      <Image
        width={width}
        src={imageUrl}
        preview={false}
        className={className}
      ></Image>
    </>
  );
}

export default ImageSafe;
