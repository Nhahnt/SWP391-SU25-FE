import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

export default function CreateBlogForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState("QUIT_JOURNEY");
  const [published, setPublished] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const categories = [
    "QUIT_JOURNEY",
    "SUCCESS_STORY",
    "EXPERIENCE",
    "MOTIVATION",
    "CHALLENGE",
    "LIFE_STORY",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("Please select an image file.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    formData.append("published", String(published));
    formData.append("file", file);

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:8082/api/blogs", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Do NOT set Content-Type here; browser will set it for FormData
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Tạo blog thất bại");

      setOpenSnackbar(true);
      setTitle("");
      setContent("");
      setFile(null);
      setCategory("QUIT_JOURNEY");
    } catch (err) {
      alert("Đã có lỗi xảy ra khi gửi blog");
      console.error(err);
    }
  };

  return (
    <Box className="w-full bg-gradient-to-br from-orange-50 to-blue-50 flex justify-center py-2 md:py-4">
      <Container maxWidth="md" className="">
        <Box className="bg-white rounded-2xl shadow-xl p-4 md:p-7 max-w-2xl mx-auto border border-gray-100">
          <Typography
            variant="h4"
            className="text-center font-bold mb-8 text-[#c2410c] tracking-tight"
          >
            Create a New Blog Post
          </Typography>

          <Box component="form" onSubmit={handleSubmit} className="space-y-7">
            <TextField
              fullWidth
              required
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              InputProps={{ sx: { borderRadius: 2, fontWeight: 600 } }}
            />

            <TextField
              fullWidth
              required
              multiline
              minRows={6}
              label="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              InputProps={{ sx: { borderRadius: 2 } }}
            />

            <Box className="flex flex-col md:flex-row md:items-center gap-4">
              <Button
                variant="contained"
                component="label"
                sx={{ backgroundColor: "#2563eb", borderRadius: 2, fontWeight: 600, boxShadow: 1 }}
              >
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={e => setFile(e.target.files?.[0] || null)}
                />
              </Button>
              {file && (
                <Box className="w-full md:w-1/2 flex items-center justify-center border border-gray-200 rounded-lg bg-gray-50 p-2">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="object-cover max-h-[180px] rounded shadow"
                  />
                </Box>
              )}
            </Box>

            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="Category"
                sx={{ borderRadius: 2 }}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box className="flex flex-col md:flex-row md:justify-end gap-3 pt-4">
              <Button
                variant="outlined"
                color="primary"
                size="large"
                sx={{ borderRadius: 2, fontWeight: 600, minWidth: 120 }}
                onClick={() => setPreviewOpen(true)}
                type="button"
              >
                Preview
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{ backgroundColor: "#c2410c", borderRadius: 2, fontWeight: 600, minWidth: 140, boxShadow: 1 }}
                size="large"
              >
                Create Blog
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Preview Dialog */}
        <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 2 }}>
            Blog Preview
            <IconButton onClick={() => setPreviewOpen(false)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box className="bg-white rounded-xl shadow p-6 border border-gray-100">
              <Typography variant="h4" className="font-bold mb-2 text-[#c2410c]">
                {title || 'Blog Title'}
              </Typography>
              <Box className="flex items-center gap-3 mb-4 text-sm text-gray-500">
                <span className="px-2 py-1 bg-blue-50 rounded text-blue-700 font-medium border border-blue-100">
                  {category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
                <span>•</span>
                <span>{published ? 'Published' : 'Draft'}</span>
              </Box>
              {file && (
                <Box className="w-full flex items-center justify-center mb-4">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="object-cover max-h-[260px] rounded shadow"
                  />
                </Box>
              )}
              <Typography variant="body1" className="leading-relaxed text-gray-800 whitespace-pre-line text-lg">
                {content || 'Blog content will appear here.'}
              </Typography>
            </Box>
          </DialogContent>
        </Dialog>

        <Snackbar
          open={openSnackbar}
          onClose={() => setOpenSnackbar(false)}
          autoHideDuration={3000}
          message="Blog đã được tạo!"
        />
      </Container>
    </Box>
  );
}
