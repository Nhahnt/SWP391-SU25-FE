import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  CardMedia,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

interface Blog {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  userId: number;
  authorName: string | null;
  createdAt: string;
  updatedAt: string;
  category: string;
  featured: boolean;
  published: boolean;
}

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`http://localhost:8082/api/blogs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBlog(res.data);
      } catch (err) {
        console.error("Không thể load blog:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="md" className="py-8 text-center">
        <CircularProgress />
      </Container>
    );
  }

  if (!blog) {
    return (
      <Container maxWidth="md" className="py-8 text-center">
        <Typography variant="h6">Không tìm thấy bài viết.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" className="py-8">
      <Typography
        variant="h3"
        component="h1"
        className="font-bold text-center mb-6"
      >
        {blog.title}
      </Typography>

      <CardMedia
        component="img"
        height="400"
        image={blog.thumbnail}
        alt={blog.title}
        className="rounded-lg shadow-md object-cover mb-6"
      />

      <Divider className="my-6" />

      <Box className="prose max-w-none text-justify text-gray-800 text-lg leading-relaxed">
        {blog.content.split("\n").map((line, idx) => (
          <Typography key={idx} paragraph>
            {line.trim()}
          </Typography>
        ))}
      </Box>

      <Typography className="mt-8 text-sm text-gray-500 text-center">
        Viết bởi: {blog.authorName || "Ẩn danh"} | Blog ID: {blog.id}
      </Typography>
    </Container>
  );
}
