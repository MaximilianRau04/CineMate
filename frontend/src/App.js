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
import Calendar from './components/explore/calender/Calendar';
import AdminPanel from './components/admin/AdminPanel';
import RecommendationsPage from './components/recommendations/RecommendationsPage';
import FriendsPage from './components/social/FriendsPage';
import Leaderboard from './components/social/Leaderboard';
import FriendProfile from './components/social/FriendProfile';
import ForumHome from './components/forum/ForumHome';
import ForumPostDetail from './components/forum/ForumPostDetail';
import CreateForumPost from './components/forum/CreateForumPost';
import { ToastProvider, ToastContainer } from './components/toasts';

const AppContent = () => {
  const location = useLocation();
  const hideHeader = location.pathname === '/';

  return (
    <>
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Login />} />

        {/* protected routes */}
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path="/series/:id" element={<SeriesDetail />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
        
        {/* Social routes */}
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile/:userId" element={<FriendProfile />} />

        {/* Forum routes */}
        <Route path="/forum" element={<ForumHome />} />
        <Route path="/forum/post/:postId" element={<ForumPostDetail />} />
        <Route path="/forum/create-post" element={<CreateForumPost />} />

        <Route path="*" element={<h2 className="text-center mt-5">Seite nicht gefunden</h2>} />

      </Routes>
    </>
  );
};

const App = () => {
  return (
    <ToastProvider>
      <Router>
        <AppContent />
        <ToastContainer />
      </Router>
    </ToastProvider>
  );
};

export default App;
