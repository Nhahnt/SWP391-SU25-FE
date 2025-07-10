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
import Card from "../../components/shared/Card";
import { useParams } from "react-router-dom";

const options = ["2", "3", "4", "5", "6"];

const reasonsList = [
  { id: "r1", value: "health", label: "Health" },
  { id: "r2", value: "family", label: "Family" },
  { id: "r3", value: "money", label: "Save Money" },
];

const triggersList = [
  { id: "t1", value: "stress", label: "Stress" },
  { id: "t2", value: "social", label: "Socializing" },
  { id: "t3", value: "drinking", label: "Drinking Alcohol" },
];

const strategiesList = [
  { id: "s1", value: "gum", label: "Chew Gum" },
  { id: "s2", value: "walk", label: "Go for a Walk" },
  { id: "s3", value: "call", label: "Call a Friend" },
];

export default function QuitPlanDetail() {
  const [quitDate, setQuitDate] = useState("");
  const [duration, setDuration] = useState("");
  const [dailyCigarettes, setDailyCigarettes] = useState("");
  const [cigaretteType, setCigaretteType] = useState("");
  const [cigaretteCost, setCigaretteCost] = useState("");
  const [currency, setCurrency] = useState("VND");
  const [reasons, setReasons] = useState<string[]>([]);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [strategies, setStrategies] = useState<string[]>([]);
  const [otherReasons, setOtherReasons] = useState("");
  const [otherTriggers, setOtherTriggers] = useState("");
  const [otherStrategies, setOtherStrategies] = useState("");
  const [isEditting, setIsEditting] = useState(false);
  const { id } = useParams();
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
        "Smoking affects nearly every organ in your body. But the moment you stop, your body begins to heal. Within just 24 hours, your risk of heart attack begins to drop. Over time, your lungs regenerate, your blood pressure stabilizes, and your energy returns. Quitting smoking is the single best thing you can do for your health—and it starts today.",
      emoji: "💪",
    },
    FAMILY_FRIENDS: {
      title: "Be There for Loved Ones",
      message:
        "Your family and friends care about you and want you to live a long, healthy life. Quitting smoking means you’ll have more time and energy to spend with them. It also protects them from secondhand smoke, which can be just as harmful. Show your love by taking care of yourself—and by making sure you're there for every moment that matters.",
      emoji: "👨‍👩‍👧‍👦",
    },
    SAVE_MONEY: {
      title: "Save More Money",
      message:
        "Cigarettes cost you more than your health—they quietly drain your wallet every day. By quitting now, you could save millions of đồng over the next year. Imagine what else you could do with that money: take a trip, buy something meaningful, or invest in your future. Your savings begin the moment you put down that last cigarette.",
      emoji: "💰",
    },
    GOOD_EXAMPLE: {
      title: "Be a Good Example",
      message:
        "Whether you realize it or not, people around you are watching—especially children and teens. By quitting smoking, you show others that change is possible and strength is real. You become a role model for healthier living, and you inspire others to believe in themselves too. Lead by example, and others will follow.",
      emoji: "🌟",
    },
    TAKE_CONTROL: {
      title: "Take Control of Your Life",
      message:
        "Addiction can feel like it controls your day—your moods, your breaks, your stress. But quitting smoking is a powerful way to take your life back. You get to decide when you breathe deep, when you feel calm, and how you handle your emotions. Reclaim your power. You are stronger than any cigarette.",
      emoji: "🧠",
    },
    LOOK_SMELL_BETTER: {
      title: "Look and Smell Better",
      message:
        "Smoking stains your teeth, wrinkles your skin, and leaves a lingering smell on your clothes, hair, and breath. When you quit, your skin becomes clearer, your smile whiter, and your scent fresher. Feel more confident in how you look—and in how others see you. A fresher version of you is just ahead.",
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
      description:
        "Stress is one of the most common triggers for smoking. It often creates an urge to seek relief or distraction.",
      tips: [
        "Practice deep breathing or meditation when you feel overwhelmed.",
        "Take short walks or stretch to release tension.",
        "Listen to calming music or try journaling your thoughts.",
      ],
    },
    Socializing: {
      emoji: "🎉",
      description:
        "Being around others, especially in smoking environments, can make you feel pressure to smoke or return to old habits.",
      tips: [
        "Tell friends you're quitting and ask for their support.",
        "Bring gum or a fidget item to social events.",
        "Stay close to non-smoking friends or step outside when cravings hit.",
      ],
    },
    "Drinking Alcohol": {
      emoji: "🍺",
      description:
        "Alcohol lowers inhibition and is often linked to social smoking, making it easier to slip back into the habit.",
      tips: [
        "Avoid bars or parties where smoking is common during early quit days.",
        "Switch to non-alcoholic drinks temporarily.",
        "Make a plan ahead of time: what will you do if you get a craving?",
      ],
    },
  };

  const toggleSelect = (list: string[], setList: Function, value: string) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  return (
    <main className="max-w-[70%] mx-auto px-4 py-10 space-y-6">
      <div>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          My Quit Plan
        </Typography>
      </div>

      {/* Section 1 */}
      <div className="bg-gradient-to-r from-orange-100 to-yellow-50 rounded-xl p-6 shadow-lg text-center">
        <Typography
          variant="h5"
          className="font-bold text-orange-700 tracking-wide"
        >
          20/08/2025
        </Typography>
        <Typography variant="body1" className="text-gray-700 pt-2">
          Marking your quit date is your first big win...
        </Typography>
      </div>

      {/* Section 2 */}

      <Card className="space-y-8">
        {isEditting ? (
          <div className="space-y-4">
            <Typography variant="h5">Smoking Status</Typography>
            <TextField
              fullWidth
              type="number"
              label="Average amount in a day"
              value={dailyCigarettes}
              onChange={(e) => setDailyCigarettes(e.target.value)}
            />
            <TextField
              fullWidth
              label="Type of tobacco"
              value={cigaretteType}
              onChange={(e) => setCigaretteType(e.target.value)}
            />
            <div className="flex gap-4">
              <TextField
                fullWidth
                label="Cost of each pack"
                value={cigaretteCost}
                onChange={(e) => setCigaretteCost(e.target.value)}
              />
              <FormControl className="w-[100px]">
                <InputLabel>Currency</InputLabel>
                <Select
                  value={currency}
                  label="Currency"
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <MenuItem value="VND">VND</MenuItem>
                  <MenuItem value="USD">USD</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
        ) : (
          <div className="w-full rounded-md flex flex-col gap-8">
            <Typography variant="h5" className="text-orange-700">
              What A Save!
            </Typography>
            <div className="flex flex-row justify-around min-h-[150px] items-center gap-2">
              <div className="flex flex-col items-center w-1/3">
                <img
                  src="/little-punch-of-money.png"
                  alt="Little punch of money"
                  className="w-32 h-32"
                />
                <Typography variant="subtitle2" className="text-gray-600">
                  1 Month
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "green", fontWeight: "bold" }}
                >
                  200.000₫
                </Typography>
              </div>

              <div className="flex flex-col items-center w-1/3">
                <img
                  src="/medium-punch-of-money.png"
                  alt="Big punch of money"
                  className="w-38 h-36"
                />
                <Typography variant="subtitle2" className="text-gray-600">
                  1 Month
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "green", fontWeight: "bold" }}
                >
                  2.000.000₫
                </Typography>
              </div>

              <div className="flex flex-col items-center w-1/3">
                <img
                  src="/big-punch-of-money.png"
                  alt="Medium punch of money"
                  className="w-37 h-36"
                />
                <Typography variant="subtitle2" className="text-gray-600">
                  1 Month
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "green", fontWeight: "bold" }}
                >
                  20.000.000₫
                </Typography>
              </div>
            </div>
            <div className="text-center">
              <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                Every cigarette you give up today not only heals your lungs but
                also saves money for a better future—for you and your loved
                ones.
              </Typography>
            </div>
          </div>
        )}
      </Card>

      {/* Section 3 */}
      {!isEditting && (
        <div className="space-y-4">
          <Typography variant="h5" className="text-gray-800">
            Prepare for quitting
          </Typography>
          <Typography variant="subtitle1" className="text-gray-600 w-[90%]">
            Quitting smoking is easier when you plan ahead. Take time to prepare
            by removing triggers, informing your support network, and setting a
            clear quit date. These small steps will build a strong foundation
            for long-term success.
          </Typography>

          <div className="bg-white rounded-md shadow-md p-4 space-y-3">
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
          </div>
        </div>
      )}
      {/* Section 4 */}
      {isEditting ? (
        <div className="space-y-4">
          <Typography variant="h5">Why are you quitting?</Typography>
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
          <TextField
            fullWidth
            label="Other reasons (optional)"
            multiline
            rows={2}
            value={otherReasons}
            onChange={(e) => setOtherReasons(e.target.value)}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <Typography variant="h5" className="text-gray-800">
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
                  {/* Image */}
                  <div className="md:w-2/5 w-full">
                    <img
                      src={goal.image}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
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
      )}
      {/* Section 5 */}
      {isEditting ? (
        <div className="space-y-4">
          <Typography variant="h6">Your Triggers</Typography>
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
          <TextField
            fullWidth
            label="Other triggers (optional)"
            multiline
            rows={2}
            value={otherTriggers}
            onChange={(e) => setOtherTriggers(e.target.value)}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <Typography variant="h5" className="text-gray-800">
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
      )}

      {isEditting ? (
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => setIsEditting(false)}
        >
          Update my plan
        </Button>
      ) : (
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => setIsEditting(true)}
        >
          Edit my plan
        </Button>
      )}
    </main>
  );
}
