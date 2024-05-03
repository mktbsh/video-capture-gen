import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OutputImage } from "@/lib/video";

type ImageType = OutputImage["type"];

type Props = {
  currentValue: string;
  onChange: (type: ImageType) => void;
};

export function ImageTypeSelect({ currentValue, onChange }: Props) {
  return (
    <Select
      value={currentValue}
      onValueChange={(value) => {
        onChange(value as ImageType);
      }}
    >
      <SelectTrigger className="w-[90px]">
        <SelectValue placeholder="Image type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="jpeg">jpeg</SelectItem>
        <SelectItem value="png">png</SelectItem>
        <SelectItem value="webp">webp</SelectItem>
      </SelectContent>
    </Select>
  );
}
