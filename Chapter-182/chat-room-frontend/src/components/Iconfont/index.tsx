import { Icon } from "@iconify/react";
import classnames from "classnames";
import styles from "./index.module.less";
interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string;
  box?: boolean;
  boxSize?: number;
  size?: number;
  className?: string;
  classNameBox?: string;
  active?: boolean;
}
const Iconfont = (props: IProps) => {
  const {
    box,
    boxSize = 32,
    size = 14,
    className,
    classNameBox,
    active,
    ...args
  } = props;
  return box ? (
    <div
      {...args}
      style={
        {
          "--icon-box-size": `${boxSize}px`,
          "--icon-size": `${size}px`,
        } as any
      }
      className={classnames(classNameBox, styles.iconBox, {
        [styles.activeIconBox]: active,
      })}
    >
      <Icon icon={props.code} width={boxSize} />
    </div>
  ) : (
    <div
      style={
        {
          "--icon-size": `${size}px`,
        } as any
      }
      className={classnames(className, styles.iconfont)}
      {...args}
    >
      <Icon icon={props.code} width={size} />
    </div>
  );
};

export default Iconfont;
