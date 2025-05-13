import { Form, Input, Button, message } from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../../api";
interface IFormData {
  username: string;
  password: string;
  nickName: string;
  confirmPassword: string;
  email: string;
  captcha: string;
}
function Register() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);

  const handleRegister = async (formData: IFormData) => {
    if (formData.password !== formData.confirmPassword) {
      message.error("两次密码不一致");
      return;
    }

    await api.userRegister({
      username: formData.username,
      password: formData.password,
      nickName: formData.nickName,
      email: formData.email,
      captcha: formData.captcha,
    });
    message.success("注册成功");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };
  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);
  const sendCaptcha = async () => {
    if (countdown > 0) return;
    // const address = from;
    const address = form.getFieldValue("email");
    console.log(address);
    if (!address) {
      message.error("请输入邮箱");
      return;
    }
    try {
      setIsSending(true);
      await api.sendCaptcha({ address: address });
      message.success("发送成功");
      setCountdown(60);
    } catch (e) {
      console.log(e);
    } finally {
      setIsSending(false);
    }
  };
  return (
    <div className="w-full max-w-sm mx-auto">
      <Form onFinish={handleRegister} {...layout} form={form}>
        <div className="text-center font-bold text-3xl mb-2">聊天室</div>
        <Form.Item
          label="用户名"
          name="username"
          rules={[
            {
              required: true,
              message: "请输入用户名",
            },
          ]}
        >
          <Input placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item
          label="昵称"
          name="nickName"
          rules={[{ required: true, message: "请输入昵称" }]}
        >
          <Input placeholder="请输入昵称" />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: "请输入密码" }]}
        >
          <Input.Password placeholder="请输入密码" />
        </Form.Item>
        <Form.Item
          label="确认密码"
          name="confirmPassword"
          rules={[{ required: true, message: "请输入确认密码" }]}
        >
          <Input.Password placeholder="请输入确认密码" />
        </Form.Item>
        <Form.Item
          label="邮箱"
          name="email"
          rules={[{ required: true, message: "请输入邮箱" }]}
        >
          <Input placeholder="请输入邮箱" />
        </Form.Item>
        <Form.Item
          label="验证码"
          name="captcha"
          rules={[{ required: true, message: "请输入验证码" }]}
        >
          <div className="flex">
            <Input placeholder="请输入验证码" />
            <Button
              className="ml-2"
              onClick={sendCaptcha}
              disabled={countdown > 0 || isSending}
            >
              {countdown > 0 ? `${countdown}秒后重试` : "发送验证码"}
            </Button>
          </div>
        </Form.Item>
        <Form.Item wrapperCol={{ span: 24 }}>
          <div className="flex justify-end items-center">
            <span>已有账号?</span>
            <Button
              variant="link"
              color="blue"
              onClick={() => navigate("/login")}
            >
              去登录
            </Button>
          </div>
        </Form.Item>
        <Form.Item wrapperCol={{ span: 24 }} className="w-full">
          <Button type="primary" className="w-full" htmlType="submit">
            注册
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
export default Register;
