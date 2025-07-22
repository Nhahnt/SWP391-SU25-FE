import { useParams } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  Container,
  Typography,
  Box,
  CardMedia,
  Divider,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";

type Blog = {
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
};

type Comment = {
  id: number;
  content: string;
  createdAt: string;
  userFullName: string | null;
};

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loadingBlog, setLoadingBlog] = useState(true);
  const [errorBlog, setErrorBlog] = useState<string | null>(null);

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [page, setPage] = useState(0); // Trang hiện tại được yêu cầu
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [submittingComment, setSubmittingComment] = useState(false);

  const getAuthToken = () => localStorage.getItem("token");

  const fetchBlog = async () => {
    setLoadingBlog(true);
    setErrorBlog(null);
    const token = getAuthToken();

    try {
      const res = await fetch(`http://localhost:8082/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Bài viết không tồn tại.");
        }
        throw new Error("Đã xảy ra lỗi khi tải bài viết.");
      }
      const data = await res.json();
      setBlog(data);
    } catch (error: any) {
      console.error("Error fetching blog:", error);
      setErrorBlog(error.message);
    } finally {
      setLoadingBlog(false);
    }
  };

  // Hàm này chỉ thực hiện việc fetch dữ liệu bình luận cho một trang cụ thể.
  // Nó không quản lý trạng thái loadingComments hay hasMore bên trong nó để tránh loop.
  // Các trạng thái này sẽ được quản lý ở nơi gọi hàm này.
  const loadCommentsPage = useCallback(
    async (pageNumber: number) => {
      const token = getAuthToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      try {
        const res = await fetch(
          `http://localhost:8082/api/blogs/${id}/comments/load-more?page=${pageNumber}&size=3`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch comments.");
        }
        const data = await res.json();
        return data;
      } catch (error) {
        console.error("Error fetching comments:", error);
        return null; // Trả về null hoặc xử lý lỗi tùy ý
      }
    },
    [id]
  ); // Dependencies chỉ cần id vì nó là tham số cố định cho API

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    const token = getAuthToken();
    if (!token) {
      alert("Bạn cần đăng nhập để gửi bình luận.");
      return;
    }

    setSubmittingComment(true);
    try {
      const res = await fetch(
        `http://localhost:8082/api/blogs/${id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: commentText }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to post comment");
      }

      const newComment = await res.json();
      setComments((prev) => [newComment, ...prev]);
      setCommentText("");
    } catch (error: any) {
      console.error("Error submitting comment:", error);
      alert(`Lỗi khi gửi bình luận: ${error.message}`);
    } finally {
      setSubmittingComment(false);
    }
  };

  // Effect để fetch blog và tải bình luận trang đầu tiên
  useEffect(() => {
    if (id) {
      fetchBlog();
      setComments([]);
      setPage(0); // Bắt đầu từ trang 0
      setHasMore(true);

      const fetchInitialComments = async () => {
        setLoadingComments(true);
        const data = await loadCommentsPage(0); // Tải trang 0
        if (data) {
          setComments(data.content);
          setHasMore(!data.last);
          setPage(data.number + 1); // Đặt page thành 1 cho lần tải tiếp theo
        }
        setLoadingComments(false);
      };
      fetchInitialComments();
    }
  }, [id, loadCommentsPage]); // loadCommentsPage là dependency

  // Effect để xử lý việc tải thêm bình luận khi cuộn (IntersectionObserver)
  useEffect(() => {
    // Nếu đang tải, không còn dữ liệu hoặc chưa có loaderRef thì không làm gì
    if (loadingComments || !hasMore || !loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingComments) {
          if (!getAuthToken()) {
            console.warn("Không có token, không tải thêm bình luận.");
            return;
          }
          // Khi loaderRef xuất hiện, tải trang tiếp theo (page hiện tại)
          const fetchNextComments = async () => {
            setLoadingComments(true);
            const data = await loadCommentsPage(page);
            if (data) {
              setComments((prev) => [...prev, ...data.content]);
              setHasMore(!data.last);
              setPage(data.number + 1); // Cập nhật trang cho lần tải tiếp theo
            }
            setLoadingComments(false);
          };
          fetchNextComments();
        }
      },
      { threshold: 1.0 }
    );

    const target = loaderRef.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [page, hasMore, loadingComments, loadCommentsPage]); // Dependencies cho observer

  // Hiển thị trạng thái loading ban đầu cho blog
  if (loadingBlog) {
    return (
      <Container maxWidth="md" className="flex justify-center py-20">
        <CircularProgress size={48} />
      </Container>
    );
  }

  // Hiển thị lỗi nếu không tải được blog
  if (errorBlog) {
    return (
      <Container maxWidth="md" className="flex justify-center py-20">
        <Typography variant="h6" color="error">
          {errorBlog}
        </Typography>
      </Container>
    );
  }

  // Nếu blog là null sau khi tải (ví dụ: ID không hợp lệ và không có lỗi cụ thể)
  if (!blog) {
    return (
      <Container maxWidth="md" className="flex justify-center py-20">
        <Typography variant="h6" color="textSecondary">
          Không tìm thấy bài viết.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" className="mt-10" sx={{ maxWidth: { xs: '100%', xl: 1400 } }}>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Blog Content Left (2/3) */}
        <div className="w-full lg:w-2/3 min-w-0">
          <Box className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-100">
            <Typography
              variant="h4"
              className="font-bold text-3xl md:text-4xl text-gray-900 mb-3"
            >
              {blog.title}
            </Typography>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
              <span className="px-2 py-1 bg-blue-50 rounded text-blue-700 font-medium border border-blue-100">{blog.category}</span>
              <span>•</span>
              <span>
                {new Date(blog.createdAt).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
              {blog.authorName && (
                <>
                  <span>•</span>
                  <span className="font-semibold">{blog.authorName}</span>
                </>
              )}
            </div>
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
                borderRadius: 12,
              }}
            />
            <Typography
              variant="body1"
              className="leading-relaxed text-gray-800 mt-8 mb-2 whitespace-pre-line text-lg"
            >
              {blog.content}
            </Typography>
          </Box>
        </div>
        {/* Comments Right (1/3) */}
        <div className="w-full lg:w-1/3 flex-shrink-0">
          <Box className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-24">
            <Typography variant="h6" className="font-semibold text-xl mb-4">
              Bình luận
            </Typography>
            {getAuthToken() ? (
              <div className="mb-6">
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  maxRows={5}
                  placeholder="Viết bình luận..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={submittingComment}
                  className="bg-gray-50 rounded-lg"
                />
                <div className="flex justify-end mt-2">
                  <Button
                    variant="contained"
                    onClick={handleCommentSubmit}
                    disabled={!commentText.trim() || submittingComment}
                    sx={{ borderRadius: 2, fontWeight: 600 }}
                  >
                    {submittingComment ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      "Gửi"
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <Box className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
                <Typography variant="body2">
                  Vui lòng <span className="font-semibold">đăng nhập</span> để gửi bình luận.
                </Typography>
              </Box>
            )}
            <Box className="max-h-[400px] overflow-y-auto mb-2 pr-2">
              {comments.length === 0 && !loadingComments && !hasMore && (
                <div className="py-4 text-center text-sm text-gray-500">
                  Chưa có bình luận nào.
                </div>
              )}
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 bg-gray-50 rounded-lg shadow-sm mb-4 border border-gray-200"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Typography className="text-base font-bold text-gray-800">
                      {comment.userFullName || "Ẩn danh"}
                    </Typography>
                    <Typography className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "numeric",
                        month: "numeric",
                        year: "numeric",
                      })}
                    </Typography>
                  </div>
                  <Typography className="text-gray-700 leading-normal">
                    {comment.content}
                  </Typography>
                </div>
              ))}
              {hasMore && (
                <div
                  ref={loaderRef}
                  className="py-4 text-center text-sm text-gray-400 flex justify-center items-center gap-2"
                >
                  {loadingComments && <CircularProgress size={20} />}
                  <span>
                    {loadingComments
                      ? "Đang tải thêm bình luận..."
                      : "Cuộn xuống để tải thêm bình luận"}
                  </span>
                </div>
              )}
              {!hasMore && comments.length > 0 && (
                <div className="py-4 text-center text-sm text-gray-400">
                  Không còn bình luận nào nữa.
                </div>
              )}
            </Box>
          </Box>
        </div>
      </div>
    </Container>
  );
}
