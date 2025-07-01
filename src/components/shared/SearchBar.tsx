import { TextField, InputAdornment } from "@mui/material";
import { Search } from "lucide-react";

type SearchBarProps = {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

export default function SearchBar({
  placeholder = "Search...",
  value,
  onChange,
  className = "",
}: SearchBarProps) {
  return (
    <div
      className={`w-full px-4 sm:px-6 md:px-0 max-w-full sm:max-w-xl md:max-w-2xl ${className}`}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        size="medium"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiInputBase-input": {
            fontSize: {
              xs: "1rem", // 16px trên mobile
              sm: "1.125rem", // 18px trên desktop
            },
            paddingY: {
              xs: "0.5rem",
              sm: "0.875rem",
            },
          },
        }}
        className="bg-white rounded-md shadow-md"
      />
    </div>
  );
}
