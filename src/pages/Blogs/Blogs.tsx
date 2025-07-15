import { useState, useEffect } from "react";
import SearchBar from "../../components/shared/SearchBar";
import { Box, Container, CircularProgress } from "@mui/material";
import AppBreadcrumbs from "../../components/shared/BreadCrumbs";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  Button,
  Typography,
} from "@mui/material";
import axios from "axios";

export type Blog = {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  userId: number | null;
  authorName: string | null;
  createdAt: string;
  updatedAt: string;
  category:
    | "QUIT_JOURNEY"
    | "SUCCES_STORY"
    | "EXPERIENCE"
    | "MOTIVATION"
    | "CHALLENGE"
    | "LIFE_STORY";
  featured: boolean;
  published: boolean;
};

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchText, setSearchText] = useState("");
  const [expandedPostIds, setExpandedPostIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const isStaff = localStorage.getItem("role") === "staff";
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8082/api/blogs")
      .then((res) => {
        setBlogs(res.data);
      })
      .catch((err) => {
        console.error("Failed to load blogs:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const toggleExpanded = (id: number) => {
    setExpandedPostIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  function formatCategory(category: string | undefined): string {
    switch (category) {
      case "QUIT_JOURNEY":
        return "Quit Journey";
      case "SUCCES_STORY":
        return "Success Story";
      case "EXPERIENCE":
        return "Experience";
      case "MOTIVATION":
        return "Motivational";
      case "CHALLENGE":
        return "Challenge";
      case "LIFE_STORY":
        return "Life Story";
      default:
        return "";
    }
  }

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <div className="w-full flex flex-row items-center justify-between p-4 sticky top-0 z-10 bg-white shadow-sm">
        <AppBreadcrumbs />
        <SearchBar
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        {isStaff && (
          <Button
            variant="contained"
            sx={{ backgroundColor: "#c2410c" }}
            onClick={() => navigate("/create-blog")}
          >
            Create Blog
          </Button>
        )}
      </div>

      <div className="w-[80%] md:w-[50%] flex flex-col gap-6 px-4 pb-4">
        {loading ? (
          <div className="w-full flex justify-center py-10">
            <CircularProgress />
          </div>
        ) : filteredBlogs.length === 0 ? (
          <p className="text-center text-gray-500">Cannot find any blogs.</p>
        ) : (
          filteredBlogs.map((blog) => (
            <Card
              key={blog.id}
              className="shadow-sm rounded-xl transition-all duration-200 bg-white"
            >
              <div className="flex items-center gap-3 px-4 pt-4">
                <div>
                  <p className="font-medium">
                    {blog.authorName || "Anonymous"}{" "}
                    {"> " + formatCategory(blog.category)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(blog.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>

              <CardMedia
                component="img"
                image={blog.thumbnail || "/no-image.png"}
                alt={blog.title}
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.onerror = null;
                  img.src = "/no-image.png";
                }}
                sx={{
                  height: 360,
                  width: "100%",
                  objectFit: "cover",
                  marginTop: 2,
                }}
              />

              <CardContent sx={{ paddingX: 2, paddingBottom: 1 }}>
                <Typography variant="body1" className="mb-2">
                  {expandedPostIds.includes(blog.id)
                    ? blog.content
                    : blog.content.length > 200
                    ? `${blog.content.slice(0, 200)}...`
                    : blog.content}
                </Typography>

                {blog.content.length > 200 && (
                  <Box sx={{ textAlign: "right" }}>
                    <Button
                      size="small"
                      sx={{ color: "#c2410c" }}
                      onClick={() => toggleExpanded(blog.id)}
                    >
                      {expandedPostIds.includes(blog.id)
                        ? "Thu gọn"
                        : "Xem thêm"}
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
