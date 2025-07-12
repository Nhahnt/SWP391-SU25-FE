import { Container, Typography, Box, Button, Paper } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import {
  Heart,
  Zap,
  TrendingUp,
  Smile,
  Users,
  Clock,
  Leaf,
  Sun,
} from "lucide-react";

const benefits = [
  {
    icon: <Heart color="#c2410c" size={32} />,
    title: "Improved Health",
    desc: "Reduce your risk of heart disease, lung cancer, and other illnesses.",
  },
  {
    icon: <Zap color="#c2410c" size={32} />,
    title: "Increased Energy",
    desc: "Feel more energetic and less tired throughout the day.",
  },
  {
    icon: <TrendingUp color="#c2410c" size={32} />,
    title: "Save Money",
    desc: "Quitting smoking can save you a significant amount of money.",
  },
  {
    icon: <Smile color="#c2410c" size={32} />,
    title: "Better Appearance",
    desc: "Improve skin, teeth, and overall appearance.",
  },
  {
    icon: <Users color="#c2410c" size={32} />,
    title: "Protect Loved Ones",
    desc: "Shield family from harmful secondhand smoke.",
  },
  {
    icon: <Clock color="#c2410c" size={32} />,
    title: "More Time",
    desc: "Gain more time and freedom from cigarette breaks.",
  },
  {
    icon: <Leaf color="#c2410c" size={32} />,
    title: "Fresher Breath",
    desc: "Eliminate bad breath and improve oral hygiene.",
  },
  {
    icon: <Sun color="#c2410c" size={32} />,
    title: "Enhanced Senses",
    desc: "Regain your sense of taste and smell.",
  },
];

export default function HomePage() {
  return (
    <Box
      sx={{
        background:
          "linear-gradient(to bottom right, rgb(254, 237, 227), #ffffff)",
        minHeight: "100vh",
      }}
    >
      {/* Full Width Hero Section */}
      <Box
        sx={{
          background: `
            linear-gradient(to bottom right, rgba(254, 237, 227, 0.8), rgba(255, 255, 255, 0.9)),
            url('/smoking_background.jpg')
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Container maxWidth="lg">
          <Box textAlign="center" py={8}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Start Your Journey to{" "}
              <Box
                component="span"
                sx={{
                  background: "linear-gradient(45deg, #c2410c, #9a3412)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Quit Smoking
              </Box>
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              mb={4}
              sx={{ maxWidth: "600px", mx: "auto" }}
            >
              We're here to support you on your journey to quit smoking. Take
              the first step towards a healthier life today.
            </Typography>
            {
              <Button
                component={RouterLink}
                to="/create-quit-plan"
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
            }
          </Box>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Container maxWidth="lg">
        <Box mt={8} py={4}>
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            gutterBottom
          >
            Benefits of Quitting
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            mb={6}
            sx={{ maxWidth: "600px", mx: "auto" }}
          >
            Discover the positive changes your body and life will experience
            when you quit smoking.
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              justifyContent: "center",
            }}
          >
            {benefits.map((benefit, idx) => (
              <Box
                key={idx}
                sx={{
                  flex: {
                    xs: "1 1 100%",
                    sm: "1 1 calc(50% - 12px)",
                    md: "1 1 calc(25% - 18px)",
                  },
                  minWidth: "250px",
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 3,
                    textAlign: "center",
                    height: "100%",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      elevation: 3,
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <Box
                    mb={2}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    {benefit.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {benefit.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {benefit.desc}
                  </Typography>
                </Paper>
              </Box>
            ))}
          </Box>
        </Box>
        {/* Simple CTA */}
        <Box textAlign="center" mt={8} py={6}>
          <Paper
            sx={{
              p: 4,
              bgcolor: "#fef2e7",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: 2,
              },
            }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Ready to Get Started?
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              Take control of your health and start your smoke-free journey
              today.
            </Typography>
            <Button
              component={RouterLink}
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
              Get started now
            </Button>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}
