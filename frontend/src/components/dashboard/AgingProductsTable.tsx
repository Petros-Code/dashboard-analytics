import React, { useEffect, useState, useRef } from 'react';
import { dashboardService } from '../../services/dashboardService';

interface AgingProduct {
  id: number;
  name: string;
  sku: string;
  category: string;
  purchase_price: number | null;
  selling_price_ht: number | null;
  selling_price_ttc: number | null;
  created_at: string;
  days_in_stock: number;
}

interface AgingProductsTableProps {
  days: number | null;
}

export const AgingProductsTable: React.FC<AgingProductsTableProps> = ({ days }) => {
  const [products, setProducts] = useState<AgingProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!days) {
        setProducts([]);
        return;
      }

      setLoading(true);
      try {
        const response = await dashboardService.getAgingProducts(days);
        setProducts(response.products || []);
      } catch (error) {
        console.error('Error fetching aging products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [days]);

  // Scroll vers le tableau quand days change et que le tableau est visible
  useEffect(() => {
    if (days && tableRef.current) {
      // Petit délai pour s'assurer que le DOM est mis à jour
      setTimeout(() => {
        tableRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  }, [days]);

  if (!days) {
    return null;
  }

  if (loading) {
    return (
      <div ref={tableRef} className="w-full p-4 bg-white rounded-[10px] shadow-sm">
        <p className="text-[#7A778E]">Chargement...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div ref={tableRef} className="w-full p-4 bg-white rounded-[10px] shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-[#1D1D1D]">
          Produits vieillissants ({days} jours)
        </h3>
        <p className="text-[#7A778E]">Aucun produit trouvé</p>
      </div>
    );
  }

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '-';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR');
  };

  return (
    <div ref={tableRef} className="w-full p-4 bg-white rounded-[10px] shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-[#1D1D1D]">
        Produits vieillissants ({days} jours)
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#E7EAF0]">
              <th className="p-3 text-left text-sm font-medium text-[#1D1D1D] border-b">Nom</th>
              <th className="p-3 text-left text-sm font-medium text-[#1D1D1D] border-b">SKU</th>
              <th className="p-3 text-left text-sm font-medium text-[#1D1D1D] border-b">Catégorie</th>
              <th className="p-3 text-left text-sm font-medium text-[#1D1D1D] border-b">Prix d'achat</th>
              <th className="p-3 text-left text-sm font-medium text-[#1D1D1D] border-b">Prix de vente HT</th>
              <th className="p-3 text-left text-sm font-medium text-[#1D1D1D] border-b">Prix de vente TTC</th>
              <th className="p-3 text-left text-sm font-medium text-[#1D1D1D] border-b">Date de création</th>
              <th className="p-3 text-left text-sm font-medium text-[#1D1D1D] border-b">Jours en stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-[#F5F5F5]">
                <td className="p-3 text-sm text-[#1D1D1D]">{product.name}</td>
                <td className="p-3 text-sm text-[#1D1D1D]">{product.sku}</td>
                <td className="p-3 text-sm text-[#1D1D1D]">{product.category}</td>
                <td className="p-3 text-sm text-[#1D1D1D]">{formatCurrency(product.purchase_price)}</td>
                <td className="p-3 text-sm text-[#1D1D1D]">{formatCurrency(product.selling_price_ht)}</td>
                <td className="p-3 text-sm text-[#1D1D1D]">{formatCurrency(product.selling_price_ttc)}</td>
                <td className="p-3 text-sm text-[#1D1D1D]">{formatDate(product.created_at)}</td>
                <td className="p-3 text-sm text-[#1D1D1D] font-medium">{product.days_in_stock} jours</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

