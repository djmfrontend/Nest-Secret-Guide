import { useAuthStore } from "@/store/user";
import { Button, Form, Input, Upload, message } from "antd";
import type { UploadProps } from "antd";
import { useState } from "react";
import ImageSafe from "@/components/ImageSafe";
import api from "@/api";
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
  const handleApply = (value: any) => {
    // 提交表单

    const data = { ...value, headPic: imgUrl };
    api.updateUserInfo(data).then(() => {
      message.success("修改成功");
    });
  };
  const [form] = Form.useForm();
  //
  return (
    <Form
      onFinish={handleApply}
      initialValues={{
        nickName: user?.nickName,
        email: user?.email,
        headPic: user?.headPic,
      }}
    >
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
      <Form.Item
        label="昵称"
        name={"nickName"}
        rules={[
          { required: true, message: "请输入昵称!" },
          { min: 2, message: "昵称至少2个字符" },
          { max: 16, message: "昵称最多16个字符" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="邮箱"
        name={"email"}
        rules={[
          { required: true, message: "请输入邮箱!" },
          { type: "email", message: "请输入有效的邮箱地址" },
        ]}
      >
        <Input />
      </Form.Item>
      <div className="flex justify-end">
        <Button type="primary" htmlType="submit">
          应用
        </Button>
      </div>
    </Form>
  );
}
