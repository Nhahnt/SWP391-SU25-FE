import { useState, useEffect, ChangeEvent } from "react";
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

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: any) => Promise<void>;
  isLoading: boolean;
  data: any;
  formTitle: string;
  fields: FieldConfig[];
}

export default function EditModal({
  isOpen,
  onClose,
  onUpdate,
  isLoading,
  data,
  formTitle,
  fields,
}: EditModalProps) {
  const [editedData, setEditedData] = useState<any>(data);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (data) {
      setEditedData(data);
      setErrors({});
    }
  }, [data]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setEditedData((prev: any) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    let isValid = true;
    const validationErrors: any = {};
    const emailField = fields.find(field => field.name === "email");
    if (emailField) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editedData.email)) {
        validationErrors.email = "Email không hợp lệ.";
        isValid = false;
      }
    }
    setErrors(validationErrors);
    return isValid;
  };

  const handleUpdate = async () => {
    if (!validateForm()) {
      return;
    }
    await onUpdate(editedData);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{formTitle}</DialogTitle>
      <DialogContent dividers>
        {editedData &&
          fields.map((field) => (
            <div key={field.name}>
              {field.type === "select" ? (
                <FormControl fullWidth margin="normal">
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                    name={field.name}
                    value={editedData[field.name] || ""}
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
                  value={editedData[field.name] || ""}
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
        <Button onClick={handleUpdate} color="primary" disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : "Lưu thay đổi"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}