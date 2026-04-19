
import { Routes, Route } from 'react-router-dom'; // Module 7 slide 53
import HomePage     from '../pages/HomePage';
import MoodPage     from '../pages/MoodPage';
import GoalsPage    from '../pages/GoalsPage';
import HistoryPage  from '../pages/HistoryPage';
import PageNotFound from '../pages/PageNotFound';

function AppRoutes() {
  return (
    <Routes>
      {/* index = matches the root URL "/" exactly (Module 7 slide 53) */}
      <Route index         element={<HomePage />} />

      {/* Standard named routes */}
      <Route path="/mood"    element={<MoodPage />} />
      <Route path="/goals"   element={<GoalsPage />} />
      <Route path="/history" element={<HistoryPage />} />

      {/* Catch-all — path="*" means "nothing above matched" (Module 7 slide 53) */}
      <Route path="*"        element={<PageNotFound />} />
    </Routes>
  );
}

export default AppRoutes;