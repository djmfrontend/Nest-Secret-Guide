import { useAuthStore } from "@/store/user";
import { Image, Button, Form, Input, Upload } from "antd";
export default function UserSetting() {
  const { user } = useAuthStore();

  //
  return (
    <Form>
      <div className="flex flex-col justify-center items-center">
        <Image width={80} height={80} src={user?.headPic || ""}></Image>

        <Upload showUploadList={false} method="post" multiple={false}>
          <Button type="link">更换头像</Button>
        </Upload>
      </div>
      <Form.Item label="昵称">
        <Input value={user?.username} />
      </Form.Item>
      <Form.Item label="邮箱">
        <Input value={user?.email} />
      </Form.Item>
      <div>
        <Button type="primary">应用</Button>
      </div>
    </Form>
  );
}
