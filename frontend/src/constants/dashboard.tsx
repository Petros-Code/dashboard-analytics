// Constantes pour le Dashboard

// Configuration des éléments de menu
export const MENU_ITEMS = [
  {
    id: 'accueil' as const,
    label: 'Accueil',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'performances' as const,
    label: 'Performances',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M3 13H11V3H3V13ZM3 21H11V15H3V21ZM13 21H21V11H13V21ZM13 3V9H21V3H13Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'rentabilite' as const,
    label: 'Rentabilité',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'stocks' as const,
    label: 'Stocks',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M6 2H18C19.1 2 20 2.9 20 4V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V4C4 2.9 4.9 2 6 2ZM6 4V20H18V4H6Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'marketing' as const,
    label: 'Marketing',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'traffic' as const,
    label: 'Traffic',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="6" height="6" fill="currentColor" />
        <rect x="10.5" y="3" width="6" height="6" fill="currentColor" />
        <rect x="18" y="3" width="6" height="6" fill="currentColor" />
        <rect x="3" y="10.5" width="6" height="6" fill="currentColor" />
        <rect x="10.5" y="10.5" width="6" height="6" fill="currentColor" />
        <rect x="18" y="10.5" width="6" height="6" fill="currentColor" />
      </svg>
    ),
  },
];

// Configuration des filtres
export const FILTERS = [
  {
    id: 'period',
    label: 'Choisir la Période',
    value: '17 Sep 2025 - 26 Nov 2025',
    icon: (
      <svg className="w-[30px] h-[30px] text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H9V12H7V10ZM11 10H13V12H11V10ZM15 10H17V12H15V10ZM7 14H9V16H7V14ZM11 14H13V16H11V14ZM15 14H17V16H15V14Z" />
      </svg>
    ),
  },
  {
    id: 'marketplace',
    label: 'Choisir la Marketplace',
    value: '',
    icon: (
      <svg className="w-[30px] h-[30px] text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12 6C9.79 6 8 7.79 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 7.79 14.21 6 12 6ZM12 16C9.33 16 6.84 17.11 5 18.86C6.17 19.73 7.53 20.2 9 20.2C9 19.13 9 18.07 9.5 17.07C10.17 15.73 11.5 15 13 15C14.5 15 15.83 15.73 16.5 17.07C17 18.07 17 19.13 17 20.2C18.47 20.2 19.83 19.73 21 18.86C19.16 17.11 16.67 16 14 16H12Z" />
      </svg>
    ),
  },
  {
    id: 'country',
    label: 'Choisir le Pays',
    value: '',
    icon: (
      <svg className="w-[30px] h-[30px] text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" />
        <path d="M12 6C9.79 6 8 7.79 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 7.79 14.21 6 12 6ZM12 16C9.33 16 6.84 17.11 5 18.86C6.17 19.73 7.53 20.2 9 20.2C9 19.13 9 18.07 9.5 17.07C10.17 15.73 11.5 15 13 15C14.5 15 15.83 15.73 16.5 17.07C17 18.07 17 19.13 17 20.2C18.47 20.2 19.83 19.73 21 18.86C19.16 17.11 16.67 16 14 16H12Z" />
      </svg>
    ),
  },
];

// Configuration des KPI Cards
export const KPI_CARDS = [
  {
    id: 'commandes',
    title: 'Commandes',
    value: '145',
    description: '(70 jours)',
    icon: (
      <svg className="w-[60px] h-[60px] text-[#1D1D1D]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 6H16L14 4H10L8 6H4C2.9 6 2 6.9 2 8V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V8C22 6.9 21.1 6 20 6ZM20 19H4V8H6.83L8.83 6H15.17L17.17 8H20V19ZM12 9C9.24 9 7 11.24 7 14C7 16.76 9.24 19 12 19C14.76 19 17 16.76 17 14C17 11.24 14.76 9 12 9ZM12 17C10.35 17 9 15.65 9 14C9 12.35 10.35 11 12 11C13.65 11 15 12.35 15 14C15 15.65 13.65 17 12 17Z" />
      </svg>
    ),
  },
  {
    id: 'livraisons',
    title: 'Livraisons',
    value: '143',
    description: '(70 jours)',
    icon: (
      <svg className="w-[60px] h-[60px] text-[#1D1D1D]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 8H17V4H7V8H4C2.9 8 2 8.9 2 10V20C2 21.1 2.9 22 4 22H20C21.1 22 22 21.1 22 20V10C22 8.9 21.1 8 20 8ZM9 6H15V8H9V6ZM20 20H4V10H20V20Z" />
      </svg>
    ),
  },
  {
    id: 'chiffre-affaires',
    title: "Chiffre d'affaires",
    value: '35 456 $',
    description: '(70 jours)',
    icon: (
      <svg className="w-[60px] h-[60px] text-[#1D1D1D]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.8 10.9C9.53 10.31 8.8 9.7 8.8 8.75C8.8 7.66 9.81 6.9 11.5 6.9C13.28 6.9 13.94 7.75 14 9H16.21C16.14 7.28 15.09 5.7 13 5.19V3H10V5.16C8.06 5.58 6.5 6.84 6.5 8.77C6.5 10.73 8.09 12.17 10.9 12.8C13.36 13.33 13.9 14.1 13.9 15.05C13.9 16.08 12.96 16.9 11.2 16.9C9.12 16.9 8.36 15.9 8.28 14.7H6C6.08 16.53 7.36 18.1 9.5 18.58V21H12.5V18.84C14.54 18.5 16 17.35 16 15.5C16 13.55 14.4 12.1 11.8 11.5V10.9H11.8Z" />
      </svg>
    ),
  },
  {
    id: 'marge-nette',
    title: 'Marge Nette',
    value: '15 222 $',
    description: '(70 jours)',
    icon: (
      <svg className="w-[60px] h-[60px] text-[#1D1D1D]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.8 10.9C9.53 10.31 8.8 9.7 8.8 8.75C8.8 7.66 9.81 6.9 11.5 6.9C13.28 6.9 13.94 7.75 14 9H16.21C16.14 7.28 15.09 5.7 13 5.19V3H10V5.16C8.06 5.58 6.5 6.84 6.5 8.77C6.5 10.73 8.09 12.17 10.9 12.8C13.36 13.33 13.9 14.1 13.9 15.05C13.9 16.08 12.96 16.9 11.2 16.9C9.12 16.9 8.36 15.9 8.28 14.7H6C6.08 16.53 7.36 18.1 9.5 18.58V21H12.5V18.84C14.54 18.5 16 17.35 16 15.5C16 13.55 14.4 12.1 11.8 11.5V10.9H11.8Z" />
      </svg>
    ),
    isBold: true,
  },
  {
    id: 'valeur-stock',
    title: 'Valeur du Stock',
    value: '123 456 $',
    description: '(prix de vente)',
    icon: (
      <svg className="w-[60px] h-[60px] text-[#1D1D1D]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 6H4C2.89 6 2.01 6.89 2.01 8L2 19C2 20.11 2.89 21 4 21H20C21.11 21 22 20.11 22 19V8C22 6.89 21.11 6 20 6ZM20 19H4V13H20V19ZM20 10H4V8H20V10Z" />
      </svg>
    ),
  },
];

// Configuration des containers graphiques
export const GRAPH_CONTAINERS = [
  { id: 'graph-1', width: 1163, height: 320, left: 0, top: 10 },
  { id: 'graph-2', width: 974, height: 320, left: 1201, top: 10 },
  { id: 'graph-3', width: 700, height: 320, left: 0, top: 350 },
  { id: 'graph-4', width: 700, height: 320, left: 737, top: 350 },
  { id: 'graph-5', width: 700, height: 320, left: 1475, top: 350 },
];

// Positions des filtres
export const FILTER_POSITIONS = [
  { left: 0 },
  { left: 386 },
  { left: 767 },
];

// Positions des KPI cards
export const KPI_POSITIONS = [
  { left: 13 },
  { left: 469 },
  { left: 920 },
  { left: 1376 },
  { left: 1827 },
];

