import { useLocation, useNavigate } from "react-router-dom";
import { Breadcrumbs, Link, Typography } from "@mui/material";

type AppBreadcrumbsProps = {
  className?: string;
};

export default function AppBreadcrumbs({
  className = "",
}: AppBreadcrumbsProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Breadcrumbs aria-label="breadcrumb" className={className}>
      <Link
        underline="hover"
        color="inherit"
        onClick={() => navigate("/")}
        sx={{ cursor: "pointer" }} // Thêm dòng này
      >
        Home
      </Link>

      {pathnames.map((value, index) => {
        const to = "/" + pathnames.slice(0, index + 1).join("/");

        const isLast = index === pathnames.length - 1;
        const label = decodeURIComponent(value).replace(/-/g, " ");

        return isLast ? (
          <Typography key={to} color="text.primary">
            {label}
          </Typography>
        ) : (
          <Link
            key={to}
            underline="hover"
            color="inherit"
            onClick={() => navigate(to)}
            component="span" // dùng span thay vì a
            sx={{ cursor: "pointer" }}
          >
            {label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
