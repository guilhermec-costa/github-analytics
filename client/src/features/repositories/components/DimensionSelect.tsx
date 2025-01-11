import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RepoMeasureDimension } from "@/utils/types";

export default function DimensionSelect({
  setSelectedDimension,
}: {
  setSelectedDimension: (dim: string) => void;
}) {
  return (
    <>
      <Select onValueChange={(e) => setSelectedDimension(e)}>
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder="Select Dimension" />
        </SelectTrigger>
        <SelectContent className="bg-white text-gray-700 rounded-lg shadow-lg">
          <SelectItem value={RepoMeasureDimension.bytes}>Bytes</SelectItem>
          <SelectItem value={RepoMeasureDimension.megabytes}>
            MegaBytes
          </SelectItem>
          <SelectItem value={RepoMeasureDimension.gigabytes}>
            GigaBytes
          </SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}
