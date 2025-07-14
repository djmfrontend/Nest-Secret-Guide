import { useAuthStore } from "@/store/user";
import { Button, Form, Input, Upload, message } from "antd";
import type { UploadProps } from "antd";
import { useState } from "react";
import ImageSafe from "@/components/ImageSafe";
export default function UserSetting() {
  const { user } = useAuthStore();
  const [imgUrl, setImgUrl] = useState(user?.headPic || "");
  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type === "image/png" || file.type === "image/jpeg";
      if (!isImage) {
        message.error("只能上传 PNG 或 JPG 格式的图片!");
        return Upload.LIST_IGNORE; // 阻止上传
      }
      return true;
    },
    onChange: (info) => {
      if (info.file.status === "done") {
        console.log(info.file.response, info.file);

        setImgUrl(info.file.response.data);
      }
    },
  };
  const handleApply = () => {
    // 提交表单
  };
  //
  return (
    <Form>
      <div className="flex flex-col justify-center items-center">
        <ImageSafe ossPath={imgUrl} width={80}></ImageSafe>
        <Upload
          showUploadList={false}
          {...uploadProps}
          method="post"
          multiple={false}
          action={`${import.meta.env.VITE_BASE_URL}/oss/upload`}
        >
          <Button type="link">更换头像</Button>
        </Upload>
      </div>
      <Form.Item label="昵称">
        <Input value={user?.username} />
      </Form.Item>
      <Form.Item label="邮箱">
        <Input value={user?.email} />
      </Form.Item>
      <div className="flex justify-end">
        <Button type="primary" onClick={handleApply}>
          应用
        </Button>
      </div>
    </Form>
  );
}
