import { Image, Skeleton } from "antd";
import { useEffect, useState } from "react";
import api from "@/api";
import errorImage from "@/assets/image/error-image.jpg";

interface IProps {
  ossPath: string;
  className?: string;
  width?: string | number;
}
// 为避免多次请求图片，使用缓存
const imageUrlCache = new Map<string, string>();

function ImageSafe(props: IProps) {
  const { ossPath, className, width = 50 } = props;
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    function getImageUrl() {
      if (imageUrlCache.has(ossPath)) {
        setImageUrl(imageUrlCache.get(ossPath) as string);
        return;
      }
      console.log(ossPath);
      setLoading(true);
      //   setTimeout(() => {

      //   }, 3000);
      api.ossImageUrl({ key: ossPath }).then((res) => {
        imageUrlCache.set(ossPath, res.url);
        setImageUrl(res.url);
        setLoading(false);
      });
    }
    getImageUrl();
  }, [ossPath]);
  if (loading) {
    return (
      <Skeleton.Image
        style={{
          width: `${width}px`,
          height: `${width}px`,
        }}
        active
        className={className}
      />
    );
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
