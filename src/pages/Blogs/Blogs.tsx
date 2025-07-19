import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  Box,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  Button,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import SearchBar from "../../components/shared/SearchBar";
import AppBreadcrumbs from "../../components/shared/BreadCrumbs";
import axios from "axios";
import { Link } from "react-router-dom";

export type Blog = {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  image: string;
  userId: number | null;
  authorName: string | null;
  createdAt: string;
  updatedAt: string;
  category:
    | "QUIT_JOURNEY"
    | "SUCCESS_STORY"
    | "EXPERIENCE"
    | "MOTIVATION"
    | "CHALLENGE"
    | "LIFE_STORY"
    | "__";
  featured: boolean;
  published: boolean;
  likes: number;
  liked: boolean
};

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchText, setSearchText] = useState("");
  const [expandedPostIds, setExpandedPostIds] = useState<number[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [likes, setLikes] = useState<Record<number, number>>({});
  const [dislikes, setDislikes] = useState<Record<number, number>>({});

  const [searchParams, setSearchParams] = useSearchParams();

  const initialPage = parseInt(searchParams.get("page") || "0", 10);
  const initialCategory = searchParams.get("category") || "__";

  const [page, setPage] = useState(initialPage);
  const [category, setCategory] = useState(initialCategory);

  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isStaff = localStorage.getItem("role") === "staff";

  const fetchBlogs = async (
    currentPage: number,
    isLoadMore = false,
    selectedCategory: string = "__"
  ) => {
    isLoadMore ? setLoadingMore(true) : setLoadingInitial(true);

    try {
      // Xây dựng params API
      const params: any = {
        page: currentPage,
        size: 10,
      };

      // Chỉ gửi category khi không phải default
      if (selectedCategory && selectedCategory !== "__") {
        params.category = selectedCategory;
      }

      const res = await axios.get("http://localhost:8082/api/blogs/feed", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      // Xử lý response data
      const newBlogs = Array.isArray(res.data)
        ? res.data
        : res.data.content || [];

      // Update blogs state
      if (isLoadMore) {
        setBlogs((prev: Blog[]) => {
          // Loại bỏ trùng lặp bằng ID
          const existingIds = new Set(prev.map((blog: Blog) => blog.id));
          const uniqueNewBlogs = newBlogs.filter(
            (blog: Blog) => !existingIds.has(blog.id)
          );
          return [...prev, ...uniqueNewBlogs];
        });
      } else {
        setBlogs(newBlogs);
      }

      // Cập nhật hasMore
      setHasMore(newBlogs.length === 10);
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
    if (page > 0) fetchBlogs(page, true, category);
  }, [page, category]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const nearBottom =
        el.scrollTop + el.clientHeight >= el.scrollHeight - 100;

      if (nearBottom && hasMore && !loadingMore && !debounceRef.current) {
        debounceRef.current = setTimeout(() => {
          setPage((prev) => {
          const nextPage = prev + 1;
          setSearchParams({ page: nextPage.toString(), category }); // 👈 cập nhật URL
          return nextPage;
          });

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
      SUCCESS_STORY: "Success Story",
      EXPERIENCE: "Experience",
      MOTIVATION: "Motivational",
      CHALLENGE: "Challenge",
      LIFE_STORY: "Life Story",
    };
    return category ? map[category] || "" : "";
  };

const handleToggleLike = async (blog: Blog) => {
  try {
    await axios.post(
      `http://localhost:8082/api/blogs/${blog.id}/toggle-like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Cập nhật lại blogs state: toggle like
    setBlogs((prevBlogs) =>
      prevBlogs.map((b) =>
        b.id === blog.id
          ? {
              ...b,
              liked: !b.liked,
              likes: b.likes + (b.liked ? -1 : 1),
            }
          : b
      )
    );
  } catch (err) {
    console.error("Lỗi khi toggle like:", err);
  }
}

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
        <Box sx={{ minWidth: 180 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => {
                const val = e.target.value;
                setCategory(val);
                setPage(0);
                setSearchParams({ page: "0", category: val }); 
                fetchBlogs(0, false, val);
              }}
            >
              <MenuItem value="__">All Categories</MenuItem>
              <MenuItem value="QUIT_JOURNEY">Quit Journey</MenuItem>
              <MenuItem value="SUCCESS_STORY">Success Story</MenuItem>
              <MenuItem value="EXPERIENCE">Experience</MenuItem>
              <MenuItem value="MOTIVATION">Motivational</MenuItem>
              <MenuItem value="CHALLENGE">Challenge</MenuItem>
              <MenuItem value="LIFE_STORY">Life Story</MenuItem>
            </Select>
          </FormControl>
        </Box>
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
              <Link to={`/blogs/${blog.id}`}>
                <CardMedia
                  component="img"
                  image={blog.image || "/no-image.png"}
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
              </Link>

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
                    variant={blog.liked ? "contained" : "outlined"}
                    sx={{ minWidth: 60 }}
                    onClick={() => handleToggleLike(blog)}
                     >
                   👍 {blog.likes}
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
