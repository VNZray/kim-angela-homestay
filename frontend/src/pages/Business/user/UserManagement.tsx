import { useState, useEffect } from "react";
import { Box, Chip, Option, Select, useColorScheme } from "@mui/joy";
import { Refresh } from "@mui/icons-material";
import PageContainer from "@/components/PageContainer";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import type { TableColumn } from "@/components/ui/Table";
import Alert from "@/components/ui/Alert";
import BaseModal from "@/components/ui/BaseModal";
import Loading from "@/components/Loading";
import {
  deleteUser,
  getAllUsers,
  updateUserRole,
} from "@/services/auth/AuthService";
import type { SupabaseUser, UserRole } from "@/types/User";

const ROLE_COLORS: Record<
  UserRole,
  "danger" | "warning" | "primary" | "success"
> = {
  admin: "danger",
  manager: "warning",
  staff: "primary",
  tourist: "success",
};

const UserManagement = () => {
  const { mode } = useColorScheme();

  const [users, setUsers] = useState<SupabaseUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit role modal
  const [editingUser, setEditingUser] = useState<SupabaseUser | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>("tourist");
  const [saving, setSaving] = useState(false);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<SupabaseUser | null>(null);

  // Alert
  const [alert, setAlert] = useState<{
    open: boolean;
    type: "success" | "error" | "info";
    title: string;
    message: string;
  }>({ open: false, type: "info", title: "", message: "" });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data || []);
    } catch (error: any) {
      setAlert({
        open: true,
        type: "error",
        title: "Error",
        message: "Failed to load users: " + error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditRole = (user: SupabaseUser) => {
    setEditingUser(user);
    setSelectedRole(user.role);
  };

  const handleSaveRole = async () => {
    if (!editingUser) return;
    setSaving(true);
    try {
      await updateUserRole(editingUser.id, selectedRole);
      setAlert({
        open: true,
        type: "success",
        title: "Success",
        message: `User role updated to ${selectedRole}`,
      });
      fetchUsers();
      setEditingUser(null);
    } catch (error: any) {
      setAlert({
        open: true,
        type: "error",
        title: "Error",
        message: "Failed to update role: " + error.message,
      });
    } finally {
      setSaving(false);
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
        message: "User removed successfully.",
      });
      fetchUsers();
    } catch (error: any) {
      setAlert({
        open: true,
        type: "error",
        title: "Error",
        message: "Failed to delete user: " + error.message,
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
      id: "email",
      label: "Email",
      minWidth: 200,
    },
    {
      id: "display_name",
      label: "Display Name",
      minWidth: 140,
      render: (row) => (
        <Typography.Body size="sm">{row.display_name || "—"}</Typography.Body>
      ),
    },
    {
      id: "role",
      label: "Role",
      minWidth: 100,
      render: (row) => (
        <Chip size="sm" variant="soft" color={ROLE_COLORS[row.role]}>
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
      label: "Joined",
      minWidth: 120,
      format: (value) => formatDate(value),
    },
  ];

  const roleCounts = (
    ["admin", "manager", "staff", "tourist"] as UserRole[]
  ).map((role) => ({
    role,
    count: users.filter((u) => u.role === role).length,
  }));

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
            User Management
          </Typography.Header>
          <Typography.Body size="sm" color="default">
            Manage user roles and permissions
          </Typography.Body>
        </Box>
        <Button
          variant="outlined"
          colorScheme="primary"
          onClick={fetchUsers}
          startDecorator={<Refresh sx={{ fontSize: 18 }} />}
          size="sm"
        >
          Refresh
        </Button>
      </Box>

      {/* Role Stats */}
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
        {roleCounts.map(({ role, count }) => (
          <Box
            key={role}
            sx={{
              p: 2,
              borderRadius: "12px",
              border: `1px solid ${mode === "dark" ? "#374151" : "#e5e7eb"}`,
              backgroundColor: mode === "dark" ? "#1e1e1e" : "#fff",
            }}
          >
            <Typography.Body size="xs" color="default">
              {role.charAt(0).toUpperCase() + role.slice(1)}s
            </Typography.Body>
            <Typography.Header size="sm" bold color="primary">
              {count}
            </Typography.Header>
          </Box>
        ))}
      </Box>

      {/* Users Table */}
      <Table
        columns={columns}
        data={users}
        rowKey="id"
        onRowClick={handleEditRole}
        emptyMessage="No users found. Users will appear here after they sign up."
        rowsPerPage={10}
      />

      {/* Edit Role Modal */}
      <BaseModal
        open={!!editingUser}
        onClose={() => setEditingUser(null)}
        title="Edit User Role"
        description={editingUser?.email}
        actions={[
          {
            label: "Delete User",
            onClick: () => {
              setDeleteTarget(editingUser);
              setEditingUser(null);
            },
            variant: "outlined",
            colorScheme: "error",
          },
          {
            label: "Cancel",
            onClick: () => setEditingUser(null),
            variant: "outlined",
            colorScheme: "secondary",
          },
          {
            label: "Save Changes",
            onClick: handleSaveRole,
            variant: "solid",
            colorScheme: "primary",
            disabled: saving,
          },
        ]}
        size="sm"
      >
        <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
          <Box>
            <Typography.Label size="sm" bold sx={{ mb: 0.5 }}>
              Display Name
            </Typography.Label>
            <Typography.Body size="sm">
              {editingUser?.display_name || "—"}
            </Typography.Body>
          </Box>
          <Box>
            <Typography.Label size="sm" bold sx={{ mb: 0.5 }}>
              Current Role
            </Typography.Label>
            <Chip
              size="sm"
              variant="soft"
              color={ROLE_COLORS[editingUser?.role ?? "tourist"]}
            >
              {editingUser?.role}
            </Chip>
          </Box>
          <Box>
            <Typography.Label size="sm" bold sx={{ mb: 0.5, display: "block" }}>
              New Role
            </Typography.Label>
            <Select
              value={selectedRole}
              onChange={(_, value) => setSelectedRole(value as UserRole)}
              sx={{ width: "100%", borderRadius: "8px" }}
            >
              <Option value="tourist">Tourist</Option>
              <Option value="staff">Staff</Option>
              <Option value="manager">Manager</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Box>
        </Box>
      </BaseModal>

      {/* Delete Confirmation */}
      <Alert
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        type="warning"
        title="Delete User"
        message={`Are you sure you want to delete ${deleteTarget?.email}? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        confirmText="Delete"
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
};

export default UserManagement;
