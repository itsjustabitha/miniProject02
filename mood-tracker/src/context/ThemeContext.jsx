// src/context/ThemeContext.jsx
import React, { createContext, useState, useContext } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// the context (Module 7 slide 43 pattern)
export const ThemeContext = createContext();

//  MUI themes 
// CssBaseline is MUI's version of a CSS reset — keeps spacing consistent
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#7C3AED' },   // Purple — wellness/calm vibe
    secondary: { main: '#06B6D4' }, // Teal — accent
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#A78BFA' },   // Lighter purple for dark bg
    secondary: { main: '#22D3EE' },
  },
});

// This lets us share darkMode and toggleTheme via context,
// while MUI handles the actual visual theming automatically.
export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(prev => !prev); // flip between true/false
  };

  // Pick the right MUI theme object based on current mode
  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {/* MuiThemeProvider applies the MUI theme to all children */}
      <MuiThemeProvider theme={theme}>
        {/* CssBaseline normalizes browser default styles */}
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

// Custom hook (Module 7 slide 37 pattern)
export const useThemeContext = () => {
  return useContext(ThemeContext);
};