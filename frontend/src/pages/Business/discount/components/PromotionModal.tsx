import { useState, useEffect, useRef } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Textarea,
  Checkbox,
  CircularProgress,
} from "@mui/joy";
import { CloudUpload } from "@mui/icons-material";
import Typography from "@/components/ui/Typography";
import Input from "@/components/ui/Input";
import BaseModal from "@/components/ui/BaseModal";
import type { Promotion } from "@/types/Promotion";
import { uploadImage } from "@/services/upload/UploadService";

interface PromotionFormData {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  is_featured: boolean;
}

const INITIAL_FORM: PromotionFormData = {
  title: "",
  description: "",
  start_date: "",
  end_date: "",
  is_active: true,
  is_featured: false,
};

interface PromotionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    data: Omit<Promotion, "id" | "created_at" | "updated_at">,
  ) => Promise<void>;
  promotion?: Promotion | null;
  loading?: boolean;
  businessId: string;
}

export default function PromotionModal({
  open,
  onClose,
  onSubmit,
  promotion,
  loading = false,
  businessId,
}: PromotionModalProps) {
  const isEditing = !!promotion;
  const [form, setForm] = useState<PromotionFormData>(INITIAL_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (promotion) {
      setForm({
        title: promotion.title,
        description: promotion.description,
        start_date: promotion.start_date,
        end_date: promotion.end_date,
        is_active: promotion.is_active,
        is_featured: promotion.is_featured,
      });
      setImagePreview(promotion.image_url ?? null);
    } else {
      setForm(INITIAL_FORM);
      setImagePreview(null);
    }
    setImageFile(null);
  }, [promotion, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    let imageUrl = promotion?.image_url ?? null;

    if (imageFile) {
      try {
        setUploading(true);
        const ext = imageFile.name.split(".").pop() ?? "jpg";
        const fileName = `promo_${Date.now()}.${ext}`;
        imageUrl = await uploadImage(imageFile, fileName, "promotion");
      } finally {
        setUploading(false);
      }
    }

    const payload: Omit<Promotion, "id" | "created_at" | "updated_at"> = {
      title: form.title,
      description: form.description,
      image_url: imageUrl,
      start_date: form.start_date,
      end_date: form.end_date,
      is_active: form.is_active,
      is_featured: form.is_featured,
      business_id: promotion?.business_id ?? businessId,
      created_by: null,
    };

    await onSubmit(payload);
  };

  const isFormValid =
    form.title.trim() !== "" &&
    form.description.trim() !== "" &&
    form.start_date !== "" &&
    form.end_date !== "";

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={isEditing ? "Edit Promotion" : "Post New Promotion"}
      description={
        isEditing
          ? "Update the promotion details below"
          : "Create a promotional post to display on your landing page"
      }
      actions={[
        {
          label: "Cancel",
          onClick: onClose,
          variant: "outlined",
          colorScheme: "secondary",
          disabled: loading || uploading,
        },
        {
          label: isEditing ? "Save Changes" : "Post Promotion",
          onClick: handleSubmit,
          variant: "solid",
          colorScheme: "primary",
          disabled: loading || uploading || !isFormValid,
        },
      ]}
      size="sm"
      maxWidth={560}
    >
      <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2.5 }}>
        {/* Promotion Image */}
        <FormControl>
          <FormLabel>
            <Typography.Label size="sm" color="dark">
              Promotion Image
            </Typography.Label>
          </FormLabel>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <Box
            onClick={() => fileInputRef.current?.click()}
            sx={{
              position: "relative",
              width: "100%",
              height: imagePreview ? 200 : 120,
              border: "2px dashed",
              borderColor: imagePreview ? "primary.400" : "neutral.300",
              borderRadius: "10px",
              overflow: "hidden",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: imagePreview ? "transparent" : "neutral.50",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "primary.500",
                bgcolor: imagePreview ? "transparent" : "primary.50",
              },
            }}
          >
            {uploading ? (
              <CircularProgress size="md" />
            ) : imagePreview ? (
              <>
                <Box
                  component="img"
                  src={imagePreview}
                  alt="Promotion preview"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <Box
                  onClick={handleRemoveImage}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    bgcolor: "rgba(0,0,0,0.6)",
                    color: "white",
                    borderRadius: "50%",
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: 14,
                    "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                  }}
                >
                  ✕
                </Box>
              </>
            ) : (
              <Box sx={{ textAlign: "center" }}>
                <CloudUpload sx={{ fontSize: 32, opacity: 0.4, mb: 0.5 }} />
                <Typography.Body size="xs" color="default">
                  Click to upload an image
                </Typography.Body>
              </Box>
            )}
          </Box>
        </FormControl>

        {/* Title */}
        <FormControl required>
          <FormLabel>
            <Typography.Label size="sm" color="dark">
              Promotion Title
            </Typography.Label>
          </FormLabel>
          <Input
            name="title"
            value={form.title}
            onChange={handleInputChange}
            placeholder="e.g. Summer Special Offer!"
          />
        </FormControl>

        {/* Description */}
        <FormControl required>
          <FormLabel>
            <Typography.Label size="sm" color="dark">
              Description
            </Typography.Label>
          </FormLabel>
          <Textarea
            name="description"
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Describe your promotion in detail..."
            minRows={3}
            maxRows={6}
          />
        </FormControl>

        {/* Date Range */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <FormControl required sx={{ flex: 1 }}>
            <FormLabel>
              <Typography.Label size="sm" color="dark">
                Start Date
              </Typography.Label>
            </FormLabel>
            <Input
              name="start_date"
              type="date"
              value={form.start_date}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl required sx={{ flex: 1 }}>
            <FormLabel>
              <Typography.Label size="sm" color="dark">
                End Date
              </Typography.Label>
            </FormLabel>
            <Input
              name="end_date"
              type="date"
              value={form.end_date}
              onChange={handleInputChange}
            />
          </FormControl>
        </Box>

        {/* Toggles */}
        <Box sx={{ display: "flex", gap: 3 }}>
          <Checkbox
            label="Active"
            checked={form.is_active}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, is_active: e.target.checked }))
            }
            size="sm"
          />
          <Checkbox
            label="Featured on Landing Page"
            checked={form.is_featured}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, is_featured: e.target.checked }))
            }
            size="sm"
          />
        </Box>
      </Box>
    </BaseModal>
  );
}
