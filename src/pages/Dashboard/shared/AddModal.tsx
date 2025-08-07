import { useState, ChangeEvent } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

interface FieldConfig {
  name: string;
  label: string;
  type: string;
  options?: { value: string; label: string }[];
  disabled?: boolean;
}

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => Promise<void>;
  isLoading: boolean;
  formTitle: string;
  fields: FieldConfig[];
}

export default function AddModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  formTitle,
  fields,
}: AddModalProps) {
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<any>({});

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    let isValid = true;
    const validationErrors: any = {};
    const emailField = fields.find(field => field.name === "email");
    if (emailField) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        validationErrors.email = "Email không hợp lệ.";
        isValid = false;
      }
    }
    const passwordField = fields.find(field => field.name === "password");
    if (passwordField && formData.password && formData.password.length < 8) {
      validationErrors.password = "Mật khẩu phải có ít nhất 8 ký tự.";
      isValid = false;
    }
    setErrors(validationErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    await onConfirm(formData);
    setFormData({});
    setErrors({});
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{formTitle}</DialogTitle>
      <DialogContent dividers>
        {fields.map((field) => (
          <div key={field.name}>
            {field.type === "select" ? (
              <FormControl fullWidth margin="normal">
                <InputLabel>{field.label}</InputLabel>
                <Select
                  name={field.name}
                  value={formData[field.name] || ""}
                  label={field.label}
                  onChange={handleSelectChange}
                  disabled={field.disabled}
                >
                  {field.options?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <TextField
                name={field.name}
                label={field.label}
                value={formData[field.name] || ""}
                onChange={handleInputChange}
                error={!!errors[field.name]}
                helperText={errors[field.name]}
                type={field.type}
                fullWidth
                margin="normal"
                disabled={field.disabled}
              />
            )}
          </div>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" disabled={isLoading}>
          Hủy
        </Button>
        <Button onClick={handleSubmit} color="primary" disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : "Thêm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}