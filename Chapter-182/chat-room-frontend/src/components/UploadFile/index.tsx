import { Upload, Modal, Button } from "antd";
import Iconfont from "@/components/Iconfont";
import { useState } from "react";
import styles from "./index.module.less";
import { useChatStore } from "@/store/chat";

function UploadFile() {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);
  const { currentFriend } = useChatStore();
  const fileIcon = {
    image: <Iconfont code="&#xe6b1;" />,
    video: <Iconfont code="&#xe6b2;" />,
    audio: <Iconfont code="&#xe6b3;" />,
    file: <Iconfont code="&#xe6b4;" />,
    text: <Iconfont code="mdi:document" size={80}></Iconfont>,
  } as Record<string, React.ReactNode>;
  const handleBeforeUpload = (file: File, fileList: File[]) => {
    //
    setPreviewVisible(true);
    setPreviewFiles(fileList);
    console.log(file);
    return false;
  };
  const handleOK = () => {
    setPreviewVisible(false);
  };
  const handleCancel = () => {
    setPreviewVisible(false);
    //
  };
  const renderFile = (file: File) => {
    const { type } = file;
    const fileType = type.split("/")[0];
    const Icon = fileIcon[fileType];

    return (
      <div className={styles["file-list-item"]}>
        <div className={styles.icon}>{Icon}</div>
        <div className={styles.detail}>
          <div className={styles.title}>{file.name}</div>
          <div className={styles.size}>{(file.size / 1024).toFixed(2)}KB</div>
        </div>
      </div>
    );
  };
  return (
    <>
      <Upload
        showUploadList={false}
        method="post"
        multiple
        beforeUpload={handleBeforeUpload}
        action={`${import.meta.env.VITE_BASE_URL}/oss/upload`}
      >
        <Iconfont code="ic:baseline-attach-file" size={24}></Iconfont>
      </Upload>
      <Modal
        open={previewVisible}
        title=""
        footer={false}
        onOk={handleOK}
        onCancel={handleCancel}
      >
        <div>
          <span>发送给:</span>
          <div>
            <img src={currentFriend?.headPic} alt="" />
            <span>{currentFriend?.nickName}</span>
          </div>
          <div>
            <div>{previewFiles.map((file) => renderFile(file))}</div>
          </div>
          <div>
            <input type="text" placeholder="给朋友留言" />
          </div>
          <div>
            <Button>取消</Button>
            <Button>发送</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default UploadFile;
