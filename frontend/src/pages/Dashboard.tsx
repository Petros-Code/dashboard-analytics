import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] p-10 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-gray-800">Dashboard</h1>
        <p className="text-lg text-gray-600 mb-8">
          Visualisation des données et graphiques
        </p>

        <div className="bg-white rounded-lg p-6 shadow-md">
          <p className="text-gray-600">
            Les graphiques et visualisations seront ajoutés prochainement.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
