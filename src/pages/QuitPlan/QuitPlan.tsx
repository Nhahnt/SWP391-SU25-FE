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
import axios from "axios";

const options = ["2", "3", "4", "5", "6"];

const reasonsList = [
  { id: "r1", value: "health", label: "Health" },
  { id: "r2", value: "family", label: "Family" },
  { id: "r3", value: "money", label: "Save Money" },
  { id: "r4", value: "appearance", label: "Appearance" },
  { id: "r5", value: "example", label: "Become A Good Model" },
  { id: "r6", value: "time", label: "Free Time" },
];

const triggersList = [
  { id: "t1", value: "stress", label: "Stress" },
  { id: "t2", value: "social", label: "Socializing" },
  { id: "t3", value: "drinking", label: "Drinking Alcohol" },
  { id: "t4", value: "meal", label: "After Meals" },
  { id: "t5", value: "morning", label: "Morning Routine" },
  { id: "t6", value: "time", label: "Free Time" },
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
  // const [otherReasons, setOtherReasons] = useState("");
  // const [otherTriggers, setOtherTriggers] = useState("");
  // const [otherStrategies, setOtherStrategies] = useState("");
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
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-6">
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
            min: new Date().toISOString().split("T")[0]
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
        {/* <TextField
          fullWidth
          label="Type of tobacco"
          value={cigaretteType}
          onChange={(e) => setCigaretteType(e.target.value)}
        /> */}
        <div className="flex gap-4">
          <TextField
            fullWidth
            label="Cost of each pack"
            value={cigaretteCost}
            onChange={(e) => setCigaretteCost(e.target.value)}
          />
          {/* <FormControl className="w-[100px]">
            <InputLabel>Currency</InputLabel>
            <Select
              value={currency}
              label="Currency"
              onChange={(e) => setCurrency(e.target.value)}
            >
              <MenuItem value="VND">VND</MenuItem>
              <MenuItem value="USD">USD</MenuItem>
            </Select>
          </FormControl> */}
          <Typography variant="body1" className="font-semibold mt-4 text-gray-600">
            VND
          </Typography>
        </div>
      </div>

      {/* Section 4 */}
      <div className="space-y-4">
        <Typography variant="h6">4. Why are you quitting?</Typography>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {reasonsList.map((r) => (
            <div
              key={r.id}
              onClick={() => toggleSelect(reasons, setReasons, r.value)}
              className={`border rounded p-3 cursor-pointer flex justify-between items-center transition duration-150 ${
                reasons.includes(r.value)
                  ? "bg-orange-100 border-orange-500"
                  : "hover:border-orange-300"
              }`}
            >
              <span>{r.label}</span>
              {reasons.includes(r.value) && <div />}
            </div>
          ))}
        </div>
        {/* <TextField
          fullWidth
          label="Other reasons (optional)"
          multiline
          rows={2}
          value={otherReasons}
          onChange={(e) => setOtherReasons(e.target.value)}
        /> */}
      </div>

      {/* Section 5 */}
      <div className="space-y-4">
        <Typography variant="h6">5. Identify Your Triggers</Typography>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {triggersList.map((t) => (
            <div
              key={t.id}
              onClick={() => toggleSelect(triggers, setTriggers, t.value)}
              className={`border rounded p-3 cursor-pointer flex justify-between items-center transition duration-150 ${
                triggers.includes(t.value)
                  ? "bg-orange-100 border-orange-500"
                  : "hover:border-orange-300"
              }`}
            >
              <span>{t.label}</span>
              {triggers.includes(t.value) && <div />}
            </div>
          ))}
        </div>
        {/* <TextField
          fullWidth
          label="Other triggers (optional)"
          multiline
          rows={2}
          value={otherTriggers}
          onChange={(e) => setOtherTriggers(e.target.value)}
        /> */}
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
        {/* <TextField
          fullWidth
          label="Other strategies or notes (optional)"
          multiline
          rows={2}
          value={otherStrategies}
          onChange={(e) => setOtherStrategies(e.target.value)}
        /> */}
      </div>

      <div>
        <Button variant="contained" color="primary" size="large">
          Create My Plan
        </Button>
      </div>
    </main>
  );
}
