import { Button } from "./components/ui/button";
import { login } from "./api";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "./components/ui/form";
import "./App.css";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./components/ui/input";

function App() {
  const formSchema = z.object({
    username: z.string().min(2, {
      message: "用户名长度不能小于2",
    }),
    password: z.string().min(6, {
      message: "密码长度不能小于6",
    }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "zhangsan",
      password: "123456",
    },
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    login(values.username, values.password).then((res) => {
      console.log(res);
    });
  };
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>用户名</FormLabel>
                <FormControl>
                  <Input placeholder="请输入" {...field}></Input>
                </FormControl>

                <FormDescription>用户名长度不能小于2</FormDescription>
              </FormItem>
            )}
          ></FormField>
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <div className="flex min-h-svh flex-col items-center justify-center">
        <Button> Click me</Button>
      </div>
      <div
        style={{
          background:
            "linear-gradient(90deg, #66d17a 0%, #2ecc71 50%, #1fa958 100%)",
          width: "400px",
          height: "24px",
        }}
      ></div>
    </>
  );
}

export default App;
