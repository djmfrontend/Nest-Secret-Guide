import styles from "./index.module.less";
import { Button } from "antd";
import type { IAi } from "@/types";
import api from "@/api";
const GroupChatPage = () => {
  const handleRequest = () => {
    const aiParams: IAi = {
      max_tokens: 8192,
      temperature: 0.7,
      top_p: 0.7,
      top_k: 50,
      frequency_penalty: 0,

      model: "deepseek-ai/DeepSeek-V3",
      messages: [
        {
          role: "user",
          content:
            "我想在前端项目中接入AI 我后端用的是nest 请问我该通过哪几个步骤进行呢",
        },
      ],
    };
    api.aiStream(aiParams).then((res) => {
      console.log(res);
    });
  };

  return (
    <div className={styles.box}>
      <Button onClick={handleRequest}>发送测试请求</Button>
    </div>
  );
};

export default GroupChatPage;
