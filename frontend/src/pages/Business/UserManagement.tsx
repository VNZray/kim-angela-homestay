import { useState, useEffect } from "react";
import {
  Box,
  Table,
  Sheet,
  Chip,
  IconButton,
  Select,
  Option,
  Modal,
  ModalDialog,
  ModalClose,
  Stack,
} from "@mui/joy";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import { Edit, Delete, PersonAdd, Refresh } from "@mui/icons-material";
import supabase from "@/utils/supabase";
import type { UserRole } from "@/types/User";
import Alert from "@/components/ui/Alert";

interface UserRoleData {
  id: string;
  firebase_uid: string;
  email: string;
  role: UserRole;
  display_name: string | null;
  created_at: string;
  updated_at: string;
}

const roleColors: Record<
  UserRole,
  "primary" | "success" | "warning" | "danger"
> = {
  admin: "danger",
  manager: "warning",
  staff: "primary",
  tourist: "success",
};

const UserManagement = () => {
  const [users, setUsers] = useState<UserRoleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<UserRoleData | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>("tourist");
  const [alert, setAlert] = useState({
    open: false,
    type: "info" as "success" | "error" | "warning" | "info",
    title: "",
    message: "",
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setUsers(data || []);
    } catch (error: any) {
      console.error("Error fetching users:", error);
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

  const handleEditRole = (user: UserRoleData) => {
    setEditingUser(user);
    setSelectedRole(user.role);
  };

  const handleSaveRole = async () => {
    if (!editingUser) return;

    try {
      const { error } = await supabase
        .from("user_roles")
        .update({ role: selectedRole, updated_at: new Date().toISOString() })
        .eq("id", editingUser.id);

      if (error) throw error;

      setAlert({
        open: true,
        type: "success",
        title: "Success",
        message: `User role updated to ${selectedRole}`,
      });

      fetchUsers();
      setEditingUser(null);
    } catch (error: any) {
      console.error("Error updating role:", error);
      setAlert({
        open: true,
        type: "error",
        title: "Error",
        message: "Failed to update role: " + error.message,
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (
      !confirm(
        "Are you sure you want to remove this user's role? They can still login but will be assigned the default tourist role.",
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("id", userId);

      if (error) throw error;

      setAlert({
        open: true,
        type: "success",
        title: "Success",
        message: "User role removed",
      });

      fetchUsers();
    } catch (error: any) {
      console.error("Error deleting user:", error);
      setAlert({
        open: true,
        type: "error",
        title: "Error",
        message: "Failed to delete user: " + error.message,
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography.Header size="sm" bold>
            User Management
          </Typography.Header>
          <Typography.Body size="sm" color="secondary">
            Manage user roles and permissions
          </Typography.Body>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            colorScheme="primary"
            onClick={fetchUsers}
            disabled={loading}
          >
            <Refresh sx={{ mr: 1 }} />
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        {(["admin", "manager", "staff", "tourist"] as UserRole[]).map(
          (role) => {
            const count = users.filter((u) => u.role === role).length;
            return (
              <Sheet
                key={role}
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: "sm",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Typography.Body size="sm" color="secondary">
                  {role.charAt(0).toUpperCase() + role.slice(1)}s
                </Typography.Body>
                <Typography.Header size="xs" bold>
                  {count}
                </Typography.Header>
              </Sheet>
            );
          },
        )}
      </Box>

      {/* Users Table */}
      <Sheet variant="outlined" sx={{ borderRadius: "sm", overflow: "auto" }}>
        {loading ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography.Body>Loading users...</Typography.Body>
          </Box>
        ) : users.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography.Body color="secondary">
              No users found. Users will appear here after they sign up.
            </Typography.Body>
          </Box>
        ) : (
          <Table
            aria-label="users table"
            stickyHeader
            sx={{
              "& thead th": { bgcolor: "background.surface" },
            }}
          >
            <thead>
              <tr>
                <th style={{ width: "30%" }}>Email</th>
                <th style={{ width: "20%" }}>Display Name</th>
                <th style={{ width: "15%" }}>Role</th>
                <th style={{ width: "20%" }}>Last Updated</th>
                <th style={{ width: "15%", textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <Typography.Body size="sm">{user.email}</Typography.Body>
                  </td>
                  <td>
                    <Typography.Body size="sm">
                      {user.display_name || "-"}
                    </Typography.Body>
                  </td>
                  <td>
                    <Chip
                      color={roleColors[user.role]}
                      size="sm"
                      variant="soft"
                    >
                      {user.role}
                    </Chip>
                  </td>
                  <td>
                    <Typography.Body size="xs" color="secondary">
                      {formatDate(user.updated_at)}
                    </Typography.Body>
                  </td>
                  <td>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        justifyContent: "center",
                      }}
                    >
                      <IconButton
                        size="sm"
                        variant="plain"
                        color="primary"
                        onClick={() => handleEditRole(user)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="sm"
                        variant="plain"
                        color="danger"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Sheet>

      {/* Edit Role Modal */}
      <Modal open={!!editingUser} onClose={() => setEditingUser(null)}>
        <ModalDialog sx={{ minWidth: 400 }}>
          <ModalClose />
          <Typography.CardTitle>Edit User Role</Typography.CardTitle>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Box>
              <Typography.Label size="sm" bold>
                Email
              </Typography.Label>
              <Typography.Body size="sm">{editingUser?.email}</Typography.Body>
            </Box>
            <Box>
              <Typography.Label size="sm" bold sx={{ mb: 1, display: "block" }}>
                Role
              </Typography.Label>
              <Select
                value={selectedRole}
                onChange={(_, value) => setSelectedRole(value as UserRole)}
                sx={{ width: "100%" }}
              >
                <Option value="tourist">Tourist</Option>
                <Option value="staff">Staff</Option>
                <Option value="manager">Manager</Option>
                <Option value="admin">Admin</Option>
              </Select>
            </Box>
            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                colorScheme="undefined"
                onClick={() => setEditingUser(null)}
              >
                Cancel
              </Button>
              <Button colorScheme="primary" onClick={handleSaveRole}>
                Save Changes
              </Button>
            </Box>
          </Stack>
        </ModalDialog>
      </Modal>

      {/* Alert */}
      <Alert
        open={alert.open}
        onClose={() => setAlert({ ...alert, open: false })}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        showCancel={false}
        confirmText="OK"
      />
    </Box>
  );
};

export default UserManagement;
