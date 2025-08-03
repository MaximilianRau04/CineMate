import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/App.css';

import Header from './components/navigation/Header';
import Login from './components/login/Login';
import ExplorePage from './components/explore/ExplorePage';
import MovieDetail from './components/details/MovieDetail';
import SeriesDetail from './components/details/SeriesDetail';
import Watchlist from './components/profile/Watchlist';
import UserProfile from './components/profile/UserProfile';
import UserStatistics from './components/statistics/UserStatistics';
import Calendar from './components/explore/calender/Calendar';
import AdminPanel from './components/admin/AdminPanel';
import RecommendationsPage from './components/recommendations/RecommendationsPage';
import FriendsPage from './components/social/FriendsPage';
import Leaderboard from './components/social/Leaderboard';
import FriendProfile from './components/social/FriendProfile';
import ForumHome from './components/forum/ForumHome';
import ForumPostDetail from './components/forum/ForumPostDetail';
import CreateForumPost from './components/forum/CreateForumPost';
import AchievementsPage from './components/achievements/AchievementsPage';
import CustomListsPage from './components/lists/CustomListsPage';
import ListDetailView from './components/lists/ListDetailView';
import { ToastProvider, ToastContainer } from './components/toasts';
import { AuthProvider } from './utils/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';

import { useAuth } from './utils/AuthContext';

const AppContent = () => {
  const location = useLocation();
  const hideHeader = location.pathname === '/';
  const { user } = useAuth();

  return (
    <>
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />

        {/* protected routes */}
        <Route path="/explore" element={
          <ProtectedRoute>
            <ExplorePage />
          </ProtectedRoute>
        } />
        <Route path="/movies/:id" element={
          <ProtectedRoute>
            <MovieDetail />
          </ProtectedRoute>
        } />
        <Route path="/series/:id" element={
          <ProtectedRoute>
            <SeriesDetail />
          </ProtectedRoute>
        } />
        <Route path="/watchlist" element={
          <ProtectedRoute>
            <Watchlist />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } />
        <Route path="/statistics" element={
          <ProtectedRoute>
            <UserStatistics userId={user?.id} />
          </ProtectedRoute>
        } />
        <Route path="/achievements" element={
          <ProtectedRoute>
            <AchievementsPage userId={user?.id} />
          </ProtectedRoute>
        } />
        <Route path="/calendar" element={
          <ProtectedRoute>
            <Calendar />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        } />
        <Route path="/recommendations" element={
          <ProtectedRoute>
            <RecommendationsPage />
          </ProtectedRoute>
        } />
        
        {/* Social routes */}
        <Route path="/friends" element={
          <ProtectedRoute>
            <FriendsPage />
          </ProtectedRoute>
        } />
        <Route path="/leaderboard" element={
          <ProtectedRoute>
            <Leaderboard />
          </ProtectedRoute>
        } />
        <Route path="/profile/:userId" element={
          <ProtectedRoute>
            <FriendProfile />
          </ProtectedRoute>
        } />

        {/* Forum routes */}
        <Route path="/forum" element={
          <ProtectedRoute>
            <ForumHome />
          </ProtectedRoute>
        } />
        <Route path="/forum/post/:postId" element={
          <ProtectedRoute>
            <ForumPostDetail />
          </ProtectedRoute>
        } />
        <Route path="/forum/create-post" element={
          <ProtectedRoute>
            <CreateForumPost />
          </ProtectedRoute>
        } />

        {/* Custom Lists routes */}
        <Route path="/lists" element={
          <ProtectedRoute>
            <CustomListsPage />
          </ProtectedRoute>
        } />
        <Route path="/lists/:listId" element={
          <ProtectedRoute>
            <ListDetailView />
          </ProtectedRoute>
        } />

        <Route path="*" element={<h2 className="text-center mt-5">Seite nicht gefunden</h2>} />

      </Routes>
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <AppContent />
          <ToastContainer />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
