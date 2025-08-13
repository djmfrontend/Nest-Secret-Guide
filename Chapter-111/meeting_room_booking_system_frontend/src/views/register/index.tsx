import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import z from "zod";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@hookform/error-message";
import { useNavigate } from "react-router";
export default function RegisterPage() {
  const navigate = useNavigate();
  const fromSchema = z.object({
    username: z.string().min(4, {
      message: "用户名长度不能小于4",
    }),
    password: z.string().min(6, {
      message: "密码长度不能小于6",
    }),
    nickName: z.string(),
    email: z.email({ message: "请输入正确的邮箱" }),
    confirmPassword: z.string().min(6, {
      message: "密码长度不能小于6",
    }),
  });
  const form = useForm<z.infer<typeof fromSchema>>({
    resolver: zodResolver(fromSchema),
    defaultValues: {
      username: "zhangsan",
      password: "123456",
      nickName: "张三",
      email: "zhangsan@163.com",
      confirmPassword: "123456",
    },
  });
  const onSubmit = (values: z.infer<typeof fromSchema>) => {
    console.log(values);
    // await handleRegister(values);
    // message.success("注册成功");
    // navigate("/login");
    navigate("/login");
  };
  return (
    <div className="h-full">
      <div className="w-1/2 m-auto py-10">
        <div className="font-bold text-center text-3xl">会议室预定系统</div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="mb-2">
                  <FormLabel>用户名</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入用户名" {...field} />
                  </FormControl>
                  <ErrorMessage
                    name="username"
                    render={({ messages, message }) => {
                      return messages
                        ? Object.entries(messages).map(([type, message]) => (
                            <p key={type} className="text-red-500">
                              {message}
                            </p>
                          ))
                        : message && <p className="text-red-500">{message}</p>;
                    }}
                  ></ErrorMessage>
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="nickName"
              render={({ field }) => (
                <FormItem className="mb-2">
                  <FormLabel>昵称</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入用昵称" {...field} />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mb-2">
                  <FormLabel>密码</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入密码" {...field} />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="mb-2">
                  <FormLabel>确认密码</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入确认密码" {...field} />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-2">
                  <FormLabel>邮箱</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入邮箱" {...field} />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>

            <Button className="w-full" type="submit">
              注册
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
