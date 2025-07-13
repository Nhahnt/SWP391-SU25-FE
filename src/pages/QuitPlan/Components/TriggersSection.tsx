import { Box, Typography, Checkbox, Divider } from "@mui/material";

interface TriggerItem {
  id: string;
  value: string;
  label: string;
}

interface TriggerGroup {
  group: string;
  triggers: TriggerItem[];
}

interface Props {
  groupedTriggers: TriggerGroup[];
  selected: string[];
  onToggle: (value: string) => void;
}

export function GroupedTriggerSelector({
  groupedTriggers,
  selected,
  onToggle,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
      {groupedTriggers.map((group) => (
        <div key={group.group} className="space-y-2 border rounded-lg p-4">
          <Typography variant="h6" className="text-orange-700 font-semibold">
            {group.group}
          </Typography>

          <div className="space-y-2">
            {group.triggers.map((t) => (
              <div
                key={t.id}
                className="flex items-center border rounded px-3 py-2 cursor-pointer hover:border-orange-400 transition"
                onClick={() => onToggle(t.value)}
              >
                <Checkbox
                  checked={selected.includes(t.value)}
                  onChange={() => onToggle(t.value)}
                />
                <Typography variant="body2" className="text-sm">
                  {t.label}
                </Typography>
              </div>
            ))}
          </div>

          <Divider className="mt-4" />
        </div>
      ))}
    </div>
  );
}
