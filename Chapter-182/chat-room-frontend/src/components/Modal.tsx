import { useEffect, useState, type FC, type PropsWithChildren } from "react";
import { createPortal } from "react-dom";

interface Props {
  id?: string;
  mask?: boolean;
}

const Modal: FC<PropsWithChildren<Props>> = ({
  id = "root-modal",
  mask,
  children,
}) => {
  const [wrapper, setWrapper] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    const modalRoot = document.getElementById(id);
    if (!modalRoot) {
      return;
    }
    if (mask) {
      modalRoot.classList.add("mask");
    }
    const wrapper = document.createElement("div");
    wrapper.classList.add("wrapper");
    modalRoot.appendChild(wrapper);
    setWrapper(wrapper);
    return () => {
      modalRoot.removeChild(wrapper);
    };
  }, [id, mask]);

  if (!wrapper) {
    return null;
  }
  // 把弹窗内容渲染到wrapper中
  return createPortal(children, wrapper);
};
export default Modal;
