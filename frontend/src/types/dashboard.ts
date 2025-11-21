// Types pour le Dashboard

import React from 'react';

export type MenuItemId = 'accueil' | 'performances' | 'rentabilite' | 'stocks' | 'marketing' | 'traffic';

export interface MenuItem {
  id: MenuItemId;
  label: string;
  icon: React.ReactNode;
}

export interface FilterOption {
  id: string;
  label: string;
  value: string;
  icon: React.ReactNode;
}

export interface KPICard {
  id: string;
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}

export interface GraphContainer {
  id: string;
  width: number;
  height: number;
  left: number;
  top: number;
}

