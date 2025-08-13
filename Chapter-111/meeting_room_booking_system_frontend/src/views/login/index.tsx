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
  });
  const form = useForm<z.infer<typeof fromSchema>>({
    resolver: zodResolver(fromSchema),
    defaultValues: {
      username: "zhangsan",
      password: "123456",
    },
  });
  const onSubmit = (values: z.infer<typeof fromSchema>) => {
    console.log(values);
    // await handleRegister(values);
    // message.success("注册成功");
    // navigate("/login");
    navigate("/");
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

            <Button className="w-full" type="submit">
              登录
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
