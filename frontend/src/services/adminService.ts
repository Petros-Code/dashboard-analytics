import api from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface UserCreate {
  name: string;
  email: string;
  password: string;
}

export interface UserUpdate {
  name?: string;
  email?: string;
  password?: string;
  is_active?: boolean;
  is_verified?: boolean;
}

export interface Role {
  id: number;
  name: string;
  description: string | null;
}

export interface RoleCreate {
  name: string;
  description?: string;
}

export interface RoleUpdate {
  name?: string;
  description?: string;
}

export interface Permission {
  id: number;
  role_id: number;
  section: string;
  can_view: boolean;
  can_edit: boolean;
  created_at: string;
}

export interface SetPermissionRequest {
  can_view: boolean;
  can_edit: boolean;
}

class AdminService {
  // ========== USERS ==========
  async getUsers(skip = 0, limit = 100): Promise<{ items: User[]; total: number }> {
    const response = await api.get(`/users?skip=${skip}&limit=${limit}`);
    return response.data;
  }

  async getUser(userId: number): Promise<User> {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  }

  async createUser(userData: UserCreate): Promise<User> {
    const response = await api.post('/users', userData);
    return response.data;
  }

  async updateUser(userId: number, userData: UserUpdate): Promise<User> {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  }

  async deleteUser(userId: number): Promise<void> {
    await api.delete(`/users/${userId}`);
  }

  // ========== ROLES ==========
  async getRoles(skip = 0, limit = 100): Promise<{ items: Role[]; total: number }> {
    const response = await api.get(`/roles?skip=${skip}&limit=${limit}`);
    return response.data;
  }

  async getRole(roleId: number): Promise<Role> {
    const response = await api.get(`/roles/${roleId}`);
    return response.data;
  }

  async createRole(roleData: RoleCreate): Promise<Role> {
    const response = await api.post('/roles', roleData);
    return response.data;
  }

  async updateRole(roleId: number, roleData: RoleUpdate): Promise<Role> {
    const response = await api.put(`/roles/${roleId}`, roleData);
    return response.data;
  }

  async deleteRole(roleId: number): Promise<void> {
    await api.delete(`/roles/${roleId}`);
  }

  // ========== USER ROLES ==========
  async getUserRoles(userId: number): Promise<{ user_id: number; roles: Role[] }> {
    const response = await api.get(`/users/${userId}/roles`);
    return response.data;
  }

  async assignRoleToUser(userId: number, roleId: number): Promise<User> {
    const response = await api.post(`/users/${userId}/roles/${roleId}`);
    return response.data;
  }

  async removeRoleFromUser(userId: number, roleId: number): Promise<User> {
    const response = await api.delete(`/users/${userId}/roles/${roleId}`);
    return response.data;
  }

  // ========== PERMISSIONS ==========
  async getRolePermissions(roleId: number): Promise<{ items: Permission[] }> {
    const response = await api.get(`/permissions/role/${roleId}`);
    return response.data;
  }

  async setPermission(roleId: number, section: string, permission: SetPermissionRequest): Promise<Permission> {
    const response = await api.post(`/permissions/role/${roleId}/section/${section}`, permission);
    return response.data;
  }

  async updatePermission(permissionId: number, permission: SetPermissionRequest): Promise<Permission> {
    const response = await api.put(`/permissions/${permissionId}`, permission);
    return response.data;
  }

  async deletePermission(permissionId: number): Promise<void> {
    await api.delete(`/permissions/${permissionId}`);
  }
}

export const adminService = new AdminService();

