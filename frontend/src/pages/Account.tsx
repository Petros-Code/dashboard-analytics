import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { adminService, User, Role, Permission, UserCreate, UserUpdate, RoleCreate, RoleUpdate, SetPermissionRequest } from '../services/adminService';

interface OperationalCost {
  id: number;
  month: string;
  amount: number | string;
  category: string;
  description: string | null;
  created_by: number;
  created_at: string;
  updated_at: string;
}

interface CostFormData {
  month: string;
  amount: string;
  category: string;
  description: string;
}

type AdminTab = 'users' | 'roles' | 'permissions' | 'costs';

const Account: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  
  // Coûts opérationnels
  const [costs, setCosts] = useState<OperationalCost[]>([]);
  const [showAddCost, setShowAddCost] = useState(false);
  const [costForm, setCostForm] = useState<CostFormData>({
    month: '',
    amount: '',
    category: '',
    description: '',
  });

  // Utilisateurs
  const [users, setUsers] = useState<User[]>([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState<UserCreate>({
    name: '',
    email: '',
    password: '',
  });
  const [selectedUserForRoles, setSelectedUserForRoles] = useState<number | null>(null);
  const [userRoles, setUserRoles] = useState<{ [userId: number]: Role[] }>({});

  // Rôles
  const [roles, setRoles] = useState<Role[]>([]);
  const [showAddRole, setShowAddRole] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleForm, setRoleForm] = useState<RoleCreate>({
    name: '',
    description: '',
  });

  // Permissions
  const [selectedRoleForPermissions, setSelectedRoleForPermissions] = useState<number | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  // États généraux
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Charger les coûts
  const loadCosts = async () => {
    try {
      const response = await api.get('/costs?skip=0&limit=100');
      setCosts(response.data.items || []);
    } catch (err: any) {
      console.error('Erreur lors du chargement des coûts:', err);
      setCosts([]);
    }
  };

  // Charger les utilisateurs
  const loadUsers = async () => {
    try {
      const data = await adminService.getUsers();
      setUsers(data.items);
      // Charger les rôles de chaque utilisateur en parallèle (optimisation N+1)
      await Promise.all(
        data.items.map(user => loadUserRoles(user.id))
      );
    } catch (err: any) {
      console.error('Erreur lors du chargement des utilisateurs:', err);
      setError('Erreur lors du chargement des utilisateurs');
    }
  };

  // Charger les rôles d'un utilisateur
  const loadUserRoles = async (userId: number) => {
    try {
      const data = await adminService.getUserRoles(userId);
      setUserRoles(prev => ({ ...prev, [userId]: data.roles }));
    } catch (err: any) {
      console.error('Erreur lors du chargement des rôles de l\'utilisateur:', err);
      setUserRoles(prev => ({ ...prev, [userId]: [] }));
    }
  };

  // Charger les rôles
  const loadRoles = async () => {
    try {
      const data = await adminService.getRoles();
      setRoles(data.items);
    } catch (err: any) {
      console.error('Erreur lors du chargement des rôles:', err);
      setError('Erreur lors du chargement des rôles');
    }
  };

  // Charger les permissions d'un rôle
  const loadPermissions = async (roleId: number) => {
    try {
      const data = await adminService.getRolePermissions(roleId);
      setPermissions(data.items);
    } catch (err: any) {
      console.error('Erreur lors du chargement des permissions:', err);
      setError('Erreur lors du chargement des permissions');
    }
  };

  // Vérifier si l'utilisateur est admin
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        await api.get('/costs?skip=0&limit=1');
        setIsAdmin(true);
        await loadCosts();
        await loadUsers();
        await loadRoles();
      } catch (err: any) {
        if (err.response?.status === 403) {
          setIsAdmin(false);
        } else {
          setIsAdmin(true);
          await loadCosts();
          await loadUsers();
          await loadRoles();
        }
      }
    };

    if (user) {
      checkAdmin();
    }
  }, [user]);

  // Gestion des messages
  const showMessage = (message: string, isError = false) => {
    if (isError) {
      setError(message);
      setSuccess('');
    } else {
      setSuccess(message);
      setError('');
    }
    setTimeout(() => {
      setError('');
      setSuccess('');
    }, 5000);
  };

  // ========== GESTION DES COÛTS ==========
  const handleAddCost = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (!costForm.month || !costForm.amount || !costForm.category) {
        showMessage('Tous les champs sont requis', true);
        return;
      }

      const monthRegex = /^(\d{4})-(\d{2})$/;
      if (!costForm.month.match(monthRegex)) {
        showMessage('Format de date invalide. Utilisez YYYY-MM', true);
        return;
      }

      const amountValue = parseFloat(costForm.amount);
      if (isNaN(amountValue) || amountValue <= 0) {
        showMessage('Le montant doit être un nombre positif', true);
        return;
      }

      const costData = {
        month: `${costForm.month}-01`,
        amount: amountValue,
        category: costForm.category,
        description: costForm.description?.trim() || null,
      };

      await api.post('/costs', costData);
      showMessage('Coût opérationnel ajouté avec succès !');
      setCostForm({ month: '', amount: '', category: '', description: '' });
      setShowAddCost(false);
      loadCosts();
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Erreur lors de l\'ajout du coût';
      showMessage(Array.isArray(errorMsg) ? errorMsg.map((e: any) => e.msg || e).join(', ') : errorMsg, true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCost = async (costId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce coût ?')) return;

    try {
      await api.delete(`/costs/${costId}`);
      showMessage('Coût supprimé avec succès !');
      loadCosts();
    } catch (err: any) {
      showMessage('Erreur lors de la suppression', true);
    }
  };

  // ========== GESTION DES UTILISATEURS ==========
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await adminService.createUser(userForm);
      showMessage('Utilisateur créé avec succès !');
      setUserForm({ name: '', email: '', password: '' });
      setShowAddUser(false);
      loadUsers();
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Erreur lors de la création';
      showMessage(Array.isArray(errorMsg) ? errorMsg.map((e: any) => e.msg || e).join(', ') : errorMsg, true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async (userId: number, updates: UserUpdate) => {
    setIsLoading(true);
    try {
      await adminService.updateUser(userId, updates);
      showMessage('Utilisateur mis à jour avec succès !');
      setEditingUser(null);
      loadUsers();
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Erreur lors de la mise à jour';
      showMessage(Array.isArray(errorMsg) ? errorMsg.map((e: any) => e.msg || e).join(', ') : errorMsg, true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

    try {
      await adminService.deleteUser(userId);
      showMessage('Utilisateur supprimé avec succès !');
      loadUsers();
    } catch (err: any) {
      showMessage('Erreur lors de la suppression', true);
    }
  };

  const handleToggleUserVerification = async (user: User) => {
    await handleUpdateUser(user.id, { is_verified: !user.is_verified });
  };

  // ========== GESTION DES RÔLES ==========
  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await adminService.createRole(roleForm);
      showMessage('Rôle créé avec succès !');
      setRoleForm({ name: '', description: '' });
      setShowAddRole(false);
      loadRoles();
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Erreur lors de la création';
      showMessage(Array.isArray(errorMsg) ? errorMsg.map((e: any) => e.msg || e).join(', ') : errorMsg, true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRole = async (roleId: number, updates: RoleUpdate) => {
    setIsLoading(true);
    try {
      await adminService.updateRole(roleId, updates);
      showMessage('Rôle mis à jour avec succès !');
      setEditingRole(null);
      loadRoles();
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Erreur lors de la mise à jour';
      showMessage(Array.isArray(errorMsg) ? errorMsg.map((e: any) => e.msg || e).join(', ') : errorMsg, true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRole = async (roleId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce rôle ?')) return;

    try {
      await adminService.deleteRole(roleId);
      showMessage('Rôle supprimé avec succès !');
      loadRoles();
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Erreur lors de la suppression';
      showMessage(errorMsg, true);
    }
  };

  // ========== GESTION DES RÔLES UTILISATEURS ==========
  const handleAssignRole = async (userId: number, roleId: number) => {
    try {
      await adminService.assignRoleToUser(userId, roleId);
      showMessage('Rôle assigné avec succès !');
      await loadUserRoles(userId);
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Erreur lors de l\'assignation';
      showMessage(errorMsg, true);
    }
  };

  const handleRemoveRole = async (userId: number, roleId: number) => {
    if (!window.confirm('Retirer ce rôle à l\'utilisateur ?')) return;

    try {
      await adminService.removeRoleFromUser(userId, roleId);
      showMessage('Rôle retiré avec succès !');
      await loadUserRoles(userId);
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Erreur lors du retrait';
      showMessage(errorMsg, true);
    }
  };

  const handleViewUserRoles = async (userId: number) => {
    setSelectedUserForRoles(userId);
    await loadUserRoles(userId);
  };

  // ========== GESTION DES PERMISSIONS ==========
  const handleSetPermission = async (roleId: number, section: string, permission: SetPermissionRequest) => {
    try {
      await adminService.setPermission(roleId, section, permission);
      showMessage('Permission mise à jour avec succès !');
      if (selectedRoleForPermissions === roleId) {
        loadPermissions(roleId);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Erreur lors de la mise à jour';
      showMessage(Array.isArray(errorMsg) ? errorMsg.map((e: any) => e.msg || e).join(', ') : errorMsg, true);
    }
  };

  const handleViewRolePermissions = async (roleId: number) => {
    setSelectedRoleForPermissions(roleId);
    await loadPermissions(roleId);
  };

  // Afficher un loader pendant le chargement
  if (authLoading || !user) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-100">
        <div className="text-lg text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] p-10 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-gray-800">Mon Compte</h1>
        <p className="text-lg text-gray-600 mb-8">
          Gérez vos informations et vos préférences
        </p>

        {/* Informations du compte */}
        <div className="bg-white rounded-lg p-6 mb-5 shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Informations du compte</h2>
          <div className="flex flex-col gap-3">
            <div>
              <strong className="text-gray-700">Nom :</strong>{' '}
              <span className="text-gray-600">{user?.name}</span>
            </div>
            <div>
              <strong className="text-gray-700">Email :</strong>{' '}
              <span className="text-gray-600">{user?.email}</span>
            </div>
            <div>
              <strong className="text-gray-700">Statut :</strong>{' '}
              <span className={`font-medium ${user?.is_active ? 'text-green-600' : 'text-red-600'}`}>
                {user?.is_active ? 'Actif' : 'Inactif'}
              </span>
            </div>
            <div>
              <strong className="text-gray-700">Vérifié :</strong>{' '}
              <span className={`font-medium ${user?.is_verified ? 'text-green-600' : 'text-yellow-600'}`}>
                {user?.is_verified ? 'Oui' : 'Non'}
              </span>
            </div>
            <div>
              <strong className="text-gray-700">Date de création :</strong>{' '}
              <span className="text-gray-600">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Section Admin */}
        {isAdmin && (
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Panneau d'Administration</h2>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                {(['users', 'roles', 'permissions', 'costs'] as AdminTab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab === 'users' && 'Utilisateurs'}
                    {tab === 'roles' && 'Rôles'}
                    {tab === 'permissions' && 'Permissions Dashboard'}
                    {tab === 'costs' && 'Coûts Opérationnels'}
                  </button>
                ))}
              </nav>
            </div>

            {/* Messages */}
            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm mb-4">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm mb-4">
                {success}
              </div>
            )}

            {/* Tab Content: Utilisateurs */}
            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">Gestion des Utilisateurs</h3>
                  <button
                    onClick={() => {
                      setShowAddUser(!showAddUser);
                      setEditingUser(null);
                      setUserForm({ name: '', email: '', password: '' });
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {showAddUser ? 'Annuler' : '+ Créer un utilisateur'}
                  </button>
                </div>

                {showAddUser && (
                  <form onSubmit={handleCreateUser} className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                        <input
                          type="text"
                          value={userForm.name}
                          onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                          required
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={userForm.email}
                          onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                          required
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                        <input
                          type="password"
                          value={userForm.password}
                          onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                          required
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                    >
                      {isLoading ? 'Création...' : 'Créer'}
                    </button>
                  </form>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-3 text-left text-sm font-medium text-gray-700 border-b">Nom</th>
                        <th className="p-3 text-left text-sm font-medium text-gray-700 border-b">Email</th>
                        <th className="p-3 text-left text-sm font-medium text-gray-700 border-b">Rôles</th>
                        <th className="p-3 text-left text-sm font-medium text-gray-700 border-b">Statut</th>
                        <th className="p-3 text-left text-sm font-medium text-gray-700 border-b">Vérifié</th>
                        <th className="p-3 text-left text-sm font-medium text-gray-700 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-4 text-center text-gray-500">
                            Aucun utilisateur
                          </td>
                        </tr>
                      ) : (
                        users.map((u) => (
                          <tr key={u.id} className="border-b hover:bg-gray-50">
                            <td className="p-3 text-sm text-gray-700">{u.name}</td>
                            <td className="p-3 text-sm text-gray-700">{u.email}</td>
                            <td className="p-3 text-sm">
                              <div className="flex flex-wrap gap-1">
                                {userRoles[u.id] && userRoles[u.id].length > 0 ? (
                                  userRoles[u.id].map((role) => (
                                    <span
                                      key={role.id}
                                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                                    >
                                      {role.name}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-gray-400 text-xs">Aucun rôle</span>
                                )}
                              </div>
                            </td>
                            <td className="p-3 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs ${u.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {u.is_active ? 'Actif' : 'Inactif'}
                              </span>
                            </td>
                            <td className="p-3 text-sm">
                              <button
                                onClick={() => handleToggleUserVerification(u)}
                                className={`px-2 py-1 rounded-full text-xs ${u.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                              >
                                {u.is_verified ? 'Vérifié' : 'Non vérifié'}
                              </button>
                            </td>
                            <td className="p-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleViewUserRoles(u.id)}
                                  className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700"
                                >
                                  Gérer les rôles
                                </button>
                                {!userRoles[u.id]?.some(role => role.name.toLowerCase() === 'admin') && (
                                  <button
                                    onClick={() => handleDeleteUser(u.id)}
                                    className="px-3 py-1 bg-red-600 text-white rounded-md text-xs hover:bg-red-700"
                                  >
                                    Supprimer
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Modal de gestion des rôles */}
                {selectedUserForRoles && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">
                          Gérer les rôles de {users.find(u => u.id === selectedUserForRoles)?.name}
                        </h3>
                        <button
                          onClick={() => setSelectedUserForRoles(null)}
                          className="text-gray-500 hover:text-gray-700 text-2xl"
                        >
                          ×
                        </button>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">Rôles actuels :</h4>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {userRoles[selectedUserForRoles] && userRoles[selectedUserForRoles].length > 0 ? (
                            userRoles[selectedUserForRoles].map((role) => (
                              <div
                                key={role.id}
                                className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                              >
                                <span>{role.name}</span>
                                <button
                                  onClick={() => handleRemoveRole(selectedUserForRoles, role.id)}
                                  className="text-blue-800 hover:text-red-600 font-bold"
                                  title="Retirer ce rôle"
                                >
                                  ×
                                </button>
                              </div>
                            ))
                          ) : (
                            <span className="text-gray-400 text-sm">Aucun rôle assigné</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Assigner un nouveau rôle :</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {roles
                            .filter(role => !userRoles[selectedUserForRoles]?.some(ur => ur.id === role.id))
                            .map((role) => (
                              <button
                                key={role.id}
                                onClick={() => handleAssignRole(selectedUserForRoles, role.id)}
                                className="p-3 text-left border border-gray-300 rounded-md hover:bg-blue-50 hover:border-blue-500 transition-colors"
                              >
                                <div className="font-medium text-gray-800">{role.name}</div>
                                {role.description && (
                                  <div className="text-sm text-gray-600">{role.description}</div>
                                )}
                              </button>
                            ))}
                          {roles.filter(role => !userRoles[selectedUserForRoles]?.some(ur => ur.id === role.id)).length === 0 && (
                            <div className="text-gray-400 text-sm">Tous les rôles sont déjà assignés</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab Content: Rôles */}
            {activeTab === 'roles' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">Gestion des Rôles</h3>
                  <button
                    onClick={() => {
                      setShowAddRole(!showAddRole);
                      setEditingRole(null);
                      setRoleForm({ name: '', description: '' });
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {showAddRole ? 'Annuler' : '+ Créer un rôle'}
                  </button>
                </div>

                {showAddRole && (
                  <form onSubmit={handleCreateRole} className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                        <input
                          type="text"
                          value={roleForm.name}
                          onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                          required
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input
                          type="text"
                          value={roleForm.description}
                          onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                    >
                      {isLoading ? 'Création...' : 'Créer'}
                    </button>
                  </form>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-3 text-left text-sm font-medium text-gray-700 border-b">Nom</th>
                        <th className="p-3 text-left text-sm font-medium text-gray-700 border-b">Description</th>
                        <th className="p-3 text-left text-sm font-medium text-gray-700 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roles.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="p-4 text-center text-gray-500">
                            Aucun rôle
                          </td>
                        </tr>
                      ) : (
                        roles.map((role) => (
                          <tr key={role.id} className="border-b hover:bg-gray-50">
                            <td className="p-3 text-sm text-gray-700 font-medium">{role.name}</td>
                            <td className="p-3 text-sm text-gray-600">{role.description || '-'}</td>
                            <td className="p-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleViewRolePermissions(role.id)}
                                  className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700"
                                >
                                  Permissions
                                </button>
                                {role.name.toLowerCase() !== 'admin' && (
                                  <button
                                    onClick={() => handleDeleteRole(role.id)}
                                    className="px-3 py-1 bg-red-600 text-white rounded-md text-xs hover:bg-red-700"
                                  >
                                    Supprimer
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab Content: Permissions Dashboard */}
            {activeTab === 'permissions' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Permissions d'Accès au Dashboard</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sélectionner un rôle</label>
                  <select
                    value={selectedRoleForPermissions || ''}
                    onChange={(e) => {
                      const roleId = parseInt(e.target.value);
                      setSelectedRoleForPermissions(roleId);
                      loadPermissions(roleId);
                    }}
                    className="p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">-- Sélectionner un rôle --</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedRoleForPermissions && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-4">Permissions pour le Dashboard</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-white rounded-md">
                        <div>
                          <span className="font-medium">Section Dashboard</span>
                          <p className="text-sm text-gray-600">Contrôle l'accès à la visualisation et l'édition du dashboard</p>
                        </div>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={permissions.find(p => p.section === 'dashboard')?.can_view || false}
                              onChange={(e) => {
                                const perm = permissions.find(p => p.section === 'dashboard');
                                handleSetPermission(selectedRoleForPermissions, 'dashboard', {
                                  can_view: e.target.checked,
                                  can_edit: perm?.can_edit || false,
                                });
                              }}
                              className="w-4 h-4"
                            />
                            <span className="text-sm">Visualisation</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={permissions.find(p => p.section === 'dashboard')?.can_edit || false}
                              onChange={(e) => {
                                const perm = permissions.find(p => p.section === 'dashboard');
                                handleSetPermission(selectedRoleForPermissions, 'dashboard', {
                                  can_view: perm?.can_view || false,
                                  can_edit: e.target.checked,
                                });
                              }}
                              className="w-4 h-4"
                            />
                            <span className="text-sm">Édition</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab Content: Coûts Opérationnels */}
            {activeTab === 'costs' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">Coûts Opérationnels</h3>
                  <button
                    onClick={() => setShowAddCost(!showAddCost)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {showAddCost ? 'Annuler' : '+ Ajouter un coût'}
                  </button>
                </div>

                {showAddCost && (
                  <form onSubmit={handleAddCost} className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mois</label>
                        <input
                          type="month"
                          value={costForm.month}
                          onChange={(e) => setCostForm({ ...costForm, month: e.target.value })}
                          required
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Montant (€)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={costForm.amount}
                          onChange={(e) => setCostForm({ ...costForm, amount: e.target.value })}
                          required
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                        <select
                          value={costForm.category}
                          onChange={(e) => setCostForm({ ...costForm, category: e.target.value })}
                          required
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Sélectionner</option>
                          <option value="hosting">Hébergement</option>
                          <option value="marketing">Marketing</option>
                          <option value="salaries">Salaires</option>
                          <option value="tools">Outils</option>
                          <option value="other">Autre</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={costForm.description}
                          onChange={(e) => setCostForm({ ...costForm, description: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          rows={3}
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                    >
                      {isLoading ? 'Ajout...' : 'Ajouter'}
                    </button>
                  </form>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-3 text-left text-sm font-medium text-gray-700 border-b">Mois</th>
                        <th className="p-3 text-left text-sm font-medium text-gray-700 border-b">Montant</th>
                        <th className="p-3 text-left text-sm font-medium text-gray-700 border-b">Catégorie</th>
                        <th className="p-3 text-left text-sm font-medium text-gray-700 border-b">Description</th>
                        <th className="p-3 text-left text-sm font-medium text-gray-700 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {costs.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-4 text-center text-gray-500">
                            Aucun coût opérationnel
                          </td>
                        </tr>
                      ) : (
                        costs.map((cost) => (
                          <tr key={cost.id} className="border-b hover:bg-gray-50">
                            <td className="p-3 text-sm text-gray-700">
                              {new Date(cost.month).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}
                            </td>
                            <td className="p-3 text-sm text-gray-700 font-medium">
                              {typeof cost.amount === 'number' ? cost.amount.toFixed(2) : parseFloat(String(cost.amount)).toFixed(2)} €
                            </td>
                            <td className="p-3 text-sm">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                {cost.category}
                              </span>
                            </td>
                            <td className="p-3 text-sm text-gray-600">{cost.description || '-'}</td>
                            <td className="p-3">
                              <button
                                onClick={() => handleDeleteCost(cost.id)}
                                className="px-3 py-1 bg-red-600 text-white rounded-md text-xs hover:bg-red-700"
                              >
                                Supprimer
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
