import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  itemName: string;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  itemName,
}: DeleteModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Xác nhận xóa</DialogTitle>
      <DialogContent dividers>
        <Typography>
          Bạn có chắc chắn muốn xóa tài khoản <strong>{itemName}</strong> không? Hành động này không thể hoàn tác.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" disabled={isLoading}>
          Hủy
        </Button>
        <Button onClick={onConfirm} color="primary" disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : "Xóa"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}