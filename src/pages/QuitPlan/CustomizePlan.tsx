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
  CardMedia,
  Snackbar,
  Alert,
  CircularProgress,
  Slide,
} from "@mui/material";
import {
  HeartPulse,
  Users,
  PiggyBank,
  Smile,
  Star,
  AlarmClock,
} from "lucide-react";
import axios from "axios";
import Card from "../../components/shared/Card";
import { useNavigate } from "react-router-dom";
import { ExpandMore } from "@mui/icons-material";
import QuitPlanStatus from "./Components/QuitPlanStatus";

const options = ["2", "3", "4", "5", "6"];

const reasonsList = [
  { id: "r1", value: "HEALTH", label: "Sức khỏe", icon: HeartPulse },
  { id: "r2", value: "FAMILY_FRIENDS", label: "Gia đình", icon: Users },
  { id: "r3", value: "SAVE_MONEY", label: "Tiết kiệm tiền", icon: PiggyBank },
  { id: "r4", value: "LOOK_SMELL_BETTER", label: "Ngoại hình", icon: Smile },
  {
    id: "r5",
    value: "GOOD_EXAMPLE",
    label: "Trở thành một tấm gương tốt",
    icon: Star,
  },
  {
    id: "r6",
    value: "TAKE_CONTROL",
    label: "Kiểm soát cuộc sống",
    icon: AlarmClock,
  },
];

const groupedTriggers = [
  {
    group: "Các tình huống xã hội",
    items: [
      {
        id: "t1",
        value: "OFFERED_CIGARETTE",
        label: "Được mời một điếu thuốc",
      },
      {
        id: "t2",
        value: "DRINKING_ALCOHOL",
        label: "Uống rượu bia hoặc đi bar",
      },
      {
        id: "t3",
        value: "PARTY_OR_SOCIAL_EVENT",
        label: "Đi dự tiệc hoặc sự kiện xã hội",
      },
      {
        id: "t4",
        value: "AROUND_OTHERS_SMOKING",
        label: "Ở gần những người hút thuốc khác",
      },
      {
        id: "t5",
        value: "SEEING_SOMEONE_SMOKE",
        label: "Nhìn thấy người khác hút thuốc",
      },
      {
        id: "t6",
        value: "SMELLING_CIGARETTE_SMOKE",
        label: "Ngửi thấy mùi thuốc lá",
      },
    ],
  },
  {
    group: "Hội chứng cai thuốc",
    items: [
      { id: "t7", value: "IRRITABLE", label: "Cảm thấy cáu kỉnh" },
      {
        id: "t8",
        value: "RESTLESS_OR_JUMPY",
        label: "Cảm thấy bồn chồn hoặc lo lắng",
      },
      {
        id: "t9",
        value: "STRONG_CRAVINGS",
        label: "Cơn thèm thuốc lá mãnh liệt",
      },
      {
        id: "t10",
        value: "HARD_TIME_CONCENTRATING",
        label: "Khó tập trung",
      },
      { id: "t11", value: "WAKING_UP", label: "Thức dậy vào buổi sáng" },
    ],
  },
  {
    group: "Các tình huống thường ngày",
    items: [
      { id: "t12", value: "ON_MY_PHONE", label: "Sử dụng điện thoại" },
      {
        id: "t13",
        value: "DOWN_TIME",
        label: "Thời gian rảnh hoặc giữa các hoạt động",
      },
      { id: "t14", value: "DRINKING_COFFEE", label: "Uống cà phê" },
      { id: "t15", value: "FINISHING_A_MEAL", label: "Ăn xong một bữa ăn" },
      {
        id: "t16",
        value: "CIGARETTES_ON_TV",
        label: "Nhìn thấy thuốc lá trên TV hoặc phim ảnh",
      },
      { id: "t17", value: "WAITING_FOR_RIDE", label: "Chờ đợi xe" },
      { id: "t18", value: "WALKING_OR_DRIVING", label: "Đi bộ hoặc lái xe" },
      {
        id: "t19",
        value: "WATCHING_TV_OR_GAMES",
        label: "Xem TV hoặc chơi game",
      },
      {
        id: "t20",
        value: "WORKING_OR_STUDYING",
        label: "Làm việc hoặc học tập",
      },
    ],
  },
  {
    group: "Cảm xúc của tôi",
    items: [
      { id: "t21", value: "ANGRY", label: "Tức giận" },
      { id: "t22", value: "ANXIOUS", label: "Lo lắng hoặc bồn chồn" },
      { id: "t23", value: "BORED", label: "Buồn chán" },
      { id: "t24", value: "FRUSTRATED", label: "Bực bội hoặc khó chịu" },
      { id: "t25", value: "HAPPY", label: "Vui vẻ hoặc hào hứng" },
      { id: "t26", value: "LONELY", label: "Cô đơn" },
      { id: "t27", value: "SAD", label: "Buồn bã hoặc trầm cảm" },
      { id: "t28", value: "STRESSED", label: "Căng thẳng hoặc quá tải" },
    ],
  },
];

const groupedSupportMethods = [
  {
    group: "Sự hỗ trợ từ mọi người",
    items: [
      {
        value: "PP_SHARE_WITH_IMPORTANT_PEOPLE",
        label: "Chia sẻ với những người quan trọng",
      },
      {
        value: "PP_FIND_QUIT_BUDDY",
        label: "Tìm một người bạn đồng hành cai thuốc",
      },
      {
        value: "PP_ASK_SUCCESSFUL_PEOPLE",
        label: "Hỏi những người đã cai thuốc thành công",
      },
      {
        value: "PP_JOIN_ONLINE_COMMUNITY",
        label: "Tham gia một cộng đồng trực tuyến",
      },
      {
        value: "PP_REACH_OUT_OTHER",
        label: "Tìm kiếm sự hỗ trợ từ người khác",
      },
    ],
  },
  {
    group: "Sự hỗ trợ từ chuyên gia",
    items: [
      {
        value: "EX_TALK_HEALTH_PROFESSIONAL",
        label: "Nói chuyện với chuyên gia y tế",
      },
      { value: "EX_INPERSON_COUNSELING", label: "Tham gia tư vấn trực tiếp" },
      { value: "EX_CALL_QUITLINE", label: "Gọi đường dây tư vấn cai thuốc" },
      {
        value: "EX_SIGNUP_SMOKEFREE_TEXT",
        label: "Đăng ký nhận tin nhắn từ SmokeFree",
      },
      {
        value: "EX_DOWNLOAD_SMOKEFREE_APP",
        label: "Tải ứng dụng SmokeFree",
      },
      {
        value: "EX_CHAT_ONLINE_COUNSELOR",
        label: "Trò chuyện với một cố vấn trực tuyến",
      },
      {
        value: "EX_CONNECT_OTHER_EXPERTS",
        label: "Kết nối với các chuyên gia khác",
      },
    ],
  },
  {
    group: "Các phương pháp đánh lạc hướng",
    items: [
      { value: "DI_DRINK_WATER", label: "Uống nước" },
      { value: "DI_EAT_CRUNCHY_SNACK", label: "Ăn một món ăn nhẹ giòn" },
      { value: "DI_DEEP_BREATHS", label: "Hít thở sâu" },
      { value: "DI_EXERCISE", label: "Tập thể dục hoặc vận động" },
      {
        value: "DI_PLAY_GAME_OR_LISTEN_MEDIA",
        label: "Chơi game hoặc nghe nhạc",
      },
      {
        value: "DI_TEXT_OR_CALL_SUPPORTER",
        label: "Nhắn tin hoặc gọi cho người hỗ trợ",
      },
      {
        value: "DI_GO_TO_NONSMOKING_PLACE",
        label: "Đi đến một nơi không có thuốc lá",
      },
      {
        value: "DI_FIND_OTHER_DISTRACT",
        label: "Tìm các phương pháp đánh lạc hướng khác",
      },
    ],
  },
];

export default function CreateQuitPlan() {
  const [quitDate, setQuitDate] = useState("");
  const [duration, setDuration] = useState("");
  const [dailyCigarettes, setDailyCigarettes] = useState("");
  const [cigaretteCost, setCigaretteCost] = useState("");
  const [reasons, setReasons] = useState<string[]>([]);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [strategies, setStrategies] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [snackbarMessages, setSnackbarMessages] = useState<
    { id: number; message: string; severity: "success" | "error" }[]
  >([]);
  const [nextSnackbarId, setNextSnackbarId] = useState(0);

  const navigate = useNavigate();

  const toggleSelect = (list: string[], setList: Function, value: string) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  const toggleGroupSelect = (
    list: string[],
    setList: Function,
    groupItems: string[]
  ) => {
    const allSelected = groupItems.every((item) => list.includes(item));
    if (allSelected) {
      setList(list.filter((item) => !groupItems.includes(item)));
    } else {
      const newSelections = new Set([...list, ...groupItems]);
      setList(Array.from(newSelections));
    }
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    const newSnackbar = { id: nextSnackbarId, message, severity };
    setSnackbarMessages((prev) => [...prev, newSnackbar]);
    setNextSnackbarId((prev) => prev + 1);
  };

  const handleCloseSnackbar = (id: number) => {
    setSnackbarMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  const handleSubmit = async () => {
    setSnackbarMessages([]);
    let hasError = false;

    if (!quitDate) {
      showSnackbar("Vui lòng chọn ngày bắt đầu cai thuốc!", "error");
      hasError = true;
    }
    if (!duration) {
      showSnackbar("Vui lòng chọn thời lượng của kế hoạch!", "error");
      hasError = true;
    }
    if (!dailyCigarettes || parseInt(dailyCigarettes) <= 0) {
      showSnackbar("Vui lòng nhập số điếu hút mỗi ngày!", "error");
      hasError = true;
    }
    // Updated validation for cigarette cost to check for a multiple of 1000
    const cost = parseInt(cigaretteCost);
    if (!cigaretteCost || cost < 1000 || cost % 1000 !== 0) {
      showSnackbar(
        "Vui lòng nhập giá tiền một bao thuốc là bội số của 1000 VND!",
        "error"
      );
      hasError = true;
    }
    if (reasons.length === 0) {
      showSnackbar("Vui lòng chọn ít nhất một lý do cai thuốc!", "error");
      hasError = true;
    }
    if (triggers.length === 0) {
      showSnackbar("Vui lòng chọn ít nhất một yếu tố kích thích!", "error");
      hasError = true;
    }
    if (strategies.length === 0) {
      showSnackbar("Vui lòng chọn ít nhất một phương pháp hỗ trợ!", "error");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        startDate: quitDate,
        durationWeeks: parseInt(duration),
        numberOfCigarettes: parseInt(dailyCigarettes),
        pricePerPack: cost,
        reasons,
        triggers,
        supportMethods: strategies,
      };
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:8082/api/user-defined",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showSnackbar("Kế hoạch của bạn đã được tạo thành công!", "success");
      setTimeout(() => {
        navigate("/view-quit-plan");
      }, 2000);
    } catch (err: any) {
      console.error(err);
      const errorMessage =
        err.response?.data || "Đã xảy ra lỗi khi tạo kế hoạch.";
      showSnackbar(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <QuitPlanStatus>
      <main className="max-w-5xl mx-auto px-4 py-10">
        <div>
          <div className="mb-8">
            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
              sx={{ color: "#c2410c" }}
            >
              Xây dựng kế hoạch cai thuốc cá nhân hóa của bạn
            </Typography>
            <Typography className="text-gray-600">
              Điền vào các mục dưới đây để tạo một kế hoạch cai thuốc phù hợp
              với nhu cầu của bạn. Điều này sẽ giúp bạn duy trì động lực và sự
              chuẩn bị!
            </Typography>
          </div>

          {/* Section 1 */}
          <div className="my-8">
            <Typography variant="h6">1. Chọn ngày bắt đầu cai thuốc</Typography>
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
          <div className="my-8">
            <Typography variant="h6">
              2. Thời lượng của kế hoạch cai thuốc
            </Typography>
            <Card>
              <FormControl fullWidth>
                <InputLabel>Chọn thời lượng</InputLabel>
                <Select
                  value={duration}
                  label="Chọn thời lượng"
                  onChange={(e) => setDuration(e.target.value)}
                >
                  {options.map((week) => (
                    <MenuItem key={week} value={week}>
                      {week} tuần {week === "6" && "(được khuyến khích)"}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Card>
          </div>

          {/* Section 3 */}
          <div className="my-8">
            <Typography variant="h6">3. Tình trạng hút thuốc</Typography>
            <Card>
              <TextField
                fullWidth
                type="number"
                label="Số điếu thuốc hút trung bình mỗi ngày"
                value={dailyCigarettes}
                onChange={(e) => setDailyCigarettes(e.target.value)}
              />
            </Card>
            <Card className="mt-4 flex flex-row">
              <TextField
                fullWidth
                type="number"
                label="Chi phí mỗi bao thuốc (VND)"
                value={cigaretteCost}
                onChange={(e) => setCigaretteCost(e.target.value)}
              />
            </Card>
          </div>

          {/* Section 4 */}
          <div className="my-8">
            <Typography variant="h6">4. Tại sao bạn lại cai thuốc?</Typography>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {reasonsList.map((r) => {
                const Icon = r.icon;
                return (
                  <Card
                    key={r.id}
                    onClick={() => toggleSelect(reasons, setReasons, r.value)}
                    className={`border rounded p-3 cursor-pointer flex flex-col justify-center items-center gap-2 transition duration-150 ${
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
          <div className="my-8">
            <Typography variant="h6">
              5. Nhận diện các yếu tố kích thích
            </Typography>
            <div className="space-y-4">
              {groupedTriggers.map((group) => (
                <Box
                  key={group.group}
                  sx={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    p: 2,
                    bgcolor: "grey.50",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    {group.group}
                  </Typography>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {group.items.map((item) => (
                      <Button
                        key={item.id}
                        onClick={() =>
                          toggleSelect(triggers, setTriggers, item.value)
                        }
                        variant={
                          triggers.includes(item.value)
                            ? "contained"
                            : "outlined"
                        }
                        color="warning"
                        size="small"
                      >
                        {item.label}
                      </Button>
                    ))}
                  </div>
                </Box>
              ))}
            </div>
          </div>

          {/* Section 6 */}
          <div className="my-8">
            <Typography variant="h6">
              6. Bạn sẽ làm điều đó như thế nào? (Các phương pháp hỗ trợ)
            </Typography>
            <div className="space-y-4">
              {groupedSupportMethods.map((group) => (
                <Box
                  key={group.group}
                  sx={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    p: 2,
                    bgcolor: "grey.50",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    {group.group}
                  </Typography>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {group.items.map((item) => (
                      <Button
                        key={item.value}
                        onClick={() =>
                          toggleSelect(strategies, setStrategies, item.value)
                        }
                        variant={
                          strategies.includes(item.value)
                            ? "contained"
                            : "outlined"
                        }
                        color="warning"
                        size="small"
                      >
                        {item.label}
                      </Button>
                    ))}
                  </div>
                </Box>
              ))}
            </div>
          </div>

          <div className="flex justify-end my-8">
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ backgroundColor: "#c2410c" }}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Tạo kế hoạch của tôi"
              )}
            </Button>
          </div>
        </div>
        {snackbarMessages.map((msg, index) => (
          <Snackbar
            key={msg.id}
            open={true}
            autoHideDuration={6000}
            onClose={() => handleCloseSnackbar(msg.id)}
            TransitionComponent={Slide}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            style={{ top: 16 + index * 70 }}
          >
            <Alert
              onClose={() => handleCloseSnackbar(msg.id)}
              severity={msg.severity}
              variant="filled"
              className="shadow-lg"
            >
              {msg.message}
            </Alert>
          </Snackbar>
        ))}
      </main>
    </QuitPlanStatus>
  );
}
