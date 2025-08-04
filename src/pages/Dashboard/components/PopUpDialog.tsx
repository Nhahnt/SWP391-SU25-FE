import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Breakpoint,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface PopUpDialogProps {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: Breakpoint | false;
}

export default function PopUpDialog({isOpen, title, onClose, children, maxWidth = "sm", }: PopUpDialogProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth={maxWidth} fullWidth>
      <DialogTitle sx={{ position: "relative", pr: 5 }}>
        {title && (
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        )}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
          aria-label="Close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {children}
      </DialogContent>
    </Dialog>
  );
}
