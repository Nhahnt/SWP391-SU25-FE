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
} from "@mui/material";

export default function CreateBlogForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [category, setCategory] = useState("QUIT_JOURNEY");
  const [published, setPublished] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const categories = [
    "QUIT_JOURNEY",
    "SUCCES_STORY",
    "EXPERIENCE",
    "MOTIVATION",
    "CHALLENGE",
    "LIFE_STORY",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title,
      content,
      thumbnail,
      category,
      published,
    };
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:8082/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Tạo blog thất bại");

      setOpenSnackbar(true);
      setTitle("");
      setContent("");
      setThumbnail("");
      setCategory("QUIT_JOURNEY");
    } catch (err) {
      alert("Đã có lỗi xảy ra khi gửi blog");
      console.error(err);
    }
  };

  return (
    <Container maxWidth="md" className="py-10 space-y-4">
      <Typography
        variant="h4"
        className="text-center font-bold mb-6 text-[#c2410c]"
      >
        Create a New Blog Post
      </Typography>

      <Box component="form" onSubmit={handleSubmit} className="space-y-6">
        <TextField
          fullWidth
          required
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <TextField
          fullWidth
          required
          multiline
          minRows={6}
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <TextField
          fullWidth
          label="Image URL"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
        />

        {thumbnail && (
          <Box mt={2}>
            <img
              src={thumbnail}
              alt="Preview"
              className="w-full object-cover max-h-[300px] rounded"
              onError={(e) =>
                ((e.target as HTMLImageElement).src = "/no-image.png")
              }
            />
          </Box>
        )}

        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Category"
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box textAlign="right" className="pt-4">
          <Button
            type="submit"
            variant="contained"
            sx={{ backgroundColor: "#c2410c" }}
            size="large"
          >
            Create Blog
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        autoHideDuration={3000}
        message="Blog đã được tạo!"
      />
    </Container>
  );
}
