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
import { GroupedSelector } from "./Components/GroupedSelector";
import Card from "../../components/shared/Card";
import { useNavigate } from "react-router-dom";
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
    items: [
      {
        id: "t1",
        value: "OFFERED_CIGARETTE",
        label: "Being offered a cigarette",
      },
      {
        id: "t2",
        value: "DRINKING_ALCOHOL",
        label: "Drinking alcohol or going to a bar",
      },
      {
        id: "t3",
        value: "PARTY_OR_SOCIAL_EVENT",
        label: "Going to a party or social event",
      },
      {
        id: "t4",
        value: "AROUND_OTHERS_SMOKING",
        label: "Being around others who smoke",
      },
      {
        id: "t5",
        value: "SEEING_SOMEONE_SMOKE",
        label: "Seeing someone else smoke",
      },
      {
        id: "t6",
        value: "SMELLING_CIGARETTE_SMOKE",
        label: "Smelling cigarette smoke",
      },
    ],
  },
  {
    group: "Nicotine Withdrawal",
    items: [
      { id: "t7", value: "IRRITABLE", label: "Feeling irritable" },
      {
        id: "t8",
        value: "RESTLESS_OR_JUMPY",
        label: "Feeling restless or jumpy",
      },
      { id: "t9", value: "STRONG_CRAVINGS", label: "Strong cravings to smoke" },
      {
        id: "t10",
        value: "HARD_TIME_CONCENTRATING",
        label: "Hard time concentrating",
      },
      { id: "t11", value: "WAKING_UP", label: "Waking up in the morning" },
    ],
  },
  {
    group: "Routine Situations",
    items: [
      { id: "t12", value: "ON_MY_PHONE", label: "Being on my phone" },
      {
        id: "t13",
        value: "DOWN_TIME",
        label: "Down time or between activities",
      },
      { id: "t14", value: "DRINKING_COFFEE", label: "Drinking coffee" },
      { id: "t15", value: "FINISHING_A_MEAL", label: "Finishing a meal" },
      {
        id: "t16",
        value: "CIGARETTES_ON_TV",
        label: "Seeing cigarettes on TV or movies",
      },
      { id: "t17", value: "WAITING_FOR_RIDE", label: "Waiting for a ride" },
      { id: "t18", value: "WALKING_OR_DRIVING", label: "Walking or driving" },
      {
        id: "t19",
        value: "WATCHING_TV_OR_GAMES",
        label: "Watching TV or gaming",
      },
      { id: "t20", value: "WORKING_OR_STUDYING", label: "Working or studying" },
    ],
  },
  {
    group: "My Emotions",
    items: [
      { id: "t21", value: "ANGRY", label: "Angry" },
      { id: "t22", value: "ANXIOUS", label: "Anxious or nervous" },
      { id: "t23", value: "BORED", label: "Bored" },
      { id: "t24", value: "FRUSTRATED", label: "Frustrated or upset" },
      { id: "t25", value: "HAPPY", label: "Happy or excited" },
      { id: "t26", value: "LONELY", label: "Lonely" },
      { id: "t27", value: "SAD", label: "Sad or depressed" },
      { id: "t28", value: "STRESSED", label: "Stressed or overwhelmed" },
    ],
  },
];

const groupedSupportMethods = [
  {
    group: "Support from People",
    items: [
      {
        value: "PP_SHARE_WITH_IMPORTANT_PEOPLE",
        label: "Share with important people",
      },
      { value: "PP_FIND_QUIT_BUDDY", label: "Find a quit buddy" },
      {
        value: "PP_ASK_SUCCESSFUL_PEOPLE",
        label: "Ask people who quit successfully",
      },
      { value: "PP_JOIN_ONLINE_COMMUNITY", label: "Join an online community" },
      { value: "PP_REACH_OUT_OTHER", label: "Reach out to others for support" },
    ],
  },
  {
    group: "Support from Experts",
    items: [
      {
        value: "EX_TALK_HEALTH_PROFESSIONAL",
        label: "Talk to a health professional",
      },
      { value: "EX_INPERSON_COUNSELING", label: "In-person counseling" },
      { value: "EX_CALL_QUITLINE", label: "Call a quitline" },
      {
        value: "EX_SIGNUP_SMOKEFREE_TEXT",
        label: "Sign up for SmokeFree texts",
      },
      {
        value: "EX_DOWNLOAD_SMOKEFREE_APP",
        label: "Download the SmokeFree app",
      },
      {
        value: "EX_CHAT_ONLINE_COUNSELOR",
        label: "Chat with an online counselor",
      },
      {
        value: "EX_CONNECT_OTHER_EXPERTS",
        label: "Connect with other experts",
      },
    ],
  },
  {
    group: "Distraction Methods",
    items: [
      { value: "DI_DRINK_WATER", label: "Drink water" },
      { value: "DI_EAT_CRUNCHY_SNACK", label: "Eat a crunchy snack" },
      { value: "DI_DEEP_BREATHS", label: "Take deep breaths" },
      { value: "DI_EXERCISE", label: "Exercise or move your body" },
      {
        value: "DI_PLAY_GAME_OR_LISTEN_MEDIA",
        label: "Play a game or listen to music",
      },
      { value: "DI_TEXT_OR_CALL_SUPPORTER", label: "Text or call a supporter" },
      {
        value: "DI_GO_TO_NONSMOKING_PLACE",
        label: "Go to a non-smoking place",
      },
      { value: "DI_FIND_OTHER_DISTRACT", label: "Find other distractions" },
    ],
  },
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
  const navigate = useNavigate();

  const toggleSelect = (list: string[], setList: Function, value: string) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  const handleSubmit = async () => {
    console.log("Submitting quit plan with data:", {
      quitDate,
      duration,
      dailyCigarettes,
      cigaretteCost,
      reasons,
      triggers,
      strategies,
    });
    if (!quitDate) {
      setError("Vui lòng chọn ngày bắt đầu cai thuốc!");
      return;
    }
    if (!duration) {
      setError("Vui lòng chọn thời lượng của kế hoạch!");
      return;
    }
    if (!dailyCigarettes || parseInt(dailyCigarettes) <= 0) {
      setError("Vui lòng nhập số điếu hút mỗi ngày!");
      return;
    }
    if (!cigaretteCost || parseInt(cigaretteCost) <= 0) {
      setError("Vui lòng nhập giá tiền một bao thuốc!");
      return;
    }
    if (reasons.length === 0) {
      setError("Vui lòng chọn ít nhất một lý do cai thuốc!");
      return;
    }
    if (triggers.length === 0) {
      setError("Vui lòng chọn ít nhất một yếu tố kích thích!");
      return;
    }
    if (strategies.length === 0) {
      setError("Vui lòng chọn ít nhất một phương pháp hỗ trợ!");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        startDate: quitDate,
        durationWeeks: parseInt(duration),
        numberOfCigarettes: parseInt(dailyCigarettes),
        pricePerPack: parseInt(cigaretteCost),
        reasons,
        triggers,
        supportMethods: strategies,
      };
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:8082/api/plans",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Kế hoạch của bạn đã được tạo thành công!");
      navigate("/quit-plan");
    } catch (err: any) {
      console.error(err);
      setError("Đã xảy ra lỗi khi tạo kế hoạch.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <div>
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          sx={{ color: "#c2410c" }}
        >
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
        <Card>
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
        </Card>
      </div>

      {/* Section 2 */}
      <div className="space-y-2">
        <Typography variant="h6">2. Duration of Quit Plan</Typography>
        <Card>
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
        </Card>
      </div>

      {/* Section 3 */}
      <div className="space-y-4">
        <Typography variant="h6">3. Smoking Status</Typography>
        <Card>
          <TextField
            fullWidth
            type="number"
            label="Average cigarettes per day"
            value={dailyCigarettes}
            onChange={(e) => setDailyCigarettes(e.target.value)}
          />
        </Card>

        <Card className="flex gap-4 justify-center">
          <TextField
            fullWidth
            label="Cost of each pack"
            value={cigaretteCost}
            onChange={(e) => setCigaretteCost(e.target.value)}
          />
          \
          <Typography
            variant="body1"
            className="font-semibold mt-4 text-gray-600"
          >
            VND
          </Typography>
        </Card>
      </div>

      {/* Section 4 */}
      <div className="space-y-4">
        <Typography variant="h6">4. Why are you quitting?</Typography>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {reasonsList.map((r) => {
            const Icon = r.icon;
            return (
              <Card
                key={r.id}
                onClick={() => toggleSelect(reasons, setReasons, r.value)}
                className={`border rounded p-3 cursor-pointer flex flex-col justify-centes items-center gap-2 transition duration-150 ${
                  reasons.includes(r.value)
                    ? "bg-orange-100 border-orange-500"
                    : "hover:border-orange-300"
                }`}
              >
                <Typography
                  variant="h6"
                  fontWeight={500}
                  sx={{ color: "#c2410c" }}
                >
                  {r.label}
                </Typography>
                <Icon className="text-[#c2410c] w-7 h-7" />
              </Card>
            );
          })}
        </div>
      </div>

      {/* Section 5 */}
      <div className="space-y-4">
        <Typography variant="h6">5. Identify Your Triggers</Typography>

        <GroupedSelector
          groupedItems={groupedTriggers}
          selected={triggers}
          onToggle={(val) => toggleSelect(triggers, setTriggers, val)}
        />
      </div>

      {/* Section 6 */}
      <div className="space-y-4">
        <Typography variant="h6">
          6. How Will You Do It? (Support Methods)
        </Typography>
        <GroupedSelector
          groupedItems={groupedSupportMethods}
          selected={strategies}
          onToggle={(val) => toggleSelect(strategies, setStrategies, val)}
        />
      </div>

      <div className="flex justify-end">
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ backgroundColor: "#c2410c" }}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          Create My Plan
        </Button>
      </div>
    </main>
  );
}
