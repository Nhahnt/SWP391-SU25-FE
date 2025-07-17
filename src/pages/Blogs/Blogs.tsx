import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  Button,
  Typography,
} from "@mui/material";
import SearchBar from "../../components/shared/SearchBar";
import AppBreadcrumbs from "../../components/shared/BreadCrumbs";
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
    | "LIFE_STORY"
    | "__";
  featured: boolean;
  published: boolean;
};

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchText, setSearchText] = useState("");
  const [expandedPostIds, setExpandedPostIds] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [likes, setLikes] = useState<Record<number, number>>({});
  const [dislikes, setDislikes] = useState<Record<number, number>>({});
  const [userReactions, setUserReactions] = useState<
    Record<number, "like" | "dislike" | null>
  >({});

  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isStaff = localStorage.getItem("role") === "staff";

  const fetchBlogs = async (currentPage: number, isLoadMore = false) => {
    isLoadMore ? setLoadingMore(true) : setLoadingInitial(true);

    try {
      const res = await axios.get("http://localhost:8082/api/blogs/feed", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: currentPage,
          limit: 10,
          category: "__",
        },
        paramsSerializer: (params) => {
          const query = new URLSearchParams();
          for (const key in params) {
            const value = params[key];
            Array.isArray(value)
              ? value.forEach((v) => query.append(key, v))
              : query.append(key, value);
          }
          return query.toString();
        },
      });

      const data = Array.isArray(res.data) ? res.data : res.data.content || [];
      setBlogs((prev) => [...prev, ...data]);

      if (data.length === 0 || data.length < 10) setHasMore(false);
    } catch (err) {
      console.error("Failed to load blogs:", err);
      setHasMore(false);
    } finally {
      setLoadingInitial(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchBlogs(0);
  }, []);

  useEffect(() => {
    if (page > 0) fetchBlogs(page, true);
  }, [page]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const nearBottom =
        el.scrollTop + el.clientHeight >= el.scrollHeight - 100;

      if (nearBottom && hasMore && !loadingMore && !debounceRef.current) {
        debounceRef.current = setTimeout(() => {
          setPage((prev) => prev + 1);
          debounceRef.current = null;
        }, 300);
      }
    };

    el.addEventListener("scroll", handleScroll);
    return () => {
      el.removeEventListener("scroll", handleScroll);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [loadingMore, hasMore]);

  const toggleExpanded = (id: number) => {
    setExpandedPostIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const formatCategory = (category: string | undefined): string => {
    const map: Record<string, string> = {
      QUIT_JOURNEY: "Quit Journey",
      SUCCES_STORY: "Success Story",
      EXPERIENCE: "Experience",
      MOTIVATION: "Motivational",
      CHALLENGE: "Challenge",
      LIFE_STORY: "Life Story",
    };
    return category ? map[category] || "" : "";
  };

  const handleBlogLikeToggle = async (
    blog: Blog,
    action: "like" | "unlike"
  ) => {
    try {
      const res = await axios.post(
        `http://localhost:8082/api/blogs/${blog.id}/${action}`,
        blog
      );
      return res.data;
    } catch (err) {
      console.error(`Không thể ${action} blog`, err);
      throw err;
    }
  };

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col items-center space-y-4 h-[80vh]">
      <div className="w-full flex justify-between items-center p-4 sticky top-0 z-10 bg-white shadow-sm">
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

      <div
        ref={containerRef}
        className="w-full md:w-[60%] flex flex-col gap-6 px-4 pb-4 overflow-y-auto flex-1"
        style={{ maxHeight: "calc(100vh - 40px)" }}
      >
        {loadingInitial ? (
          <div className="w-full flex justify-center py-10">
            <CircularProgress />
          </div>
        ) : filteredBlogs.length === 0 ? (
          <p className="text-center text-gray-500">Cannot find any blogs.</p>
        ) : (
          filteredBlogs.map((blog) => (
            <Card
              key={blog.id}
              className="shadow-sm rounded-xl transition-all duration-200 bg-white min-h-[70vh]"
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

              <CardContent sx={{ px: 2, pb: 1 }}>
                {/* Content */}
                <Typography variant="body1" className="mb-2">
                  {expandedPostIds.includes(blog.id)
                    ? blog.content
                    : blog.content.length > 200
                    ? `${blog.content.slice(0, 200)}...`
                    : blog.content}
                </Typography>

                {/* Reaction buttons */}
                <Box className="flex items-center justify-between mt-2">
                  <div className="flex gap-2 items-center">
                    <Button
                      size="small"
                      variant={
                        userReactions[blog.id] === "like"
                          ? "contained"
                          : "outlined"
                      }
                      sx={{ minWidth: 60 }}
                      onClick={() => handleBlogLikeToggle(blog, "like")}
                    >
                      👍 {likes[blog.id] || 0}
                    </Button>

                    <Button
                      size="small"
                      variant={
                        userReactions[blog.id] === "dislike"
                          ? "contained"
                          : "outlined"
                      }
                      sx={{ minWidth: 60 }}
                      onClick={() => handleBlogLikeToggle(blog, "unlike")}
                    >
                      👎 {dislikes[blog.id] || 0}
                    </Button>
                  </div>

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
                </Box>
              </CardContent>
            </Card>
          ))
        )}

        {loadingMore && (
          <div className="w-full flex justify-center py-4">
            <CircularProgress size={28} />
          </div>
        )}

        {!hasMore && !loadingInitial && (
          <p className="text-center text-gray-400 text-sm py-4">
            Đã hiển thị tất cả bài viết.
          </p>
        )}
      </div>
    </div>
  );
}
