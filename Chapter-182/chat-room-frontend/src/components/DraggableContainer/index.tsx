import styles from "./index.module.less";
import classnames from "classnames";
import { useRef, useEffect, useState } from "react";
interface IProps {
  //   children: React.ReactNode[];
  children: any;
  className?: string;
  layout?: "row" | "column";
  showLine?: boolean;
}
/**
 * children 元素数组
 * 必须有一个带ref属性的元素
 */
function DraggableContainer(props: IProps) {
  const { children, className, layout = "row", showLine = true } = props;
  const isRow = layout === "row";
  const volatileRef = children[0]?.ref || children[1]?.ref;
  const dividerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  useEffect(() => {
    if (!dividerRef.current) return;

    dividerRef.current.onmousedown = (e) => {
      console.log(volatileRef);
      if (!volatileRef?.current) return;
      e.preventDefault();
      setDragging(true);
      const clientStart = isRow ? e.clientX : e.clientY;
      const volatileBoxXY = isRow
        ? volatileRef.current.offsetWidth
        : volatileRef.current.offsetHeight; // 获取到对应ref的高度或者宽度
      console.log(clientStart, volatileBoxXY);

      document.onmousemove = (e) => {
        console.log(e);
        moveHandle(
          isRow ? e.clientX : e.clientY,
          volatileRef.current,
          clientStart,
          volatileBoxXY
        );
      };
      document.onmouseup = () => {
        setDragging(false);
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  }, []);

  /**
   *
   * @param nowClientXY 当前鼠标位置
   * @param leftDom 移动的dom
   * @param clientStart 移动的起始位置
   * @param volatileBoxXY dom的宽度或者高度
   */
  const moveHandle = (nowClientXY, leftDom, clientStart, volatileBoxXY) => {
    console.log(nowClientXY, leftDom, clientStart, volatileBoxXY);
    //
  };
  return (
    <div
      className={classnames(
        styles.box,
        { [styles.box_column]: !isRow },
        className
      )}
    >
      {children[0]}
      <div
        style={{ display: showLine ? "block" : "none" }}
        className={classnames(styles.divider, {
          [styles.displayDivider]: !children[1],
        })}
      >
        <div
          ref={dividerRef}
          className={classnames(styles.dividerCenter, {
            [styles.dragging]: dragging,
          })}
        ></div>
      </div>
      {children[1]}
    </div>
  );
}

export default DraggableContainer;
