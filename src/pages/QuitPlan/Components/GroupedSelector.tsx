import { Checkbox, Typography } from "@mui/material";
import Card from "../../../components/shared/Card";
interface GroupItem {
  value: string;
  label: string;
}

interface Group<T extends GroupItem> {
  group: string;
  items: T[];
}

interface GroupedSelectorProps<T extends GroupItem> {
  groupedItems: Group<T>[];
  selected: string[];
  onToggle: (value: string) => void;
}

export function GroupedSelector<T extends GroupItem>({
  groupedItems,
  selected,
  onToggle,
}: GroupedSelectorProps<T>) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
      {groupedItems.map((group) => (
        <Card key={group.group} className="space-y-2 border rounded-lg p-4">
          <Typography variant="h6" className="text-[#c2410c] font-semibold">
            {group.group}
          </Typography>

          <div className="space-y-2">
            {group.items.map((item) => (
              <div
                key={item.value}
                className="flex items-center rounded px-3 py-2 cursor-pointer hover:border-orange-400 transition"
                onClick={() => onToggle(item.value)}
              >
                <Checkbox
                  checked={selected.includes(item.value)}
                  onChange={() => onToggle(item.value)}
                  sx={{
                    color: "grey.500",
                    "&.Mui-checked": {
                      color: "#c2410c",
                    },
                  }}
                />
                <Typography variant="body2" className="text-sm">
                  {item.label}
                </Typography>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
