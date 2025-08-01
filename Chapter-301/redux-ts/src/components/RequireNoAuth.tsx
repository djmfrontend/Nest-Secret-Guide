import type { FC, ReactElement } from "react";
import { useAppSelector } from "@/app/store";
import { shallowEqual } from "react-redux";
import { useGetInitializedQuery } from "@/app/service/auth";
import { Navigate } from "react-router-dom";

interface Props {
  children: ReactElement;
  redirectTo?: string;
}
const RequireNoAuth: FC<Props> = ({ children, redirectTo = "/" }) => {
  const { isLoading } = useGetInitializedQuery();
  const { token, initialized, guest } = useAppSelector(
    (store) => store.authData,
    shallowEqual
  );
  console.log(initialized, token, guest);
  if (isLoading) {
    return null;
  }
  if (!initialized) {
    return <Navigate to={`/onboarding`} replace />;
  }
  if (token && !guest) {
    console.log("token", token);
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};
export default RequireNoAuth;
