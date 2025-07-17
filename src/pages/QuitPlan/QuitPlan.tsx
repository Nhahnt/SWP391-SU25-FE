import { useState } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Button,
} from "@mui/material";
import {
  HeartPulse,
  Users,
  PiggyBank,
  Smile,
  Star,
  AlarmClock,
  Brain,
  UsersRound,
  Wine,
  Utensils,
  Coffee,
} from "lucide-react";
import axios from "axios";
import { GroupedTriggerSelector } from "./Components/TriggersSection";

const options = ["2", "3", "4", "5", "6"];

const reasonsList = [
  { id: "r1", value: "health", label: "Health", icon: HeartPulse },
  { id: "r2", value: "family", label: "Family", icon: Users },
  { id: "r3", value: "money", label: "Save Money", icon: PiggyBank },
  { id: "r4", value: "appearance", label: "Appearance", icon: Smile },
  { id: "r5", value: "example", label: "Become A Good Model", icon: Star },
  { id: "r6", value: "time", label: "Take Life Control", icon: AlarmClock },
];

const groupedTriggers = [
  {
    group: "Social Situations",
    triggers: [
      {
        id: "t1",
        value: "offered",
        label: "Being offered a cigarette",
      },
      {
        id: "t2",
        value: "drinking",
        label: "Drinking alcohol or going to a bar",
      },
      {
        id: "t3",
        value: "party",
        label: "Going to a party or social event",
      },
      {
        id: "t4",
        value: "others_smoking",
        label: "Being around others who smoke",
      },
      {
        id: "t5",
        value: "seeing_smoke",
        label: "Seeing someone else smoke",
      },
      {
        id: "t6",
        value: "smell_smoke",
        label: "Smelling cigarette smoke",
      },
    ],
  },
  {
    group: "Nicotine Withdrawal",
    triggers: [
      { id: "t7", value: "irritable", label: "Feeling irritable" },
      {
        id: "t8",
        value: "restless",
        label: "Feeling restless or jumpy",
      },
      {
        id: "t9",
        value: "cravings",
        label: "Strong cravings to smoke",
      },
      {
        id: "t10",
        value: "concentration",
        label: "Hard time concentrating",
      },
      {
        id: "t11",
        value: "waking_up",
        label: "Waking up in the morning",
      },
    ],
  },
  {
    group: "Routine Situations",
    triggers: [
      { id: "t12", value: "phone", label: "Being on my phone" },
      {
        id: "t13",
        value: "downtime",
        label: "Down time or between activities",
      },
      { id: "t14", value: "coffee", label: "Drinking coffee" },
      { id: "t15", value: "meal", label: "Finishing a meal" },
      {
        id: "t16",
        value: "tv",
        label: "Seeing cigarettes on TV or movies",
      },
      { id: "t17", value: "waiting", label: "Waiting for a ride" },
      { id: "t18", value: "walking", label: "Walking or driving" },
      {
        id: "t19",
        value: "entertainment",
        label: "Watching TV or gaming",
      },
      { id: "t20", value: "working", label: "Working or studying" },
    ],
  },
  {
    group: "My Emotions",
    triggers: [
      { id: "t21", value: "angry", label: "Angry" },
      {
        id: "t22",
        value: "anxious",
        label: "Anxious or nervous",
      },
      { id: "t23", value: "bored", label: "Bored" },
      {
        id: "t24",
        value: "frustrated",
        label: "Frustrated or upset",
      },
      { id: "t25", value: "happy", label: "Happy or excited" },
      { id: "t26", value: "lonely", label: "Lonely" },
      { id: "t27", value: "sad", label: "Sad or depressed" },
      {
        id: "t28",
        value: "stressed",
        label: "Stressed or overwhelmed",
      },
    ],
  },
];

const strategiesList = [
  { id: "s1", value: "gum", label: "Chew Gum" },
  { id: "s2", value: "walk", label: "Go for a Walk" },
  { id: "s3", value: "call", label: "Call a Friend" },
  { id: "s4", value: "expert", label: "Talk to an Expert" },
  { id: "s5", value: "event", label: "Attend Quit-Smoking Events" },
  { id: "s6", value: "advice", label: "Ask a Quitter" },
];

export default function CreateQuitPlan() {
  const [quitDate, setQuitDate] = useState("");
  const [duration, setDuration] = useState("");
  const [dailyCigarettes, setDailyCigarettes] = useState("");
  // const [cigaretteType, setCigaretteType] = useState("");
  const [cigaretteCost, setCigaretteCost] = useState("");
  // const [currency, setCurrency] = useState("VND");
  const [reasons, setReasons] = useState<string[]>([]);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [strategies, setStrategies] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSelect = (list: string[], setList: Function, value: string) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  // const handleSubmit = async () => {
  //   if(!quitDate) { setError("Vui lòng chọn ngày bắt đầu cai thuốc!"); return; }
  //   if(!duration) { setError("Vui lòng chọn thời lượng của kế hoạch!"); return; }
  //   if(!dailyCigarettes || parseInt(dailyCigarettes) <= 0) { setError("Vui lòng nhập số điếu hút mỗi ngày!"); return; }
  //   if(!cigaretteCost || parseInt(dailyCigarettes) <= 0) { setError("Vui lòng nhập giá tiền một bao thuốc!"); return; }
  //   if(reasons.length === 0) { setError("Vui lòng chọn ít nhất một lí do cai thuốc!"); return; }
  //   if(triggers.length === 0) { setError("Vui lòng chọn ít nhất một điều khiến bạn hút thuốc!"); return; }
  //   if(strategies.length === 0) { setError("Vui lòng chọn ít nhất một chiến lược cai thuốc!"); return; }

  //   setIsSubmitting(true);
  //   setError("");

  //   try {
  //     const planRequest = {
  //       startDate: quitDate,
  //       durationWeeks: duration,

  //     };
  //   }
  // }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <div>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Build Your Personalized Quit Plan
        </Typography>
        <Typography className="text-gray-600">
          Fill out the sections below to create a quit plan tailored to your
          needs. This will help you stay motivated and prepared!
        </Typography>
      </div>

      {/* Section 1 */}
      <div className="space-y-2">
        <Typography variant="h6">1. Set Your Quit Date</Typography>
        <TextField
          fullWidth
          type="date"
          value={quitDate}
          onChange={(e) => setQuitDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          inputProps={{
            min: new Date().toISOString().split("T")[0],
          }}
        />
      </div>

      {/* Section 2 */}
      <div className="space-y-2">
        <Typography variant="h6">2. Duration of Quit Plan</Typography>
        <FormControl fullWidth>
          <InputLabel>Choose Duration</InputLabel>
          <Select
            value={duration}
            label="Choose Duration"
            onChange={(e) => setDuration(e.target.value)}
          >
            {options.map((week) => (
              <MenuItem key={week} value={week}>
                {week} weeks {week === "6" && "(preferred)"}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Section 3 */}
      <div className="space-y-4">
        <Typography variant="h6">3. Smoking Status</Typography>
        <TextField
          fullWidth
          type="number"
          label="Average cigarettes per day"
          value={dailyCigarettes}
          onChange={(e) => setDailyCigarettes(e.target.value)}
        />

        <div className="flex gap-4">
          <TextField
            fullWidth
            label="Cost of each pack"
            value={cigaretteCost}
            onChange={(e) => setCigaretteCost(e.target.value)}
          />
<<<<<<< Updated upstream

=======
          /
>>>>>>> Stashed changes
          <Typography
            variant="body1"
            className="font-semibold mt-4 text-gray-600"
          >
            VND
          </Typography>
        </div>
      </div>

      {/* Section 4 */}
      <div className="space-y-4">
        <Typography variant="h6">4. Why are you quitting?</Typography>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {reasonsList.map((r) => {
            const Icon = r.icon;
            return (
              <div
                key={r.id}
                onClick={() => toggleSelect(reasons, setReasons, r.value)}
                className={`border rounded p-3 cursor-pointer flex flex-col justify-centes items-center gap-2 transition duration-150 ${
                  reasons.includes(r.value)
                    ? "bg-orange-100 border-orange-500"
                    : "hover:border-orange-300"
                }`}
              >
                <Typography variant="h6" fontWeight={500}>
                  {r.label}
                </Typography>
                <Icon className="text-orange-500 w-7 h-7" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 5 */}
      <div className="space-y-4">
        <Typography variant="h6">5. Identify Your Triggers</Typography>

        <GroupedTriggerSelector
          groupedTriggers={groupedTriggers}
          selected={triggers}
          onToggle={(val) => toggleSelect(triggers, setTriggers, val)}
        />
      </div>

      {/* Section 6 */}
      <div className="space-y-4">
        <Typography variant="h6">
          6. How Will You Do It? (Strategies)
        </Typography>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {strategiesList.map((s) => (
            <div
              key={s.id}
              onClick={() => toggleSelect(strategies, setStrategies, s.value)}
              className={`border rounded p-3 cursor-pointer flex justify-between items-center transition duration-150 ${
                strategies.includes(s.value)
                  ? "bg-orange-100 border-orange-500"
                  : "hover:border-orange-300"
              }`}
            >
              <span>{s.label}</span>
              {strategies.includes(s.value) && <div />}
            </div>
          ))}
        </div>
      </div>

      <div>
        <Button variant="contained" color="primary" size="large">
          Create My Plan
        </Button>
      </div>
    </main>
  );
}
