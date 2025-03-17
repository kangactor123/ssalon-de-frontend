import { Label } from "@/shared/ui/label";
import { cn } from "../utils/tailwind";

interface RequiredLabelProps extends React.ComponentProps<typeof Label> {
  required?: boolean;
  errorMessage?: string;
  value?: string;
}

export function RequiredLabel({
  required,
  children,
  errorMessage,
  value,
  ...props
}: RequiredLabelProps) {
  return (
    <div className="flex items-center space-x-1 min-h-[20px]">
      <Label className={cn("whitespace-nowrap", props.className)} {...props}>
        {children}
      </Label>
      {value && <span className="text-sm text-fuchsia-700">({value})</span>}
      {required && <span className="text-red-500 text-sm">*</span>}
      {errorMessage && (
        <span className="text-red-700 text-[9px] whitespace-pre-wrap">
          {errorMessage}
        </span>
      )}
    </div>
  );
}
