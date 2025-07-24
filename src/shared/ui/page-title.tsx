import { PropsWithChildren } from "react";

type Props = {
  className?: string;
};

const PageTitle: React.FC<PropsWithChildren<Props>> = ({
  children,
  className,
}) => {
  return (
    <h2 className={`text-3xl font-bold text-gray-800 ${className}`}>
      {children}
    </h2>
  );
};

export default PageTitle;
