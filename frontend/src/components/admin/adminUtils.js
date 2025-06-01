import {
  FaUsers, FaFilm, FaTv, FaComments, FaChartBar,
  FaTrash, FaPlus, FaEdit, FaPlayCircle, FaArrowLeft
} from "react-icons/fa";

// Genre-Optionen für Content
export const GENRES = [
  "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary",
  "Drama", "Family", "Fantasy", "History", "Horror", "Music", "Mystery",
  "Romance", "Science Fiction", "Thriller", "War", "Western"
];

// Navigation Items für das Admin Panel
export const NAVIGATION_ITEMS = [
  { key: 'dashboard', icon: FaChartBar, label: 'Dashboard' },
  { key: 'content', icon: FaFilm, label: 'Content Management' },
  { key: 'users', icon: FaUsers, label: 'Benutzerverwaltung' },
  { key: 'moderation', icon: FaComments, label: 'Moderation' }
];

// Dashboard Card Konfigurationen
export const DASHBOARD_CARDS = [
  { 
    title: "Benutzer gesamt", 
    dataKey: "users", 
    color: "primary", 
    icon: FaUsers 
  },
  { 
    title: "Filme gesamt", 
    dataKey: "movies", 
    color: "success", 
    icon: FaFilm 
  },
  { 
    title: "Serien gesamt", 
    dataKey: "series", 
    color: "info", 
    icon: FaTv 
  },
  { 
    title: "Bewertungen gesamt", 
    dataKey: "reviews", 
    color: "warning", 
    icon: FaComments 
  }
];

// View Modi für Content Management
export const VIEW_MODES = {
  CONTENT: 'content',
  SEASONS: 'seasons',
  EPISODES: 'episodes'
};

// Modal Namen
export const MODAL_NAMES = {
  ADD_CONTENT: 'add',
  EDIT_CONTENT: 'edit',
  ADD_SEASON: 'addSeason',
  EDIT_SEASON: 'editSeason',
  ADD_EPISODE: 'addEpisode',
  EDIT_EPISODE: 'editEpisode'
};

// Form Namen
export const FORM_NAMES = {
  NEW_CONTENT: 'newContent',
  EDITING_CONTENT: 'editingContent',
  SELECTED_SERIES: 'selectedSeries',
  SELECTED_SEASON: 'selectedSeason',
  NEW_SEASON: 'newSeason',
  EDITING_SEASON: 'editingSeason',
  NEW_EPISODE: 'newEpisode',
  EDITING_EPISODE: 'editingEpisode'
};

// Utility Functions
export const formatDate = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(parseInt(timestamp));
  return date.toLocaleDateString('de-DE');
};

export const formatDateForInput = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(parseInt(timestamp));
  return date.toISOString().split('T')[0];
};

// Icons Export für einfachen Import
export const ICONS = {
  FaUsers,
  FaFilm,
  FaTv,
  FaComments,
  FaChartBar,
  FaTrash,
  FaPlus,
  FaEdit,
  FaPlayCircle,
  FaArrowLeft
};