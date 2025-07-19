import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import Card from "../../components/shared/Card";
import axios from "axios";
import { Link } from "react-router-dom";

const quitChecklist = [
  "Throw away cigarettes and lighters",
  "Tell family and friends about your quit plan",
  "Plan how to handle cravings",
  "Decide on your quit day",
  "Think about your reasons for quitting",
  "Find things to do instead of smoking",
];

const motivationMap = {
  HEALTH: {
    title: "Improve Your Health",
    message:
      "Smoking affects nearly every organ in your body. But the moment you stop, your body begins to heal...",
    emoji: "💪",
  },
  FAMILY_FRIENDS: {
    title: "Be There for Loved Ones",
    message:
      "Your family and friends care about you and want you to live a long, healthy life...",
    emoji: "👨‍👧",
  },
  SAVE_MONEY: {
    title: "Save More Money",
    message:
      "Cigarettes cost you more than your health—they quietly drain your wallet every day...",
    emoji: "💰",
  },
  GOOD_EXAMPLE: {
    title: "Be a Good Example",
    message:
      "Whether you realize it or not, people around you are watching—especially children and teens...",
    emoji: "✨",
  },
  TAKE_CONTROL: {
    title: "Take Control of Your Life",
    message:
      "Addiction can feel like it controls your day—your moods, your breaks, your stress...",
    emoji: "🧠",
  },
  LOOK_SMELL_BETTER: {
    title: "Look and Smell Better",
    message:
      "Smoking stains your teeth, wrinkles your skin, and leaves a lingering smell on your clothes...",
    emoji: "✨",
  },
};

const selectedGoals = [
  {
    key: "HEALTH",
    image:
      "https://images.onlymyhealth.com/imported/images/2024/July/09_Jul_2024/Main_lungs.jpg",
  },
  {
    key: "FAMILY_FRIENDS",
    image:
      "https://img.freepik.com/premium-vector/concept-no-smoking-world-no-tobacco-day-with-family_60545-500.jpg",
  },
  {
    key: "SAVE_MONEY",
    image:
      "https://imageio.forbes.com/specials-images/imageserve//62b082cf14a8ab3ca2174b56/0x0.jpg?format=jpg&height=900&width=1600&fit=bounds",
  },
  {
    key: "GOOD_EXAMPLE",
    image:
      "https://i.tribune.com.pk/media/images/908278-SmokingIsNotAllowed-1435039874/908278-SmokingIsNotAllowed-1435039874.jpg",
  },
  {
    key: "TAKE_CONTROL",
    image:
      "https://www.makatimed.net.ph/wp-content/uploads/2021/04/How-to-Quit-Smoking-8-Unusual-Yet-Effective-Ways.jpg",
  },
  {
    key: "LOOK_SMELL_BETTER",
    image:
      "https://img.freepik.com/premium-photo/young-man-striped-tshirt-braking-cigarette_380164-248958.jpg",
  },
];

const triggerTips = {
  Stress: {
    emoji: "🧘‍♂️",
    description: "Stress is one of the most common triggers for smoking...",
    tips: [
      "Practice deep breathing or meditation",
      "Take short walks or stretch",
      "Listen to calming music or journal your thoughts",
    ],
  },
  Socializing: {
    emoji: "🎉",
    description: "Being around others, especially in smoking environments...",
    tips: [
      "Tell friends you're quitting",
      "Bring gum or a fidget item",
      "Stay close to non-smoking friends",
    ],
  },
  "Drinking Alcohol": {
    emoji: "🍺",
    description:
      "Alcohol lowers inhibition and is often linked to social smoking...",
    tips: [
      "Avoid bars during early quit days",
      "Switch to non-alcoholic drinks",
      "Plan ahead how to handle cravings",
    ],
  },
};
interface PlanData {
  startDate: string;
  numberOfCigarettes: number;
  pricePerPack: number;
  dailyCost: number;
  weeklyCost: number;
  monthlyCost: number;
  yearlyCost: number;
  reasons: string[];
  triggers: string[];
  tips: string[];
  taperingSchedule: TaperingScheduleItem[];
}
export interface TaperingScheduleItem {
  weekNumber: number;
  startDate: string; // ISO date string, e.g., "2025-07-14"
  endDate: string; // ISO date string
  cigarettesPerDay: number;
  note: string | null;
}

export default function QuitPlanDetail() {
  const [plan, setPlan] = useState<PlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasPlan, setHasPlan] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8082/api/plans", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setPlan(res.data);
        setHasPlan(true);
      } catch (err: any) {
        console.error("❌ Failed to fetch plan", err);
        if (err?.response?.status === 404) {
          setHasPlan(false);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, []);

  if (hasPlan === null || loading) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  if (!hasPlan) {
    return (
      <div className="w-full flex flex-col items-center justify-center h-64">
        <Typography
          variant="h5"
          sx={{ color: "#c2410c", fontWeight: "bold", mb: 2 }}
        >
          You have no Quit Plan
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Click the button below to create one!
        </Typography>
        <Button
          component={Link}
          to="/quit-plan"
          variant="contained"
          size="large"
          sx={{
            bgcolor: "#c2410c",
            "&:hover": {
              bgcolor: "#9a3412",
              transform: "translateY(-1px)",
            },
            px: 4,
            py: 1.5,
            textTransform: "none",
            fontSize: "1.1rem",
            transition: "all 0.2s ease",
          }}
        >
          Create a Quit Plan
        </Button>
      </div>
    );
  }

  return (
    <main className="max-w-[70%] mx-auto px-4 py-10 space-y-6">
      <div>
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          sx={{ color: "#c2410c" }}
        >
          My Quit Plan
        </Typography>
      </div>

      <div className="bg-gradient-to-r from-orange-100 to-yellow-50 rounded-xl p-6 shadow-lg text-center">
        <Typography
          variant="h5"
          className="font-bold text-orange-700 tracking-wide"
        >
          {plan?.startDate}
        </Typography>
        <Typography variant="body1" className="text-gray-700 pt-2">
          Marking your quit date is your first big win...
        </Typography>
      </div>
      <Card className="space-y-8">
        <div className="w-full rounded-md flex flex-col gap-8">
          <Typography variant="h5" className="text-orange-700">
            Weekly Plan
          </Typography>
          <div className="flex flex-wrap -mx-2">
            {plan?.taperingSchedule.map((week, i) => (
              <div key={i} className="w-full sm:w-1/2 md:w-1/3 px-2 mb-4">
                <Card className="h-full p-4 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <Typography
                    variant="h6"
                    className="text-orange-600 font-semibold text-center mb-2"
                  >
                    Week {week.weekNumber}
                  </Typography>
                  <div className="text-sm text-gray-800 space-y-1">
                    <Typography variant="body2">
                      <span className="font-medium text-gray-500">From:</span>{" "}
                      {week.startDate}
                    </Typography>
                    <Typography variant="body2">
                      <span className="font-medium text-gray-500">To:</span>{" "}
                      {week.endDate}
                    </Typography>
                    <Typography variant="body2">
                      <span className="font-medium text-gray-500">Target:</span>{" "}
                      {week.cigarettesPerDay} cig/day
                    </Typography>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </Card>
      <Card className="space-y-8">
        <div className="w-full rounded-md flex flex-col gap-8">
          <Typography variant="h5" className="text-orange-700">
            What A Save!
          </Typography>
          <div className="flex flex-row justify-around min-h-[150px] items-center gap-2">
            {[plan?.weeklyCost, plan?.monthlyCost, plan?.yearlyCost].map(
              (money, i) => (
                <div key={i} className="flex flex-col items-center w-1/3">
                  <img
                    src={`/${
                      ["little", "medium", "big"][i]
                    }-punch-of-money.png`}
                    alt="Punch of money"
                    className="w-32 h-32"
                  />
                  <Typography variant="subtitle2" className="text-gray-600">
                    1 Month
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "green", fontWeight: "bold" }}
                  >
                    {money}₫
                  </Typography>
                </div>
              )
            )}
          </div>
          <div className="text-center">
            <Typography variant="body2" sx={{ fontStyle: "italic" }}>
              Every cigarette you give up today not only heals your lungs but
              also saves money for a better future—for you and your loved ones.
            </Typography>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <Typography variant="h5" className="text-orange-700">
          Prepare for quitting
        </Typography>
        <Typography variant="subtitle1" className="text-gray-600 w-[90%]">
          Quitting smoking is easier when you plan ahead...
        </Typography>
        {/* <div className="bg-white rounded-md shadow-md p-4 space-y-3">
          {quitChecklist.map((item, index) => (
            <label
              key={index}
              className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 rounded-md p-2 transition"
            >
              <input
                type="checkbox"
                className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <Typography variant="body1" className="text-gray-700">
                {item}
              </Typography>
            </label>
          ))}
        </div> */}
      </div>

      <div className="space-y-4">
        <Typography variant="h5" className="text-orange-700">
          Focus on your targets
        </Typography>
        <div className="space-y-10">
          {selectedGoals.map((goal, index) => {
            const { title, message, emoji } =
              motivationMap[goal.key as keyof typeof motivationMap];

            const isEven = index % 2 === 0;

            return (
              <div
                key={goal.key}
                className={`flex flex-col md:flex-row ${
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                } w-full items-stretch rounded-xl shadow-lg overflow-hidden bg-white`}
              >
                <div className="md:w-2/5 w-full">
                  <img
                    src={goal.image}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="md:w-3/5 w-full p-8 flex flex-col justify-center bg-gradient-to-br from-white to-orange-50">
                  <Typography
                    variant="h6"
                    className="flex items-center gap-2 text-orange-700 font-bold tracking-wide"
                  >
                    <span>{emoji}</span> {title}
                  </Typography>
                  <Typography variant="body1" className="text-gray-700 pt-2">
                    {message}
                  </Typography>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-6">
        <Typography variant="h5" className="text-orange-700">
          Avoid Triggers
        </Typography>

        {Object.entries(triggerTips).map(([trigger, data]) => (
          <div
            key={trigger}
            className="bg-white rounded-md shadow-md p-4 space-y-3"
          >
            <Typography
              variant="h6"
              className="flex items-center gap-2 text-orange-700"
            >
              <span>{data.emoji}</span> {trigger}
            </Typography>

            <Typography variant="body1" className="text-gray-700">
              {data.description}
            </Typography>

            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              {data.tips.map((tip, i) => (
                <li key={i}>
                  <Typography variant="body1">{tip}</Typography>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <a href="/progress-tracking">
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ backgroundColor: "#c2410c" }}
          >
            Progress Tracking
          </Button>
        </a>
      </div>
    </main>
  );
}
