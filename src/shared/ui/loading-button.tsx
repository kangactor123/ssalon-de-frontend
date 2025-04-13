import { memo } from "react";
import { Button, ButtonProps } from "./button";
import Spinner from "./spinner";

interface Props extends ButtonProps {
  isLoading: boolean;
}

const LoadingButton: React.FC<Props> = ({ isLoading, children, ...props }) => {
  return <Button {...props}>{isLoading ? <Spinner /> : children}</Button>;
};

export default memo(LoadingButton);
