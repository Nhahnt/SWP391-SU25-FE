import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Paper,
  LinearProgress,
} from "@mui/material";

type Option = {
  text: string;
  points: number;
};

type Question = {
  question: string;
  options: Option[];
};

type QuizResult = {
  score: number;
  level: string;
  message: string;
  assessmentId: number;
};

interface FagerstromTestRequest {
  answer1: number;
  answer2: number;
  answer3: number;
  answer4: number;
  answer5: number;
  answer6: number;
}

const quizQuestions: Question[] = [
  {
    question: "Bạn hút điếu thuốc đầu tiên sau khi thức dậy bao lâu?",
    options: [
      { text: "Dưới 5 phút", points: 6 }, // Previously 3
      { text: "Từ 6 - 30 phút", points: 4 }, // Previously 2
      { text: "Từ 31 - 60 phút", points: 2 }, // Previously 1
      { text: "Sau 60 phút", points: 0 },
    ],
  },
  {
    question: "Bạn có thấy khó khăn khi không được hút thuốc ở nơi cấm không?",
    options: [
      { text: "Có", points: 2 }, // Previously 1
      { text: "Không", points: 0 },
    ],
  },
  {
    question: "Điếu thuốc nào bạn thấy khó bỏ nhất?",
    options: [
      { text: "Điếu đầu tiên trong ngày", points: 2 }, // Previously 1
      { text: "Bất kỳ điếu nào khác", points: 0 },
    ],
  },
  {
    question: "Bạn hút bao nhiêu điếu thuốc mỗi ngày?",
    options: [
      { text: "Dưới 10 điếu", points: 0 },
      { text: "Từ 11 - 20 điếu", points: 2 }, // Previously 1
      { text: "Từ 21 - 30 điếu", points: 4 }, // Previously 2
      { text: "Trên 31 điếu", points: 6 }, // Previously 3
    ],
  },
  {
    question:
      "Bạn có hút nhiều hơn vào buổi sáng so với phần còn lại của ngày không?",
    options: [
      { text: "Có", points: 2 }, // Previously 1
      { text: "Không", points: 0 },
    ],
  },
  {
    question: "Bạn có hút thuốc khi bị ốm, nằm liệt giường cả ngày không?",
    options: [
      { text: "Có", points: 2 }, // Previously 1
      { text: "Không", points: 0 },
    ],
  },
];

const API_BASE_URL = "http://localhost:8082";

export default function SmokeQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<
    { question: string; answer: string; points: number }[]
  >([]);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const navigate = useNavigate();

  const handleNext = async () => {
    if (selectedAnswerIndex !== null) {
      const currentQuestion = quizQuestions[currentQuestionIndex];
      const selectedOption = currentQuestion.options[selectedAnswerIndex];

      const newAnswer = {
        question: currentQuestion.question,
        answer: selectedOption.text,
        points: selectedOption.points,
      };

      const newAnswers = [...userAnswers];
      newAnswers[currentQuestionIndex] = newAnswer;
      setUserAnswers(newAnswers);
      setSelectedAnswerIndex(null);

      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        await handleFinishQuiz(newAnswers);
      }
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswerIndex(null);
    }
  };

  const getResult = (score: number): Pick<QuizResult, "level" | "message"> => {
    if (score <= 8) {
      return {
        level: "NHẸ",
        message:
          "Bạn có mức độ phụ thuộc nicotine ở mức độ nhẹ. Kế hoạch cai thuốc của bạn nên tập trung vào việc tự giám sát và tìm kiếm các phương pháp thư giãn để đối phó với cơn thèm thuốc đột ngột.",
      };
    } else if (score <= 15) {
      return {
        level: "TRUNG BÌNH",
        message:
          "Bạn có mức độ phụ thuộc nicotine ở mức độ trung bình. Kế hoạch của bạn cần bao gồm việc giảm dần số lượng thuốc và tìm kiếm sự hỗ trợ từ huấn luyện viên.",
      };
    } else {
      return {
        level: "NẶNG",
        message:
          "Bạn có mức độ phụ thuộc nicotine ở mức độ nặng. Bạn nên tìm kiếm sự giúp đỡ từ chuyên gia y tế và cân nhắc các liệu pháp thay thế nicotine.",
      };
    }
  };

  const handleFinishQuiz = async (
    answers: { question: string; answer: string; points: number }[]
  ) => {
    const token = localStorage.getItem("token");
    setLoading(true);

    const requestBody: FagerstromTestRequest = {
      answer1: answers[0]?.points || 0,
      answer2: answers[1]?.points || 0,
      answer3: answers[2]?.points || 0,
      answer4: answers[3]?.points || 0,
      answer5: answers[4]?.points || 0,
      answer6: answers[5]?.points || 0,
    };

    try {
      await axios.post(`${API_BASE_URL}/api/assessments`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      const score = answers.reduce((acc, curr) => acc + curr.points, 0);
      const { level, message } = getResult(score);
      const result: QuizResult = {
        score,
        level,
        message,
        assessmentId: -1,
      };
      setQuizResult(result);
    } catch (error) {
      console.error("Failed to submit quiz results:", error);
      const score = answers.reduce((acc, curr) => acc + curr.points, 0);
      const { level, message } = getResult(score);
      const result: QuizResult = {
        score,
        level,
        message,
        assessmentId: -1,
      };
      setQuizResult(result);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToSuggestedPlan = () => {
    navigate("/quit-plan/suggested", { state: { quizResult } });
  };

  const handleGoToCustomizePlan = () => {
    navigate("/quit-plan/customize", { state: { quizResult } });
  };

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: "700px",
          p: 6,
          borderRadius: "16px",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        {quizResult ? (
          // Result screen
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: "bold", color: "#c2410c", mb: 2 }}
            >
              Kết quả của bạn
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: "semibold", color: "#1a202c", mb: 1 }}
            >
              Mức độ phụ thuộc: {quizResult.level}
            </Typography>
            <Typography variant="body1" sx={{ color: "#4a5568", mb: 4 }}>
              Điểm số của bạn:{" "}
              <span className="font-bold text-lg">{quizResult.score}</span>
            </Typography>
            <Typography variant="body1" sx={{ color: "#4a5568", mb: 4 }}>
              {quizResult.message}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                gap: 2,
                mt: 4,
              }}
            >
              <Button
                variant="contained"
                onClick={handleGoToSuggestedPlan}
                sx={{
                  bgcolor: "#c2410c",
                  "&:hover": { bgcolor: "#a0300a" },
                  py: 1,
                  px: 3,
                  borderRadius: "8px",
                  fontWeight: "bold",
                  textTransform: "none",
                }}
              >
                Kế hoạch gợi ý
              </Button>
              <Button
                variant="outlined"
                onClick={handleGoToCustomizePlan}
                sx={{
                  borderColor: "#6b7280",
                  color: "#6b7280",
                  "&:hover": {
                    bgcolor: "rgba(107, 114, 128, 0.1)",
                    borderColor: "#4b5563",
                  },
                  py: 1,
                  px: 3,
                  borderRadius: "8px",
                  fontWeight: "bold",
                  textTransform: "none",
                }}
              >
                Tạo kế hoạch tùy chỉnh
              </Button>
            </Box>
          </Box>
        ) : (
          // Quiz screen
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: "bold", color: "#c2410c", mb: 2 }}
            >
              Bài kiểm tra mức độ phụ thuộc Nicotine
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 10,
                borderRadius: 5,
                bgcolor: "#e5e7eb",
                "& .MuiLinearProgress-bar": { bgcolor: "#c2410c" },
                mb: 4,
              }}
            />
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "200px",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <Box>
                <Typography variant="h6" sx={{ mb: 4 }}>
                  {currentQuestion.question}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {currentQuestion.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={
                        selectedAnswerIndex === index ? "contained" : "outlined"
                      }
                      onClick={() => setSelectedAnswerIndex(index)}
                      sx={{
                        py: 2,
                        px: 4,
                        borderRadius: "8px",
                        fontWeight: "bold",
                        textTransform: "none",
                        bgcolor:
                          selectedAnswerIndex === index ? "#c2410c" : "white",
                        color:
                          selectedAnswerIndex === index ? "white" : "#c2410c",
                        borderColor:
                          selectedAnswerIndex === index ? "#c2410c" : "#e5e7eb",
                        "&:hover": {
                          bgcolor:
                            selectedAnswerIndex === index
                              ? "#a0300a"
                              : "#f3f4f6",
                          borderColor: "#c2410c",
                        },
                      }}
                    >
                      {option.text}
                    </Button>
                  ))}
                </Box>
              </Box>
            )}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 4,
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={currentQuestionIndex === 0}
                sx={{
                  borderColor: "#6b7280",
                  color: "#6b7280",
                  "&:hover": {
                    bgcolor: "rgba(107, 114, 128, 0.1)",
                    borderColor: "#4b5563",
                  },
                  py: 1,
                  px: 3,
                  borderRadius: "8px",
                  fontWeight: "bold",
                  textTransform: "none",
                }}
              >
                Quay lại
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={selectedAnswerIndex === null}
                sx={{
                  bgcolor: "#c2410c",
                  "&:hover": { bgcolor: "#a0300a" },
                  py: 1,
                  px: 3,
                  borderRadius: "8px",
                  fontWeight: "bold",
                  textTransform: "none",
                }}
              >
                {currentQuestionIndex === quizQuestions.length - 1
                  ? "Kết thúc"
                  : "Tiếp tục"}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </div>
  );
}