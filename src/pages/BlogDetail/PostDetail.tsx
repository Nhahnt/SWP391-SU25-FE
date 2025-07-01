import { useParams } from "react-router-dom";
import { Container, Typography, Box, CardMedia, Divider } from "@mui/material";

const mockBlog = {
  title: "How to Quit Smoking",
  image:
    "https://images.unsplash.com/photo-1512067053627-3cb65e51a128?q=80&w=1170&auto=format&fit=crop",
  content: `
    Quitting smoking is one of the best decisions you can make for your health. 
    In this article, we'll explore the steps to break free from nicotine addiction, 
    from mental preparation to handling withdrawal symptoms and staying smoke-free for life.
    
    - Step 1: Set a quit date.
    - Step 2: Remove all tobacco products.
    - Step 3: Seek support from friends, family, or professionals.
    - Step 4: Practice stress-relief techniques like deep breathing or walking.
    
    Remember: You are not alone, and it's never too late to quit!
  `,
};

export default function BlogDetail() {
  const { id } = useParams();

  return (
    <Container maxWidth="md" className="py-8">
      <Typography
        variant="h3"
        component="h1"
        className="font-bold text-center mb-6"
      >
        {mockBlog.title}
      </Typography>

      <CardMedia
        component="img"
        height="400"
        image={mockBlog.image}
        alt={mockBlog.title}
        className="rounded-lg shadow-md object-cover mb-6"
      />

      <Divider className="my-6" />

      <Box className="prose max-w-none text-justify text-gray-800 text-lg leading-relaxed">
        {mockBlog.content.split("\n").map((line, idx) => (
          <Typography key={idx} paragraph>
            {line.trim()}
          </Typography>
        ))}
      </Box>

      <Typography className="mt-8 text-sm text-gray-500 text-center">
        Blog ID: {id}
      </Typography>
    </Container>
  );
}
