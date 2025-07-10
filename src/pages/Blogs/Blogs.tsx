import { useState } from "react";
import SearchBar from "../../components/shared/SearchBar";
import { Box, Container } from "@mui/material";
import AppBreadcrumbs from "../../components/shared/BreadCrumbs";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Typography,
} from "@mui/material";

type Blog = {
  id: number;
  title: string;
  content: string;
  image: string;
};

const mockBlogs: Blog[] = [
  {
    id: 1,
    title: "How to Quit Smoking",
    content: "Learn effective steps to quit smoking and regain your health.",
    image:
      "https://images.unsplash.com/photo-1512067053627-3cb65e51a128?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // man quitting smoking
  },
  {
    id: 2,
    title: "Healthy Habits for a Better Life",
    content: "Discover daily habits that improve your body and mind.",
    image:
      "https://images.unsplash.com/photo-1512067053627-3cb65e51a128?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // healthy food
  },
  {
    id: 3,
    title: "Benefits of Quitting Smoking",
    content: "See how your body heals after quitting cigarettes.",
    image:
      "https://images.unsplash.com/photo-1512067053627-3cb65e51a128?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // lungs
  },
  {
    id: 4,
    title: "Support Systems that Help",
    content: "Find the right community or app to support your journey.",
    image:
      "https://images.unsplash.com/photo-1512067053627-3cb65e51a128?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // support group
  },
  {
    id: 5,
    title: "Managing Withdrawal Symptoms",
    content: "Tips to reduce cravings and deal with withdrawal.",
    image:
      "https://images.unsplash.com/photo-1512067053627-3cb65e51a128?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // calm/relaxation
  },
];

export default function Blogs() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");

  const filteredBlogs = mockBlogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col items-center bg-white space-y-4">
      {/* Full Width Hero Section */}
      <Box
        sx={{
          background: `
            linear-gradient(to bottom right, rgba(255, 242, 224, 0.8), rgba(255, 255, 255, 0.9)),
            url('/smoking_background.jpg')
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",

          display: "flex",
          alignItems: "center",
          width: "100%",
          height: 240,
        }}
      >
        <Container maxWidth="lg">
          <Box textAlign="center" py={8}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              <Box
                component="span"
                sx={{
                  background: "black",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Blogs
              </Box>
            </Typography>
          </Box>
        </Container>
      </Box>
      <div className="w-full flex flex-row items-center justify-between p-4">
        <AppBreadcrumbs />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <SearchBar
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ background: '#c2410c', fontWeight: 600, textTransform: 'none', boxShadow: 2 }}
            onClick={() => navigate('/blogs/create')}
          >
            Add Blog
          </Button>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 auto-rows-auto gap-6 bg-transparent px-4">
        {filteredBlogs.map((blog) => (
          <Card
            key={blog.id}
            className="shadow-md rounded-lg transform transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1"
          >
            <CardMedia
              component="img"
              image={blog.image}
              alt={blog.title}
              sx={{
                height: 320,
                width: "100%",
                objectFit: "cover",
              }}
            />
            <CardContent
              sx={{
                padding: 2,
              }}
            >
              <Typography
                variant="h6"
                component="div"
                className="font-bold mb-2"
              >
                {blog.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {blog.content}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                color="primary"
                onClick={() => navigate(`/blogs/${blog.id}`)}
              >
                See more
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>
    </div>
  );
}
