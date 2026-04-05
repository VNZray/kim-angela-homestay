import { useState, useEffect } from "react";
import { Box } from "@mui/joy";
import PageContainer from "@/components/PageContainer";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import Loading from "@/components/Loading";
import NoDataFound from "@/components/ui/NoDataFound";
import Alert from "@/components/ui/Alert";
import ItineraryModal from "./components/ItineraryModal";
import { getAllBusinesses } from "@/services/business/BusinessService";
import {
  getItinerariesByBusiness,
  createItinerary,
  updateItinerary,
  deleteItinerary,
} from "@/services/itinerary/ItineraryService";
import type { ItineraryPackage } from "@/types/Itinerary";
import type { Business } from "@/types/Business";

export default function ManageItineraries() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [businessId, setBusinessId] = useState<string>("");
  const [itineraries, setItineraries] = useState<ItineraryPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ItineraryPackage | null>(null);
  const [alert, setAlert] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const biz = await getAllBusinesses();
      setBusinesses(biz);
      if (biz.length > 0) {
        const first = biz[0].id;
        setBusinessId(first);
        const its = await getItinerariesByBusiness(first);
        setItineraries(its);
      }
    } catch (err) {
      console.error(err);
      showAlert("error", "Error", "Failed to load itineraries or businesses.");
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

  const handleBusinessChange = async (id: string) => {
    setBusinessId(id);
    setLoading(true);
    try {
      const its = await getItinerariesByBusiness(id);
      setItineraries(its);
    } catch (err) {
      showAlert(
        "error",
        "Error",
        "Failed to load itineraries for selected business.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (it: ItineraryPackage) => {
    setEditing(it);
    setModalOpen(true);
  };

  const handleSubmit = async (
    payload: Omit<ItineraryPackage, "id" | "created_at" | "updated_at">,
  ) => {
    try {
      setSubmitting(true);
      if (editing) {
        await updateItinerary(editing.id, payload);
        showAlert("success", "Updated", "Itinerary updated successfully.");
      } else {
        await createItinerary(payload);
        showAlert("success", "Created", "Itinerary created successfully.");
      }
      setModalOpen(false);
      setEditing(null);
      await handleBusinessChange(payload.business_id);
    } catch (err) {
      console.error(err);
      showAlert(
        "error",
        "Error",
        editing ? "Failed to update itinerary." : "Failed to create itinerary.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (it: ItineraryPackage) => {
    try {
      setSubmitting(true);
      await deleteItinerary(it.id);
      showAlert("success", "Deleted", "Itinerary deleted.");
      await handleBusinessChange(it.business_id);
    } catch (err) {
      console.error(err);
      showAlert("error", "Error", "Failed to delete itinerary.");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      id: "label",
      label: "Label",
      minWidth: 200,
      render: (row: ItineraryPackage) => (
        <Box>
          <Typography.Body bold>{row.label ?? row.code}</Typography.Body>
          <Typography.Body size="xs" color="default">
            {row.code}
          </Typography.Body>
        </Box>
      ),
    },
    {
      id: "content",
      label: "Preview",
      minWidth: 300,
      render: (row: ItineraryPackage) => (
        <Typography.Body size="xs">
          {(row.content ?? "").slice(0, 120) || "—"}
        </Typography.Body>
      ),
    },
    {
      id: "actions",
      label: "Actions",
      minWidth: 160,
      render: (row: ItineraryPackage) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            colorScheme="primary"
            size="sm"
            onClick={() => handleEdit(row)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            colorScheme="error"
            size="sm"
            onClick={() => handleDelete(row)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <PageContainer sx={{ alignItems: "stretch", justifyContent: "flex-start" }}>
      <Box>
        <Typography.Header size="sm">Manage Itineraries</Typography.Header>
        <Typography.Body size="sm" color="default">
          Create and edit duration-based itineraries for your business.
        </Typography.Body>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <select
          value={businessId}
          onChange={(e) => handleBusinessChange(e.target.value)}
          style={{ padding: 8, borderRadius: 6 }}
        >
          {businesses.map((b) => (
            <option key={b.id} value={b.id}>
              {b.business_name}
            </option>
          ))}
        </select>
        <Button startDecorator={<></>} onClick={handleOpenAdd}>
          New Itinerary
        </Button>
      </Box>

      <Box sx={{ mt: 3 }}>
        {loading ? (
          <Loading />
        ) : itineraries.length === 0 ? (
          <NoDataFound message="No itineraries found for this business." />
        ) : (
          <Table
            columns={columns}
            data={itineraries}
            rowKey={(r: ItineraryPackage) => r.id}
          />
        )}
      </Box>

      <ItineraryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        itinerary={editing}
        loading={submitting}
        businessId={businessId}
      />

      <Alert
        open={alert.open}
        onClose={() => setAlert((s) => ({ ...s, open: false }))}
        type={alert.type === "success" ? "success" : "error"}
        title={alert.title}
        message={alert.message}
        confirmText="OK"
        showCancel={false}
      />
    </PageContainer>
  );
}
