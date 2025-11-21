/**
 * Utilitaires pour le formatage et la manipulation des dates
 */

/**
 * Formate une date au format API (YYYY-MM-DD)
 */
export const formatDateForAPI = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Formate une date pour l'affichage (ex: "17 Sep 2025")
 */
export const formatDateForDisplay = (date: Date, months: string[]): string => {
  const day = date.getDate();
  const month = months[date.getMonth()].substring(0, 3);
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

/**
 * Calcule le nombre de jours entre deux dates (inclusif)
 */
export const calculateDaysBetween = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 pour inclure les deux jours
};

/**
 * Formate le nombre de jours pour l'affichage (ex: "(2 jours)")
 */
export const formatDaysText = (daysCount: number): string => {
  if (daysCount <= 0) return '';
  const dayWord = daysCount === 1 ? 'jour' : 'jours';
  return `(${daysCount} ${dayWord})`;
};

/**
 * Constantes pour les mois en français
 */
export const FRENCH_MONTHS = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];

/**
 * Constantes pour les jours de la semaine en français
 */
export const FRENCH_DAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

