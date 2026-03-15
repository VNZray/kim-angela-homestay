import { useState, useEffect } from "react";
import {
  Box,
  Chip,
  Option,
  Select,
  FormControl,
  FormLabel,
  useColorScheme,
} from "@mui/joy";
import { Add, Refresh } from "@mui/icons-material";
import PageContainer from "@/components/PageContainer";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Table from "@/components/ui/Table";
import type { TableColumn } from "@/components/ui/Table";
import Alert from "@/components/ui/Alert";
import BaseModal from "@/components/ui/BaseModal";
import Loading from "@/components/Loading";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "@/services/auth/AuthService";
import { auth, createUserWithEmailAndPassword } from "@/utils/firebase";
import supabase from "@/utils/supabase";
import type { SupabaseUser } from "@/types/User";

type StaffRole = "staff" | "manager" | "admin";

const STAFF_ROLES: StaffRole[] = ["staff", "manager", "admin"];

const ROLE_COLORS: Record<
  string,
  "danger" | "warning" | "primary" | "success" | "neutral"
> = {
  admin: "danger",
  manager: "warning",
  staff: "primary",
  tourist: "success",
};

const ROLE_LABELS: Record<StaffRole, string> = {
  staff: "Staff",
  manager: "Manager",
  admin: "Admin",
};

interface StaffForm {
  email: string;
  password: string;
  displayName: string;
  role: StaffRole;
}

const INITIAL_FORM: StaffForm = {
  email: "",
  password: "",
  displayName: "",
  role: "staff",
};

export default function ManageStaff() {
  const { mode } = useColorScheme();
  const borderColor = mode === "dark" ? "#374151" : "#e5e7eb";
  const cardBg = mode === "dark" ? "#1e1e1e" : "#fff";

  const [staff, setStaff] = useState<SupabaseUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Add staff modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState<StaffForm>(INITIAL_FORM);

  // Edit staff modal
  const [editingStaff, setEditingStaff] = useState<SupabaseUser | null>(null);
  const [editRole, setEditRole] = useState<StaffRole>("staff");

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<SupabaseUser | null>(null);

  // Alert
  const [alert, setAlert] = useState<{
    open: boolean;
    type: "success" | "error" | "info";
    title: string;
    message: string;
  }>({ open: false, type: "info", title: "", message: "" });

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const allUsers = await getAllUsers();
      const staffUsers = allUsers.filter(
        (u) => u.role === "staff" || u.role === "manager" || u.role === "admin",
      );
      setStaff(staffUsers);
    } catch (error: any) {
      setAlert({
        open: true,
        type: "error",
        title: "Error",
        message: "Failed to load staff: " + error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddStaff = async () => {
    if (!form.email || !form.password || !form.displayName) {
      setAlert({
        open: true,
        type: "error",
        title: "Validation Error",
        message: "Please fill in all required fields.",
      });
      return;
    }

    if (form.password.length < 6) {
      setAlert({
        open: true,
        type: "error",
        title: "Validation Error",
        message: "Password must be at least 6 characters.",
      });
      return;
    }

    setSubmitting(true);
    try {
      // Create Firebase account
      const credential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password,
      );
      const firebaseUid = credential.user.uid;

      // Create Supabase user record with role
      const { error } = await supabase.from("users").insert({
        firebase_uid: firebaseUid,
        email: form.email,
        display_name: form.displayName,
        role: form.role,
        is_online: false,
      });

      if (error) throw error;

      setAlert({
        open: true,
        type: "success",
        title: "Success",
        message: `Staff account created for ${form.displayName}`,
      });

      setShowAddModal(false);
      setForm(INITIAL_FORM);
      fetchStaff();
    } catch (error: any) {
      const message =
        error.code === "auth/email-already-in-use"
          ? "This email is already registered."
          : error.message;
      setAlert({
        open: true,
        type: "error",
        title: "Error",
        message: "Failed to create staff account: " + message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!editingStaff) return;
    setSubmitting(true);
    try {
      await updateUserRole(editingStaff.id, editRole);
      setAlert({
        open: true,
        type: "success",
        title: "Success",
        message: `Role updated to ${ROLE_LABELS[editRole]}`,
      });
      setEditingStaff(null);
      fetchStaff();
    } catch (error: any) {
      setAlert({
        open: true,
        type: "error",
        title: "Error",
        message: "Failed to update role: " + error.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser(deleteTarget.id);
      setAlert({
        open: true,
        type: "success",
        title: "Success",
        message: "Staff member removed.",
      });
      fetchStaff();
    } catch (error: any) {
      setAlert({
        open: true,
        type: "error",
        title: "Error",
        message: "Failed to remove staff: " + error.message,
      });
    } finally {
      setDeleteTarget(null);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const columns: TableColumn<SupabaseUser>[] = [
    {
      id: "display_name",
      label: "Name",
      minWidth: 160,
      render: (row) => (
        <Typography.Body size="sm" bold>
          {row.display_name || "—"}
        </Typography.Body>
      ),
    },
    {
      id: "email",
      label: "Email",
      minWidth: 200,
    },
    {
      id: "role",
      label: "Role",
      minWidth: 100,
      render: (row) => (
        <Chip
          size="sm"
          variant="soft"
          color={ROLE_COLORS[row.role] ?? "neutral"}
        >
          {row.role.charAt(0).toUpperCase() + row.role.slice(1)}
        </Chip>
      ),
    },
    {
      id: "is_online",
      label: "Status",
      minWidth: 80,
      render: (row) => (
        <Chip
          size="sm"
          variant="soft"
          color={row.is_online ? "success" : "neutral"}
        >
          {row.is_online ? "Online" : "Offline"}
        </Chip>
      ),
    },
    {
      id: "last_login",
      label: "Last Login",
      minWidth: 120,
      render: (row) => (
        <Typography.Body size="xs">
          {row.last_login ? formatDate(row.last_login) : "Never"}
        </Typography.Body>
      ),
    },
    {
      id: "created_at",
      label: "Created",
      minWidth: 120,
      format: (value) => formatDate(value),
    },
  ];

  // Stats
  const roleCounts = STAFF_ROLES.map((role) => ({
    role,
    label: ROLE_LABELS[role],
    count: staff.filter((s) => s.role === role).length,
  }));
  const onlineCount = staff.filter((s) => s.is_online).length;

  if (loading) return <Loading />;

  return (
    <PageContainer sx={{ alignItems: "stretch", justifyContent: "flex-start" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography.Header size="sm" bold>
            Manage Staff
          </Typography.Header>
          <Typography.Body size="sm" color="default">
            Add staff accounts and assign roles
          </Typography.Body>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            colorScheme="primary"
            onClick={fetchStaff}
            startDecorator={<Refresh sx={{ fontSize: 18 }} />}
            size="sm"
          >
            Refresh
          </Button>
          <Button
            variant="solid"
            colorScheme="primary"
            onClick={() => setShowAddModal(true)}
            startDecorator={<Add sx={{ fontSize: 18 }} />}
            size="sm"
          >
            Add Staff
          </Button>
        </Box>
      </Box>

      {/* Stats */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(4, 1fr)",
          },
          gap: 2,
        }}
      >
        {roleCounts.map(({ role, label, count }) => (
          <Box
            key={role}
            sx={{
              p: 2,
              borderRadius: "12px",
              border: `1px solid ${borderColor}`,
              backgroundColor: cardBg,
            }}
          >
            <Typography.Body size="xs" color="default">
              {label}s
            </Typography.Body>
            <Typography.Header size="sm" bold color="primary">
              {count}
            </Typography.Header>
          </Box>
        ))}
        <Box
          sx={{
            p: 2,
            borderRadius: "12px",
            border: `1px solid ${borderColor}`,
            backgroundColor: cardBg,
          }}
        >
          <Typography.Body size="xs" color="default">
            Online Now
          </Typography.Body>
          <Typography.Header size="sm" bold color="primary">
            {onlineCount}
          </Typography.Header>
        </Box>
      </Box>

      {/* Staff Table */}
      <Table
        columns={columns}
        data={staff}
        rowKey="id"
        onRowClick={(row) => {
          setEditingStaff(row);
          setEditRole(row.role as StaffRole);
        }}
        emptyMessage="No staff members yet. Click 'Add Staff' to create one."
        rowsPerPage={10}
      />

      {/* Add Staff Modal */}
      <BaseModal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setForm(INITIAL_FORM);
        }}
        title="Add Staff Account"
        description="Create a new staff account with role assignment"
        actions={[
          {
            label: "Cancel",
            onClick: () => {
              setShowAddModal(false);
              setForm(INITIAL_FORM);
            },
            variant: "outlined",
            colorScheme: "secondary",
          },
          {
            label: "Create Account",
            onClick: handleAddStaff,
            variant: "solid",
            colorScheme: "primary",
            disabled: submitting,
          },
        ]}
        size="sm"
      >
        <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2.5 }}>
          <FormControl required>
            <FormLabel>
              <Typography.Label size="sm" color="dark">
                Full Name
              </Typography.Label>
            </FormLabel>
            <Input
              name="displayName"
              value={form.displayName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, displayName: e.target.value }))
              }
              placeholder="e.g. Juan Dela Cruz"
            />
          </FormControl>

          <FormControl required>
            <FormLabel>
              <Typography.Label size="sm" color="dark">
                Email Address
              </Typography.Label>
            </FormLabel>
            <Input
              name="email"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="staff@example.com"
            />
          </FormControl>

          <FormControl required>
            <FormLabel>
              <Typography.Label size="sm" color="dark">
                Password
              </Typography.Label>
            </FormLabel>
            <Input
              name="password"
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, password: e.target.value }))
              }
              placeholder="Minimum 6 characters"
            />
          </FormControl>

          <FormControl required>
            <FormLabel>
              <Typography.Label size="sm" color="dark">
                Role
              </Typography.Label>
            </FormLabel>
            <Select
              value={form.role}
              onChange={(_, val) =>
                setForm((prev) => ({
                  ...prev,
                  role: (val as StaffRole) ?? "staff",
                }))
              }
              sx={{ borderRadius: "8px" }}
            >
              <Option value="staff">Staff</Option>
              <Option value="manager">Manager</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </FormControl>
        </Box>
      </BaseModal>

      {/* Edit Staff Modal */}
      <BaseModal
        open={!!editingStaff}
        onClose={() => setEditingStaff(null)}
        title="Staff Details"
        description={editingStaff?.email}
        actions={[
          {
            label: "Remove Staff",
            onClick: () => {
              setDeleteTarget(editingStaff);
              setEditingStaff(null);
            },
            variant: "outlined",
            colorScheme: "error",
          },
          {
            label: "Cancel",
            onClick: () => setEditingStaff(null),
            variant: "outlined",
            colorScheme: "secondary",
          },
          {
            label: "Save Role",
            onClick: handleUpdateRole,
            variant: "solid",
            colorScheme: "primary",
            disabled: submitting,
          },
        ]}
        size="sm"
      >
        <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
          <Box>
            <Typography.Label size="sm" bold sx={{ mb: 0.5 }}>
              Name
            </Typography.Label>
            <Typography.Body size="sm">
              {editingStaff?.display_name || "—"}
            </Typography.Body>
          </Box>

          <Box>
            <Typography.Label size="sm" bold sx={{ mb: 0.5 }}>
              Status
            </Typography.Label>
            <Chip
              size="sm"
              variant="soft"
              color={editingStaff?.is_online ? "success" : "neutral"}
            >
              {editingStaff?.is_online ? "Online" : "Offline"}
            </Chip>
          </Box>

          <Box>
            <Typography.Label size="sm" bold sx={{ mb: 0.5 }}>
              Current Role
            </Typography.Label>
            <Chip
              size="sm"
              variant="soft"
              color={ROLE_COLORS[editingStaff?.role ?? "staff"] ?? "neutral"}
            >
              {editingStaff?.role}
            </Chip>
          </Box>

          <FormControl>
            <FormLabel>
              <Typography.Label size="sm" bold>
                Assign Role
              </Typography.Label>
            </FormLabel>
            <Select
              value={editRole}
              onChange={(_, val) => setEditRole((val as StaffRole) ?? "staff")}
              sx={{ borderRadius: "8px" }}
            >
              <Option value="staff">Staff</Option>
              <Option value="manager">Manager</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </FormControl>
        </Box>
      </BaseModal>

      {/* Delete Confirmation */}
      <Alert
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        type="warning"
        title="Remove Staff Member"
        message={`Are you sure you want to remove ${deleteTarget?.display_name || deleteTarget?.email}? This will delete their account record.`}
        onConfirm={handleDeleteConfirm}
        confirmText="Remove"
        showCancel
      />

      {/* Status Alert */}
      <Alert
        open={alert.open}
        onClose={() => setAlert({ ...alert, open: false })}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        showCancel={false}
        confirmText="OK"
      />
    </PageContainer>
  );
}
