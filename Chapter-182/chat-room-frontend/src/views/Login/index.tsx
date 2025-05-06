import { Form, Input, Button } from "antd";

function Login() {
  return (
    <div className="container">
      <Form>
        <div className="text-center font-bold text-3xl mb-2">聊天室</div>
        <Form.Item label="账号">
          <Input placeholder="Enter your username" />
        </Form.Item>
        <Form.Item label="密码">
          <Input.Password placeholder="Enter your password" />
        </Form.Item>
        <Form.Item>
          <div className="flex justify-between">
            <Button variant="link" color="blue">
              创建账号
            </Button>
            <Button variant="link" color="blue">
              忘记密码
            </Button>
          </div>
        </Form.Item>
        <Form.Item>
          <Button type="primary" className="w-full">
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
export default Login;
