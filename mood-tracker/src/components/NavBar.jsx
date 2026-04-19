// src/components/NavBar.jsx
import { NavLink } from 'react-router-dom';          // Module 7 slide 58
import { useThemeContext } from '../context/ThemeContext';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

function NavBar() {
  // Pull darkMode and toggleTheme from our ThemeContext
  // Any component can do this — that's the power of context
  const { darkMode, toggleTheme } = useThemeContext();

  // Shared style for NavLink items
  // The 'active' class is added automatically by NavLink (Module 7 slide 58)
  const linkStyle = ({ isActive }) => ({
    color: 'white',
    textDecoration: 'none',
    fontWeight: isActive ? 'bold' : 'normal',
    borderBottom: isActive ? '2px solid white' : '2px solid transparent',
    padding: '4px 8px',
  });

  return (
    // MUI AppBar replaces a plain <nav> — gives us elevation + color for free
    <AppBar position="sticky">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>

        {/* App name on the left */}
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 1 }}>
          MoodTracker
        </Typography>

        {/* Nav links in the center */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <NavLink to="/"        style={linkStyle}>Home</NavLink>
          <NavLink to="/mood"    style={linkStyle}>Log Mood</NavLink>
          <NavLink to="/goals"   style={linkStyle}>Goals</NavLink>
          <NavLink to="/history" style={linkStyle}>History</NavLink>
        </div>

        {/* Dark mode toggle on the right */}
        <Button
          variant="outlined"
          size="small"
          onClick={toggleTheme}
          sx={{ color: 'white', borderColor: 'white' }}
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </Button>

      </Toolbar>
    </AppBar>
  );
}

export default NavBar;