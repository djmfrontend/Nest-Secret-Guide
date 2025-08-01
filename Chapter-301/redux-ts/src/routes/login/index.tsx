import { useLoginMutation } from "@/app/service/auth";
export default function LoginPage() {
  const [login, { isSuccess, isLoading, error }] = useLoginMutation();
  const handleLogin = () => {
    console.log("handleLogin");
    login({
      email: "root@root.com",
      type: "password",
      password: "123456",
    });
    //
  };
  return (
    <div className="flex justify-center items-center h-screen dark:bg-gray-700">
      <button onClick={handleLogin}>登录</button>
    </div>
  );
}
