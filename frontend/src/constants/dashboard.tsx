// Constantes pour le Dashboard
import {
  FaHome,
  FaChartBar,
  FaDollarSign,
  FaBox,
  FaBullhorn,
  FaNetworkWired,
  FaCalendarAlt,
  FaStore,
  FaGlobe,
  FaShoppingCart,
  FaTruck,
  FaWallet,
  FaChartLine,
  FaCalculator,
  FaPercent,
  FaTag,
  FaShoppingBasket,
  FaUndo,
  FaClock,
  FaUsers,
  FaCalendarDay,
  FaTrophy,
  FaReply,
  FaTags,
  FaVenusMars,
  FaCheckCircle,
  FaSpinner,
  FaEuroSign,
  FaCalendar,
  FaInstagram,
  FaTicketAlt,
  FaStar,
} from 'react-icons/fa';

// Configuration des éléments de menu
export const MENU_ITEMS = [
  {
    id: 'accueil' as const,
    label: 'Accueil',
    icon: <FaHome className="w-6 h-6" />,
  },
  {
    id: 'performances' as const,
    label: 'Performances',
    icon: <FaChartBar className="w-6 h-6" />,
  },
  {
    id: 'rentabilite' as const,
    label: 'Rentabilité',
    icon: <FaDollarSign className="w-6 h-6" />,
  },
  {
    id: 'stocks' as const,
    label: 'Stocks',
    icon: <FaBox className="w-6 h-6" />,
  },
  {
    id: 'marketing' as const,
    label: 'Marketing',
    icon: <FaBullhorn className="w-6 h-6" />,
  },
  {
    id: 'traffic' as const,
    label: 'Traffic',
    icon: <FaNetworkWired className="w-6 h-6" />,
  },
];

// Configuration des filtres
export const FILTERS = [
  {
    id: 'period',
    label: 'Choisir la Période',
    value: '17 Sep 2025 - 26 Nov 2025',
    icon: <FaCalendarAlt className="w-[30px] h-[30px] text-white" />,
  },
  {
    id: 'marketplace',
    label: 'Choisir la Marketplace',
    value: '',
    icon: <FaStore className="w-[30px] h-[30px] text-white" />,
  },
  {
    id: 'country',
    label: 'Choisir le Pays',
    value: '',
    icon: <FaGlobe className="w-[30px] h-[30px] text-white" />,
  },
  {
    id: 'category',
    label: 'Choisir la Catégorie',
    value: '',
    icon: <FaTags className="w-[30px] h-[30px] text-white" />,
  },
  {
    id: 'gender',
    label: 'Choisir le Genre',
    value: '',
    icon: <FaVenusMars className="w-[30px] h-[30px] text-white" />,
  },
];

// Options pour les filtres Catégorie et Genre
export const CATEGORY_OPTIONS = [
  'Pull',
  'Veste',
  'Manteau',
  'Gilet',
  'Pantalon',
  'Jogging',
  'T-Shirt',
  'Bonnet',
  'Maillot',
  'Polo',
];

export const GENDER_OPTIONS = [
  'Homme',
  'Femme',
  'Garçon',
  'Fille',
];

// Configuration des KPI Cards
export const KPI_CARDS = [
  {
    id: 'commandes',
    title: 'Commandes',
    value: '145',
    description: '(70 jours)',
    icon: <FaShoppingCart className="w-[60px] h-[60px] text-[#1D1D1D]" />,
  },
  {
    id: 'livraisons',
    title: 'Livraisons',
    value: '143',
    description: '(70 jours)',
    icon: <FaTruck className="w-[60px] h-[60px] text-[#1D1D1D]" />,
  },
  {
    id: 'chiffre-affaires',
    title: "Chiffre d'affaires",
    value: '35 456 $',
    description: '(70 jours)',
    icon: <FaDollarSign className="w-[60px] h-[60px] text-[#1D1D1D]" />,
  },
  {
    id: 'marge-nette',
    title: 'Marge Nette',
    value: '15 222 $',
    description: '(70 jours)',
    icon: <FaWallet className="w-[60px] h-[60px] text-[#1D1D1D]" />,
    isBold: true,
  },
  {
    id: 'valeur-stock',
    title: 'Valeur du Stock',
    value: '123 456 $',
    description: '(prix de vente)',
    icon: <FaBox className="w-[60px] h-[60px] text-[#1D1D1D]" />,
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
// Container de 1107px de largeur, 5 filtres de 340px chacun
// Espace disponible : 1107px - (5 * 340px) = 1107 - 1700 = -593px (trop serré)
// Solution : Réduire l'espacement entre les filtres
// Espacement : (1107 - 1700) / 4 = -148px (négatif, donc on doit réduire la largeur ou l'espacement)
// Alternative : Utiliser un espacement de 20px entre les filtres
// Position 1 : 0
// Position 2 : 340 + 20 = 360
// Position 3 : 360 + 340 + 20 = 720
// Position 4 : 720 + 340 + 20 = 1080 (déborde de 1107)
// Réduisons à 15px d'espacement
// Position 1 : 0
// Position 2 : 340 + 15 = 355
// Position 3 : 355 + 340 + 15 = 710
// Position 4 : 710 + 340 + 15 = 1065
// Position 5 : 1065 + 340 + 15 = 1420 (déborde encore)
// Réduisons la largeur des filtres à 320px avec 10px d'espacement
// Position 1 : 0
// Position 2 : 320 + 10 = 330
// Position 3 : 330 + 320 + 10 = 660
// Position 4 : 660 + 320 + 10 = 990
// Position 5 : 990 + 320 + 10 = 1320 (déborde)
// Utilisons 5 filtres de 210px avec 10px d'espacement
// Position 1 : 0
// Position 2 : 210 + 10 = 220
// Position 3 : 220 + 210 + 10 = 440
// Position 4 : 440 + 210 + 10 = 660
// Position 5 : 660 + 210 + 10 = 880 (rentre dans 1107px)
export const FILTER_POSITIONS = [
  { left: 0 },
  { left: 220 },
  { left: 440 },
  { left: 660 },
  { left: 880 },
];

// Positions des KPI cards
export const KPI_POSITIONS = [
  { left: 13 },
  { left: 469 },
  { left: 920 },
  { left: 1376 },
  { left: 1827 },
];

// Configuration des KPI Cards pour la page Rentabilité
export const RENTABILITE_KPI_CARDS = [
  {
    id: 'marge-brute-moyenne',
    title: 'Marge brute moyenne',
    value: '0 €',
    description: '(période sélectionnée)',
    icon: <FaChartLine className="w-[50px] h-[50px] text-[#1D1D1D]" />,
  },
  {
    id: 'marge-nette-moyenne',
    title: 'Marge nette moyenne',
    value: '0 €',
    description: '(période sélectionnée)',
    icon: <FaWallet className="w-[50px] h-[50px] text-[#1D1D1D]" />,
    isBold: true,
  },
  {
    id: 'coefficient-marge-moyen',
    title: 'Coefficient de marge moyen',
    value: '0',
    description: '(période sélectionnée)',
    icon: <FaCalculator className="w-[50px] h-[50px] text-[#1D1D1D]" />,
  },
  {
    id: 'taux-marge-moyen',
    title: 'Taux de marge moyen',
    value: '0 %',
    description: '(période sélectionnée)',
    icon: <FaPercent className="w-[50px] h-[50px] text-[#1D1D1D]" />,
  },
  {
    id: 'taux-marque-moyen',
    title: 'Taux de marque moyen',
    value: '0 %',
    description: '(période sélectionnée)',
    icon: <FaTag className="w-[50px] h-[50px] text-[#1D1D1D]" />,
  },
];

// Configuration des containers graphiques pour la page Rentabilité
export const RENTABILITE_GRAPH_CONTAINERS = [
  { id: 'rentabilite-graph-1', width: 1163, height: 320, left: 0, top: 10 },
  { id: 'rentabilite-graph-2', width: 974, height: 320, left: 1201, top: 10 },
  { id: 'rentabilite-graph-3', width: 700, height: 320, left: 0, top: 350 },
  { id: 'rentabilite-graph-4', width: 700, height: 320, left: 737, top: 350 },
  { id: 'rentabilite-graph-5', width: 700, height: 320, left: 1475, top: 350 },
];

// Configuration des KPI Cards pour la page Traffic
export const TRAFFIC_KPI_CARDS = [
  {
    id: 'taux-abandon-panier-moyen',
    title: 'Taux d\'abandon de panier moyen',
    value: '0 %',
    description: '(période sélectionnée)',
    icon: <FaShoppingBasket className="w-[50px] h-[50px] text-[#1D1D1D]" />,
  },
  {
    id: 'taux-rebond-moyen',
    title: 'Taux de rebond moyen',
    value: '0 %',
    description: '(période sélectionnée)',
    icon: <FaUndo className="w-[50px] h-[50px] text-[#1D1D1D]" />,
  },
  {
    id: 'duree-visite-moyenne',
    title: 'Durée moyenne d\'une visite',
    value: '0 min',
    description: '(période sélectionnée)',
    icon: <FaClock className="w-[50px] h-[50px] text-[#1D1D1D]" />,
  },
  {
    id: 'visites-uniques-moyennes',
    title: 'Nombre de visite unique moyen',
    value: '0',
    description: '(période sélectionnée)',
    icon: <FaUsers className="w-[50px] h-[50px] text-[#1D1D1D]" />,
  },
  {
    id: 'taux-conversion-moyen',
    title: 'Taux de conversion moyen',
    value: '0 %',
    description: '(période sélectionnée)',
    icon: <FaChartLine className="w-[50px] h-[50px] text-[#1D1D1D]" />,
    isBold: true,
  },
];

// Configuration des containers graphiques pour la page Traffic
export const TRAFFIC_GRAPH_CONTAINERS = [
  { id: 'traffic-graph-1', width: 1163, height: 320, left: 0, top: 10 },
  { id: 'traffic-graph-2', width: 974, height: 320, left: 1201, top: 10 },
  { id: 'traffic-graph-3', width: 700, height: 320, left: 0, top: 350 },
  { id: 'traffic-graph-4', width: 700, height: 320, left: 737, top: 350 },
  { id: 'traffic-graph-5', width: 700, height: 320, left: 1475, top: 350 },
];

// Configuration des KPI Cards pour la page Performances
export const PERFORMANCES_KPI_CARDS = [
  {
    id: 'jour-plus-commandes',
    title: 'Jour de la semaine avec le plus de commandes',
    value: '-',
    description: '(période sélectionnée)',
    icon: <FaCalendarDay className="w-[50px] h-[50px] text-[#1D1D1D]" />,
  },
  {
    id: 'heure-plus-commandes',
    title: 'Heure de la journée avec le plus de commandes',
    value: '-',
    description: '(période sélectionnée)',
    icon: <FaClock className="w-[50px] h-[50px] text-[#1D1D1D]" />,
  },
  {
    id: 'produit-plus-distribue',
    title: 'Produit le plus distribué',
    value: '-',
    description: '(période sélectionnée)',
    icon: <FaBox className="w-[50px] h-[50px] text-[#1D1D1D]" />,
  },
  {
    id: 'taux-retour',
    title: 'Taux de retour',
    value: '0 %',
    description: '(période sélectionnée)',
    icon: <FaReply className="w-[50px] h-[50px] text-[#1D1D1D]" />,
  },
  {
    id: 'meilleure-categorie',
    title: 'Meilleure performance par catégorie',
    value: '-',
    description: '(période sélectionnée)',
    icon: <FaTrophy className="w-[50px] h-[50px] text-[#1D1D1D]" />,
    isBold: true,
  },
];

// Configuration des containers graphiques pour la page Performances
export const PERFORMANCES_GRAPH_CONTAINERS = [
  { id: 'performances-graph-1', width: 1163, height: 320, left: 0, top: 10 },
  { id: 'performances-graph-2', width: 974, height: 320, left: 1201, top: 10 },
  { id: 'performances-graph-3', width: 700, height: 320, left: 0, top: 350 },
  { id: 'performances-graph-4', width: 700, height: 320, left: 737, top: 350 },
  { id: 'performances-graph-5', width: 700, height: 320, left: 1475, top: 350 },
];

// Configuration des KPI Cards pour la page Stocks
export const STOCKS_KPI_CARDS = [
  {
    id: 'stocks-en-ligne',
    title: 'Stocks actuellement en ligne',
    value: '0',
    description: '(annonce validée + description + photo + prix)',
    icon: <FaCheckCircle className="w-[50px] h-[50px] text-[#1D1D1D]" />,
  },
  {
    id: 'stocks-en-cours',
    title: 'Stocks en cours de mise en ligne',
    value: '0',
    description: '(brouillon, sans photos, sans prix)',
    icon: <FaSpinner className="w-[50px] h-[50px] text-[#1D1D1D]" />,
  },
  {
    id: 'prix-achat-moyen',
    title: 'Prix d\'achat moyen',
    value: '0 €',
    description: '(articles en ligne)',
    icon: <FaEuroSign className="w-[50px] h-[50px] text-[#1D1D1D]" />,
  },
  {
    id: 'jours-stock-moyen',
    title: 'Nombre de jours de stock moyen',
    value: '0',
    description: '(âge moyen des articles)',
    icon: <FaCalendar className="w-[50px] h-[50px] text-[#1D1D1D]" />,
  },
];

// Configuration des containers graphiques pour la page Stocks
export const STOCKS_GRAPH_CONTAINERS = [
  { id: 'stocks-graph-1', width: 1163, height: 320, left: 0, top: 10 },
  { id: 'stocks-graph-2', width: 974, height: 320, left: 1201, top: 10 },
  { id: 'stocks-graph-3', width: 1080, height: 320, left: 0, top: 350 },
  { id: 'stocks-graph-4', width: 1080, height: 320, left: 1120, top: 350 },
];

// Configuration des KPI Cards pour la page Marketing
export const MARKETING_KPI_CARDS = [
  {
    id: 'instagram-abonnes-actuel',
    title: 'Nombre d\'abonnés Instagram actuel',
    value: '0',
    description: '(mois actuel)',
    icon: <FaInstagram className="w-[50px] h-[50px] text-[#1D1D1D]" />,
  },
  {
    id: 'tiktok-abonnes-actuel',
    title: 'Nombre d\'abonnés TikTok actuel',
    value: '0',
    description: '(mois actuel)',
    icon: <FaUsers className="w-[50px] h-[50px] text-[#1D1D1D]" />,
  },
  {
    id: 'codes-promo-total',
    title: 'Nombre de codes promo utilisé',
    value: '0',
    description: '(période sélectionnée)',
    icon: <FaTicketAlt className="w-[50px] h-[50px] text-[#1D1D1D]" />,
  },
  {
    id: 'code-promo-plus-utilise',
    title: 'Code promo le plus utilisé',
    value: '-',
    description: '(période sélectionnée)',
    icon: <FaStar className="w-[50px] h-[50px] text-[#1D1D1D]" />,
    isBold: true,
  },
];

// Configuration des containers graphiques pour la page Marketing
export const MARKETING_GRAPH_CONTAINERS = [
  { id: 'marketing-graph-1', width: 1080, height: 320, left: 0, top: 10 },
  { id: 'marketing-graph-2', width: 1080, height: 320, left: 1120, top: 10 },
  { id: 'marketing-graph-3', width: 1080, height: 320, left: 0, top: 350 },
  { id: 'marketing-graph-4', width: 1080, height: 320, left: 1120, top: 350 },
];

