import { Box, TextField, Button, Typography, Container } from "@mui/material";

export default function CreateBlogForm() {
  return (
    <Container maxWidth="md" className="py-10">
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        className="font-bold text-center"
      >
        Create a New Blog Post
      </Typography>

      <Box
        component="form"
        noValidate
        autoComplete="off"
        className="space-y-6 mt-6"
      >
        {/* Title */}
        <TextField
          fullWidth
          required
          label="Title"
          placeholder="Enter blog title"
        />

        {/* Content */}
        <TextField
          fullWidth
          required
          multiline
          minRows={6}
          label="Content"
          placeholder="Write your blog content here..."
        />

        {/* Image URL */}
        <TextField
          fullWidth
          label="Image URL"
          placeholder="Paste image URL (optional)"
        />

        {/* Author, Date, Category (flex layout) */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <TextField
              fullWidth
              required
              label="Author"
              placeholder="Your name"
            />
          </div>
          <div className="flex-1">
            <TextField
              fullWidth
              required
              type="date"
              label="Date"
              InputLabelProps={{ shrink: true }}
            />
          </div>
          <div className="flex-1">
            <TextField
              fullWidth
              required
              label="Category"
              placeholder="e.g. Health, Tips"
            />
          </div>
        </div>

        {/* Submit Button */}
        <Box textAlign="center" className="pt-4">
          <Button variant="contained" color="primary" size="large">
            Create Blog
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
