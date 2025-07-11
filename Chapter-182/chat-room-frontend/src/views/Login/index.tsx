import { Form, Input, Button } from "antd";
import api from "../../api";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/store/user";
interface IFormData {
  username: string;
  password: string;
}
function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const handleLogin = async (formData: IFormData) => {
    await login(formData.username, formData.password);

    navigate("/");
  };
  return (
    <div className="w-full max-w-sm mx-auto">
      <Form onFinish={handleLogin}>
        <div className="text-center font-bold text-3xl mb-2">聊天室</div>
        <Form.Item label="账号" name="username">
          <Input placeholder="Enter your username" />
        </Form.Item>
        <Form.Item label="密码" name="password">
          <Input.Password placeholder="Enter your password" />
        </Form.Item>
        <Form.Item>
          <div className="flex justify-between">
            <Button
              variant="link"
              color="blue"
              onClick={() => navigate("/register")}
            >
              创建账号
            </Button>
            <Button variant="link" color="blue">
              忘记密码
            </Button>
          </div>
        </Form.Item>
        <Form.Item>
          <Button type="primary" className="w-full" htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
export default Login;
