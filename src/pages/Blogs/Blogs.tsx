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
  ToggleButton,
  ToggleButtonGroup,
  Avatar,
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
  userName: string | null;
  avatarUrl: string | null;
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
  const [sortType, setSortType] = useState<'date' | 'likes'>("date");
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>("desc");

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
        size: 6, // Show 6 blogs at a time
        published: true, // Only show published blogs
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
      const responseData = res.data;
      const newBlogs = responseData.content || [];

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

      // Cập nhật hasMore dựa trên response
      setHasMore(responseData.hasNext || newBlogs.length === 6);
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

  const getAuthorDisplayName = (blog: Blog): string => {
    return blog.userName || "Anonymous";
  };

  const getAuthorInitials = (blog: Blog): string => {
    const name = getAuthorDisplayName(blog);
    if (!name || name === "Anonymous") return "A";
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
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

  // Sort blogs by createdAt or likes
  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    if (sortType === "date") {
      return sortOrder === "desc"
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else {
      return sortOrder === "desc"
        ? b.likes - a.likes
        : a.likes - b.likes;
    }
  });

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center">
      {/* Sticky Top Bar */}
      <div className="w-full flex flex-col md:flex-row md:justify-between md:items-center gap-4 p-6 sticky top-0 z-20 bg-white/90 backdrop-blur shadow-md border-b border-gray-100">
        <div className="flex-1 flex items-center gap-4">
          <AppBreadcrumbs />
          <SearchBar
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="ml-2"
          />
        </div>
        <div className="flex items-center gap-3">
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
          {/* Sort Button Group */}
          <ToggleButtonGroup
            value={`${sortType}-${sortOrder}`}
            exclusive
            onChange={(_, value) => {
              if (!value) return;
              const [type, order] = value.split("-");
              setSortType(type as 'date' | 'likes');
              setSortOrder(order as 'desc' | 'asc');
            }}
            size="small"
            sx={{ ml: 1, background: '#f3f4f6', borderRadius: 2 }}
          >
            <ToggleButton value="date-desc" sx={{ fontWeight: 500 }}>
              Newest
            </ToggleButton>
            <ToggleButton value="date-asc" sx={{ fontWeight: 500 }}>
              Oldest
            </ToggleButton>
            <ToggleButton value="likes-desc" sx={{ fontWeight: 500 }}>
              Most Liked
            </ToggleButton>
            <ToggleButton value="likes-asc" sx={{ fontWeight: 500 }}>
              Least Liked
            </ToggleButton>
          </ToggleButtonGroup>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#2563eb", ml: 2, borderRadius: 2, boxShadow: 2, textTransform: 'none', fontWeight: 600 }}
            onClick={() => navigate("/create-blog")}
          >
            + Add Blog
          </Button>
        </div>
      </div>

      {/* Blog Cards Grid */}
      <div
        ref={containerRef}
        className="w-full max-w-7xl px-4 py-8 flex-1 overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 80px)" }}
      >
        {loadingInitial ? (
          <div className="w-full flex justify-center py-20">
            <CircularProgress />
          </div>
        ) : sortedBlogs.length === 0 ? (
          <p className="text-center text-gray-500 text-lg mt-16">Cannot find any blogs.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedBlogs.map((blog) => (
              <Card
                key={blog.id}
                className="transition-all duration-200 bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] flex flex-col min-h-[480px] border border-gray-100"
                sx={{ width: '100%', maxWidth: 420, margin: '0 auto', display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                <Link to={`/blogs/${blog.id}`} className="block">
                  <CardMedia
                    component="img"
                    image={blog.image || "/no-image.png"}
                    alt={blog.title}
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.onerror = null;
                      img.src = "/no-image.png";
                    }}
                    sx={{ height: 220, width: "100%", objectFit: "cover", borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
                  />
                </Link>
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', px: 3, pb: 2 }}>
                  {/* Author, Category, Date */}
                  <div className="flex items-center gap-3 mb-2 mt-1">
                    <div className="flex items-center gap-2">
                      <Avatar 
                        src={blog.avatarUrl || undefined}
                        sx={{ 
                          width: 24, 
                          height: 24, 
                          fontSize: '0.75rem',
                          bgcolor: '#2563eb',
                          color: 'white'
                        }}
                      >
                        {getAuthorInitials(blog)}
                      </Avatar>
                      <span className="font-semibold text-gray-800 text-sm">
                        {getAuthorDisplayName(blog)}
                      </span>
                    </div>
                    <span className="text-xs text-blue-600 font-medium">
                      {formatCategory(blog.category)}
                    </span>
                    <span className="ml-auto text-xs text-gray-400">
                      {new Date(blog.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  {/* Title */}
                  <Typography variant="h6" className="font-bold text-lg mb-2 text-gray-900 line-clamp-2">
                    {blog.title}
                  </Typography>
                  {/* Content */}
                  <Typography variant="body2" className="mb-3 text-gray-700 line-clamp-4">
                    {expandedPostIds.includes(blog.id)
                      ? blog.content
                      : blog.content.length > 200
                      ? `${blog.content.slice(0, 200)}...`
                      : blog.content}
                  </Typography>
                  {/* Actions */}
                  <Box className="flex items-center justify-between mt-auto pt-2">
                    <Button
                      size="small"
                      variant={blog.liked ? "contained" : "outlined"}
                      sx={{ minWidth: 60, borderRadius: 2, fontWeight: 600, boxShadow: blog.liked ? 2 : 0, backgroundColor: blog.liked ? '#2563eb' : undefined, color: blog.liked ? 'white' : '#2563eb', borderColor: '#2563eb', '&:hover': { backgroundColor: '#1d4ed8', color: 'white' } }}
                      onClick={() => handleToggleLike(blog)}
                    >
                      👍 {blog.likes}
                    </Button>
                    {blog.content.length > 200 && (
                      <Button
                        size="small"
                        sx={{ color: "#c2410c", fontWeight: 500, textTransform: 'none' }}
                        onClick={() => toggleExpanded(blog.id)}
                      >
                        {expandedPostIds.includes(blog.id)
                          ? "Show less"
                          : "Read more"}
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {loadingMore && (
          <div className="w-full flex justify-center py-8">
            <CircularProgress size={28} />
          </div>
        )}

        {!hasMore && !loadingInitial && (
          <p className="text-center text-gray-400 text-sm py-8">
            You have reached the end of all blogs.
          </p>
        )}
      </div>
    </div>
  );
}
