import { useState, useEffect } from "react";
import { Box, Chip, Tabs, TabList, Tab, TabPanel } from "@mui/joy";
import { Add } from "@mui/icons-material";
import PageContainer from "@/components/PageContainer";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import NoDataFound from "@/components/ui/NoDataFound";
import Alert from "@/components/ui/Alert";
import Table from "@/components/ui/Table";
import type { TableColumn } from "@/components/ui/Table";
import Loading from "@/components/Loading";
import {
  getAllDiscounts,
  createDiscount,
  updateDiscount,
  deleteDiscount,
} from "@/services/discount/DiscountService";
import {
  getAllPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
} from "@/services/promotion/PromotionService";
import { getAllRooms } from "@/services/room/RoomService";
import type { Discount } from "@/types/Discount";
import type { Promotion } from "@/types/Promotion";
import type { Room } from "@/types/Room";
import DiscountModal from "./components/DiscountModal";
import PromotionModal from "./components/PromotionModal";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { getAllBusinesses } from "@/services/business/BusinessService";
import CampaignIcon from "@mui/icons-material/Campaign";

export default function ManageDiscount() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Discount modal state
  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [deleteDiscountTarget, setDeleteDiscountTarget] =
    useState<Discount | null>(null);

  // Promotion modal state
  const [promotionModalOpen, setPromotionModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(
    null,
  );
  const [deletePromotionTarget, setDeletePromotionTarget] =
    useState<Promotion | null>(null);

  // Alert state
  const [alert, setAlert] = useState<{
    open: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({ open: false, type: "success", title: "", message: "" });

  const [businessId, setBusinessId] = useState<string>("");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [discountData, promotionData, roomData, businesses] =
        await Promise.all([
          getAllDiscounts(),
          getAllPromotions(),
          getAllRooms(),
          getAllBusinesses(),
        ]);
      setDiscounts(discountData);
      setPromotions(promotionData);
      setRooms(roomData);
      if (businesses.length > 0) {
        setBusinessId(businesses[0].id);
      }
    } catch {
      showAlert("error", "Error", "Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (
    type: "success" | "error",
    title: string,
    message: string,
  ) => {
    setAlert({ open: true, type, title, message });
  };

  // ===== DISCOUNT HANDLERS =====
  const handleOpenAddDiscount = () => {
    setEditingDiscount(null);
    setDiscountModalOpen(true);
  };

  const handleOpenEditDiscount = (discount: Discount) => {
    setEditingDiscount(discount);
    setDiscountModalOpen(true);
  };

  const handleSubmitDiscount = async (
    payload: Omit<Discount, "id" | "created_at" | "updated_at" | "used_count">,
  ) => {
    try {
      setSubmitting(true);
      if (editingDiscount) {
        await updateDiscount(editingDiscount.id, payload);
        showAlert("success", "Updated", "Discount updated successfully!");
      } else {
        await createDiscount(payload);
        showAlert("success", "Created", "Discount created successfully!");
      }
      setDiscountModalOpen(false);
      setEditingDiscount(null);
      await fetchAll();
    } catch {
      showAlert(
        "error",
        "Error",
        editingDiscount
          ? "Failed to update discount."
          : "Failed to create discount.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDeleteDiscount = async () => {
    if (!deleteDiscountTarget) return;
    try {
      setSubmitting(true);
      await deleteDiscount(deleteDiscountTarget.id);
      setDeleteDiscountTarget(null);
      showAlert("success", "Deleted", "Discount deleted successfully!");
      await fetchAll();
    } catch {
      showAlert("error", "Error", "Failed to delete discount.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleDiscountActive = async (discount: Discount) => {
    try {
      await updateDiscount(discount.id, { is_active: !discount.is_active });
      await fetchAll();
    } catch {
      showAlert("error", "Error", "Failed to update discount status.");
    }
  };

  // ===== PROMOTION HANDLERS =====
  const handleOpenAddPromotion = () => {
    setEditingPromotion(null);
    setPromotionModalOpen(true);
  };

  const handleOpenEditPromotion = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setPromotionModalOpen(true);
  };

  const handleSubmitPromotion = async (
    payload: Omit<Promotion, "id" | "created_at" | "updated_at">,
  ) => {
    try {
      setSubmitting(true);
      if (editingPromotion) {
        await updatePromotion(editingPromotion.id, payload);
        showAlert("success", "Updated", "Promotion updated successfully!");
      } else {
        await createPromotion(payload);
        showAlert("success", "Created", "Promotion posted successfully!");
      }
      setPromotionModalOpen(false);
      setEditingPromotion(null);
      await fetchAll();
    } catch {
      showAlert(
        "error",
        "Error",
        editingPromotion
          ? "Failed to update promotion."
          : "Failed to create promotion.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDeletePromotion = async () => {
    if (!deletePromotionTarget) return;
    try {
      setSubmitting(true);
      await deletePromotion(deletePromotionTarget.id);
      setDeletePromotionTarget(null);
      showAlert("success", "Deleted", "Promotion deleted successfully!");
      await fetchAll();
    } catch {
      showAlert("error", "Error", "Failed to delete promotion.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePromotionActive = async (promotion: Promotion) => {
    try {
      await updatePromotion(promotion.id, {
        is_active: !promotion.is_active,
      });
      await fetchAll();
    } catch {
      showAlert("error", "Error", "Failed to update promotion status.");
    }
  };

  const handleTogglePromotionFeatured = async (promotion: Promotion) => {
    try {
      await updatePromotion(promotion.id, {
        is_featured: !promotion.is_featured,
      });
      await fetchAll();
    } catch {
      showAlert("error", "Error", "Failed to update featured status.");
    }
  };

  // ===== DISCOUNT TABLE COLUMNS =====
  const getRoomLabel = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    return room ? `Room ${room.room_number ?? "N/A"}` : roomId.substring(0, 8);
  };

  const discountColumns: TableColumn<Discount>[] = [
    {
      id: "name",
      label: "Discount Name",
      minWidth: 180,
      render: (row) => (
        <Box>
          <Typography.Body bold>{row.name}</Typography.Body>
          {row.description && (
            <Typography.Body size="xs" color="default" sx={{ opacity: 0.7 }}>
              {row.description}
            </Typography.Body>
          )}
        </Box>
      ),
    },
    {
      id: "discount_percentage",
      label: "Discount",
      minWidth: 100,
      render: (row) => (
        <Chip variant="soft" color="success" size="md">
          {row.discount_percentage}% OFF
        </Chip>
      ),
    },
    {
      id: "promo_code",
      label: "Promo Code",
      minWidth: 130,
      render: (row) =>
        row.promo_code ? (
          <Chip variant="outlined" color="primary" size="sm">
            {row.promo_code}
          </Chip>
        ) : (
          <Typography.Body size="sm" color="default">
            —
          </Typography.Body>
        ),
    },
    {
      id: "apply_to",
      label: "Applies To",
      minWidth: 150,
      render: (row) => (
        <Box>
          <Chip
            variant="soft"
            color={row.apply_to === "all" ? "primary" : "warning"}
            size="sm"
          >
            {row.apply_to === "all" ? "All Rooms" : "Specific Rooms"}
          </Chip>
          {row.apply_to === "specific" && row.room_ids.length > 0 && (
            <Box sx={{ display: "flex", gap: 0.5, mt: 0.5, flexWrap: "wrap" }}>
              {row.room_ids.slice(0, 3).map((id) => (
                <Chip key={id} variant="outlined" size="sm" color="neutral">
                  {getRoomLabel(id)}
                </Chip>
              ))}
              {row.room_ids.length > 3 && (
                <Chip variant="outlined" size="sm" color="neutral">
                  +{row.room_ids.length - 3} more
                </Chip>
              )}
            </Box>
          )}
        </Box>
      ),
    },
    {
      id: "start_date",
      label: "Validity",
      minWidth: 160,
      render: (row) => (
        <Box>
          <Typography.Body size="xs">
            {new Date(row.start_date).toLocaleDateString()} –{" "}
            {new Date(row.end_date).toLocaleDateString()}
          </Typography.Body>
          {new Date(row.end_date) < new Date() && (
            <Chip variant="soft" color="danger" size="sm" sx={{ mt: 0.5 }}>
              Expired
            </Chip>
          )}
        </Box>
      ),
    },
    {
      id: "used_count",
      label: "Usage",
      minWidth: 100,
      render: (row) => (
        <Typography.Body size="sm">
          {row.used_count}
          {row.usage_limit ? ` / ${row.usage_limit}` : " / ∞"}
        </Typography.Body>
      ),
    },
    {
      id: "is_active",
      label: "Status",
      minWidth: 90,
      render: (row) => (
        <Chip
          variant="soft"
          color={row.is_active ? "success" : "neutral"}
          size="sm"
          onClick={() => handleToggleDiscountActive(row)}
          sx={{ cursor: "pointer" }}
        >
          {row.is_active ? "Active" : "Inactive"}
        </Chip>
      ),
    },
    {
      id: "actions",
      label: "Actions",
      minWidth: 150,
      render: (row) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            colorScheme="primary"
            size="sm"
            onClick={() => handleOpenEditDiscount(row)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            colorScheme="error"
            size="sm"
            onClick={() => setDeleteDiscountTarget(row)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  // ===== PROMOTION TABLE COLUMNS =====
  const promotionColumns: TableColumn<Promotion>[] = [
    {
      id: "title",
      label: "Title",
      minWidth: 200,
      render: (row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {row.image_url && (
            <Box
              component="img"
              src={row.image_url}
              alt={row.title}
              sx={{
                width: 48,
                height: 48,
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
          )}
          <Box>
            <Typography.Body bold>{row.title}</Typography.Body>
            <Typography.Body
              size="xs"
              color="default"
              sx={{
                opacity: 0.7,
                maxWidth: 200,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {row.description}
            </Typography.Body>
          </Box>
        </Box>
      ),
    },
    {
      id: "start_date",
      label: "Duration",
      minWidth: 160,
      render: (row) => (
        <Box>
          <Typography.Body size="xs">
            {new Date(row.start_date).toLocaleDateString()} –{" "}
            {new Date(row.end_date).toLocaleDateString()}
          </Typography.Body>
          {new Date(row.end_date) < new Date() && (
            <Chip variant="soft" color="danger" size="sm" sx={{ mt: 0.5 }}>
              Expired
            </Chip>
          )}
        </Box>
      ),
    },
    {
      id: "is_featured",
      label: "Featured",
      minWidth: 100,
      render: (row) => (
        <Chip
          variant="soft"
          color={row.is_featured ? "warning" : "neutral"}
          size="sm"
          onClick={() => handleTogglePromotionFeatured(row)}
          sx={{ cursor: "pointer" }}
        >
          {row.is_featured ? "★ Featured" : "Regular"}
        </Chip>
      ),
    },
    {
      id: "is_active",
      label: "Status",
      minWidth: 90,
      render: (row) => (
        <Chip
          variant="soft"
          color={row.is_active ? "success" : "neutral"}
          size="sm"
          onClick={() => handleTogglePromotionActive(row)}
          sx={{ cursor: "pointer" }}
        >
          {row.is_active ? "Active" : "Inactive"}
        </Chip>
      ),
    },
    {
      id: "actions",
      label: "Actions",
      minWidth: 150,
      render: (row) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            colorScheme="primary"
            size="sm"
            onClick={() => handleOpenEditPromotion(row)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            colorScheme="error"
            size="sm"
            onClick={() => setDeletePromotionTarget(row)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  if (loading) {
    return (
      <PageContainer>
        <Loading />
      </PageContainer>
    );
  }

  return (
    <PageContainer sx={{ alignItems: "stretch", justifyContent: "flex-start" }}>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Typography.Header>Discounts & Promotions</Typography.Header>
        <Typography.Body color="default" size="sm" sx={{ mt: 0.5 }}>
          Manage discounts, promo codes, and promotional posts for your homestay
        </Typography.Body>
      </Box>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(_, val) => setActiveTab(val as number)}
        sx={{ borderRadius: "12px", overflow: "hidden" }}
      >
        <TabList
          sx={{
            gap: 1,
            [`& .MuiTab-root`]: {
              fontWeight: 600,
            },
          }}
        >
          <Tab>
            <LocalOfferIcon sx={{ mr: 1, fontSize: 18 }} />
            Discounts ({discounts.length})
          </Tab>
          <Tab>
            <CampaignIcon sx={{ mr: 1, fontSize: 18 }} />
            Promotions ({promotions.length})
          </Tab>
        </TabList>

        {/* ===== DISCOUNTS TAB ===== */}
        <TabPanel value={0} sx={{ p: 0, pt: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mb: 2,
            }}
          >
            <Button
              variant="solid"
              colorScheme="primary"
              startDecorator={<Add />}
              onClick={handleOpenAddDiscount}
            >
              Add Discount
            </Button>
          </Box>

          {discounts.length === 0 ? (
            <NoDataFound
              icon="database"
              title="No Discounts Yet"
              message="Create your first discount to attract more guests."
            >
              <Button
                variant="outlined"
                colorScheme="primary"
                startDecorator={<Add />}
                onClick={handleOpenAddDiscount}
                sx={{ mt: 2 }}
              >
                Create First Discount
              </Button>
            </NoDataFound>
          ) : (
            <Table
              columns={discountColumns}
              data={discounts}
              rowKey="id"
              rowsPerPage={8}
              emptyMessage="No discounts found"
            />
          )}
        </TabPanel>

        {/* ===== PROMOTIONS TAB ===== */}
        <TabPanel value={1} sx={{ p: 0, pt: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mb: 2,
            }}
          >
            <Button
              variant="solid"
              colorScheme="primary"
              startDecorator={<Add />}
              onClick={handleOpenAddPromotion}
            >
              Post Promotion
            </Button>
          </Box>

          {promotions.length === 0 ? (
            <NoDataFound
              icon="database"
              title="No Promotions Yet"
              message="Post a promotion to showcase on your landing page."
            >
              <Button
                variant="outlined"
                colorScheme="primary"
                startDecorator={<Add />}
                onClick={handleOpenAddPromotion}
                sx={{ mt: 2 }}
              >
                Post First Promotion
              </Button>
            </NoDataFound>
          ) : (
            <Table
              columns={promotionColumns}
              data={promotions}
              rowKey="id"
              rowsPerPage={8}
              emptyMessage="No promotions found"
            />
          )}
        </TabPanel>
      </Tabs>

      {/* ===== MODALS ===== */}

      {/* Discount Modal (Add / Edit) */}
      <DiscountModal
        open={discountModalOpen}
        onClose={() => {
          setDiscountModalOpen(false);
          setEditingDiscount(null);
        }}
        onSubmit={handleSubmitDiscount}
        discount={editingDiscount}
        loading={submitting}
        businessId={businessId}
        rooms={rooms}
      />

      {/* Promotion Modal (Add / Edit) */}
      <PromotionModal
        open={promotionModalOpen}
        onClose={() => {
          setPromotionModalOpen(false);
          setEditingPromotion(null);
        }}
        onSubmit={handleSubmitPromotion}
        promotion={editingPromotion}
        loading={submitting}
        businessId={businessId}
      />

      {/* ===== DELETE CONFIRMATIONS ===== */}

      {/* Delete Discount Confirmation */}
      <Alert
        open={!!deleteDiscountTarget}
        onClose={() => setDeleteDiscountTarget(null)}
        onConfirm={handleConfirmDeleteDiscount}
        type="warning"
        title="Delete Discount"
        message={`Are you sure you want to delete "${deleteDiscountTarget?.name ?? "this discount"}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        loading={submitting}
        buttonColorScheme="error"
      />

      {/* Delete Promotion Confirmation */}
      <Alert
        open={!!deletePromotionTarget}
        onClose={() => setDeletePromotionTarget(null)}
        onConfirm={handleConfirmDeletePromotion}
        type="warning"
        title="Delete Promotion"
        message={`Are you sure you want to delete "${deletePromotionTarget?.title ?? "this promotion"}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        loading={submitting}
        buttonColorScheme="error"
      />

      {/* Success / Error Alert */}
      <Alert
        open={alert.open}
        onClose={() => setAlert((prev) => ({ ...prev, open: false }))}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        showCancel={false}
        confirmText="OK"
      />
    </PageContainer>
  );
}
