import Spinner from "@/shared/ui/spinner";
import { cn } from "../utils/tailwind";

type Props = {
  className?: string;
};

const Loading: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={cn(
        "w-full h-full absolute top-0 left-0 flex items-center justify-center",
        className
      )}
    >
      <Spinner />
    </div>
  );
};

export default Loading;
