import { Checkbox } from "@/shared/ui/checkbox";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

type Props = {
  id: string;
  checked: boolean;
  name: string;
  amount: string;
  onCheckedChange: (checked: boolean) => void;
  onChangeAmount: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const Payment: React.FC<Props> = (props) => {
  const { id, checked, name, amount, onCheckedChange, onChangeAmount } = props;
  return (
    <div className="h-6 flex items-center gap-2">
      <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
      <Label htmlFor={id}>{name}</Label>
      <Input
        type="number"
        placeholder="금액"
        className="w-[120px] ml-2"
        value={amount}
        onChange={onChangeAmount}
        onKeyDown={(e) => {
          if (e.key === "-" || e.key === "+") {
            e.preventDefault();
          }
        }}
      />
    </div>
  );
};

export default Payment;
