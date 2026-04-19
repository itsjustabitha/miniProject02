import { createContext, useState, useEffect, useContext } from 'react';

// Create the context
const MoodContext = createContext();

// The localStorage key stored as a constant — DRY principle
const STORAGE_KEY = 'moodtracker_entries';

// Build the Provider
export function MoodProvider({ children }) {

  // Initialize state from localStorage if entries exist.
  // WHY the function form of useState: the () => {...} callback only runs ONCE
  // on mount — not on every re-render. Without it, JSON.parse would run every render.
  const [entries, setEntries] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      // If something is stored, parse it. Otherwise start with empty array.
      return stored ? JSON.parse(stored) : [];
    } catch {
      // If localStorage is corrupted or unavailable, fail safely
      return [];
    }
  });

  // Sync entries to localStorage whenever entries changes.
  // Empty-ish dependency [entries] = runs on mount + every time entries updates.
  // This is the "external system synchronization" use case from Module 7 slide 6.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  // addEntry is the only way components should modify entries.
  // WHY: Centralizing mutation logic here means every component
  // adds entries the same way — no inconsistent data shapes.
  const addEntry = (newEntry) => {
    setEntries(prev => [
      {
        ...newEntry,
        // Generate a unique ID using timestamp — no external library needed
        id: Date.now(),
        // Store the date at submission time, not at form-open time
        date: new Date().toLocaleDateString('en-US', {
          weekday: 'short',
          year:    'numeric',
          month:   'short',
          day:     'numeric',
        }),
      },
      // Prepend new entry so History shows newest first
      ...prev,
    ]);
  };

  // deleteEntry lets HistoryPage remove an entry by its id
  const deleteEntry = (id) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  return (
    <MoodContext.Provider value={{ entries, addEntry, deleteEntry }}>
      {children}
    </MoodContext.Provider>
  );
}

// Custom hook — same pattern as UserContext and ThemeContext
export const useMoodContext = () => {
  return useContext(MoodContext);
};