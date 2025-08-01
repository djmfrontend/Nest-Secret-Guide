import type { FC, ReactNode } from "react";
import { Suspense } from "react";

// import Loading from "@/components/Loading";
const Loading = () => {
  return <div>Loading...</div>;
};
type Props = {
  key?: string;
  children?: ReactNode;
};

const Lazy: FC<Props> = ({ key, children }) => {
  return (
    <Suspense key={key ?? new Date().getTime()} fallback={<Loading />}>
      {children}
    </Suspense>
  );
};

export default Lazy;
