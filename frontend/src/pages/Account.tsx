import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

interface OperationalCost {
  id: number;
  month: string;
  amount: number | string; // Peut être un nombre ou une string selon l'API
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

const Account: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [costs, setCosts] = useState<OperationalCost[]>([]);
  const [showAddCost, setShowAddCost] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [costForm, setCostForm] = useState<CostFormData>({
    month: '',
    amount: '',
    category: '',
    description: '',
  });

  const loadCosts = async () => {
    try {
      const response = await api.get('/costs?skip=0&limit=100');
      setCosts(response.data.items || []);
    } catch (err: any) {
      console.error('Erreur lors du chargement des coûts:', err);
      setCosts([]);
    }
  };

  // Vérifier si l'utilisateur est admin
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        // Essayer d'accéder à une route admin pour vérifier
        // Si ça fonctionne, l'utilisateur est admin
        await api.get('/costs?skip=0&limit=1');
        setIsAdmin(true);
        await loadCosts();
      } catch (err: any) {
        // Si 403, l'utilisateur n'est pas admin
        if (err.response?.status === 403) {
          setIsAdmin(false);
        } else {
          // Autre erreur (peut-être pas de coûts), mais on considère admin si pas 403
          setIsAdmin(true);
          await loadCosts();
        }
      }
    };

    if (user) {
      checkAdmin();
    }
  }, [user]);

  const handleAddCost = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // Validation des champs
      if (!costForm.month) {
        setError('Le mois est requis.');
        setIsLoading(false);
        return;
      }

      if (!costForm.amount || isNaN(parseFloat(costForm.amount))) {
        setError('Le montant doit être un nombre valide.');
        setIsLoading(false);
        return;
      }

      const amountValue = parseFloat(costForm.amount);
      if (amountValue <= 0) {
        setError('Le montant doit être supérieur à 0.');
        setIsLoading(false);
        return;
      }

      if (!costForm.category) {
        setError('La catégorie est requise.');
        setIsLoading(false);
        return;
      }

      // Convertir le format "YYYY-MM" en "YYYY-MM-DD" (premier jour du mois)
      // L'input type="month" devrait retourner "YYYY-MM"
      let monthDate = '';
      if (costForm.month) {
        // Vérifier que c'est bien au format YYYY-MM
        const monthRegex = /^(\d{4})-(\d{2})$/;
        const match = costForm.month.match(monthRegex);
        
        if (match) {
          // Format correct : YYYY-MM
          monthDate = `${costForm.month}-01`;
        } else {
          // Format incorrect, essayer de nettoyer
          console.warn('Format de mois inattendu:', costForm.month);
          setError('Format de date invalide. Veuillez sélectionner un mois valide dans le sélecteur.');
          setIsLoading(false);
          return;
        }
      }
      
      const costData = {
        month: monthDate,
        amount: amountValue,
        category: costForm.category,
        description: costForm.description && costForm.description.trim() ? costForm.description.trim() : null,
      };

      console.log('Données envoyées:', costData); // Debug
      const response = await api.post('/costs', costData);
      console.log('Réponse API:', response.data); // Debug
      setSuccess('Coût opérationnel ajouté avec succès !');
      setCostForm({
        month: '',
        amount: '',
        category: '',
        description: '',
      });
      setShowAddCost(false);
      loadCosts();
    } catch (err: any) {
      console.error('Erreur complète:', err); // Debug
      console.error('Réponse erreur:', err.response?.data); // Debug
      
      // Gérer les erreurs de validation FastAPI
      let errorMessage = 'Erreur lors de l\'ajout du coût opérationnel.';
      
      if (err.response?.data) {
        const errorData = err.response.data;
        
        // Si c'est un tableau d'erreurs de validation (Pydantic)
        if (Array.isArray(errorData.detail)) {
          errorMessage = errorData.detail
            .map((item: any) => {
              if (typeof item === 'string') return item;
              if (item.msg) {
                const field = item.loc?.slice(1).join('.') || 'champ';
                return `${field}: ${item.msg}`;
              }
              return JSON.stringify(item);
            })
            .join(', ');
        } 
        // Si c'est une string simple
        else if (typeof errorData.detail === 'string') {
          errorMessage = errorData.detail;
        }
        // Si c'est un objet, convertir en string
        else if (errorData.detail) {
          errorMessage = JSON.stringify(errorData.detail);
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCost = async (costId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce coût ?')) {
      return;
    }

    try {
      await api.delete(`/costs/${costId}`);
      setSuccess('Coût supprimé avec succès !');
      loadCosts();
    } catch (err: any) {
      // Gérer les erreurs de validation FastAPI
      let errorMessage = 'Erreur lors de la suppression du coût.';
      
      if (err.response?.data) {
        const errorData = err.response.data;
        
        // Si c'est un tableau d'erreurs de validation (Pydantic)
        if (Array.isArray(errorData.detail)) {
          errorMessage = errorData.detail
            .map((item: any) => {
              if (typeof item === 'string') return item;
              if (item.msg) return `${item.loc?.join('.') || ''}: ${item.msg}`;
              return JSON.stringify(item);
            })
            .join(', ');
        } 
        // Si c'est une string simple
        else if (typeof errorData.detail === 'string') {
          errorMessage = errorData.detail;
        }
        // Si c'est un objet, convertir en string
        else if (errorData.detail) {
          errorMessage = JSON.stringify(errorData.detail);
        }
      }
      
      setError(errorMessage);
    }
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
      <div className="max-w-6xl mx-auto">
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

        {/* Section Admin - Coûts opérationnels */}
        {isAdmin && (
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Coûts Opérationnels</h2>
              <button
                onClick={() => setShowAddCost(!showAddCost)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {showAddCost ? 'Annuler' : '+ Ajouter un coût'}
              </button>
            </div>

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

            {/* Formulaire d'ajout */}
            {showAddCost && (
              <form onSubmit={handleAddCost} className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      Mois
                    </label>
                    <input
                      type="month"
                      value={costForm.month}
                      onChange={(e) => {
                        // S'assurer qu'on récupère bien la valeur au format YYYY-MM
                        const value = e.target.value;
                        console.log('Valeur input month:', value); // Debug
                        setCostForm({ ...costForm, month: value });
                      }}
                      required
                      className="p-2 border border-gray-300 rounded-md outline-none focus:border-blue-500"
                      placeholder="YYYY-MM"
                      title="Format: YYYY-MM (ex: 2025-11)"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      Montant (€)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={costForm.amount}
                      onChange={(e) => setCostForm({ ...costForm, amount: e.target.value })}
                      required
                      className="p-2 border border-gray-300 rounded-md outline-none focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      Catégorie
                    </label>
                    <select
                      value={costForm.category}
                      onChange={(e) => setCostForm({ ...costForm, category: e.target.value })}
                      required
                      className="p-2 border border-gray-300 rounded-md outline-none focus:border-blue-500"
                    >
                      <option value="">Sélectionner une catégorie</option>
                      <option value="hosting">Hébergement</option>
                      <option value="marketing">Marketing</option>
                      <option value="salaries">Salaires</option>
                      <option value="tools">Outils</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      value={costForm.description}
                      onChange={(e) => setCostForm({ ...costForm, description: e.target.value })}
                      className="p-2 border border-gray-300 rounded-md outline-none focus:border-blue-500"
                      rows={3}
                      placeholder="Description du coût..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`mt-4 px-4 py-2 rounded-md text-white font-medium transition-colors ${
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                  }`}
                >
                  {isLoading ? 'Ajout en cours...' : 'Ajouter le coût'}
                </button>
              </form>
            )}

            {/* Liste des coûts */}
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
                        Aucun coût opérationnel enregistré
                      </td>
                    </tr>
                  ) : (
                    costs.map((cost) => (
                      <tr key={cost.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-sm text-gray-700">
                          {new Date(cost.month).toLocaleDateString('fr-FR', { 
                            year: 'numeric', 
                            month: 'long' 
                          })}
                        </td>
                        <td className="p-3 text-sm text-gray-700 font-medium">
                          {typeof cost.amount === 'number' 
                            ? cost.amount.toFixed(2) 
                            : parseFloat(String(cost.amount)).toFixed(2)} €
                        </td>
                        <td className="p-3 text-sm text-gray-700">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {cost.category}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-gray-600">
                          {cost.description || '-'}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleDeleteCost(cost.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded-md text-xs hover:bg-red-700 transition-colors"
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
    </div>
  );
};

export default Account;

