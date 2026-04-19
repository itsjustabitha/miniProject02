// OLD PLACE HOLDER CODE
// function GoalsPage() {
//   return <h1>Goals Page — Manage your goals here</h1>;
// }

// export default GoalsPage;

import { useState, useEffect, useReducer } from 'react';

// MUI imports
import Box               from '@mui/material/Box';
import Card              from '@mui/material/Card';
import CardContent       from '@mui/material/CardContent';
import Typography        from '@mui/material/Typography';
import TextField         from '@mui/material/TextField';
import Button            from '@mui/material/Button';
import List              from '@mui/material/List';
import ListItem          from '@mui/material/ListItem';
import ListItemText      from '@mui/material/ListItemText';
import ListItemIcon      from '@mui/material/ListItemIcon';
import Checkbox          from '@mui/material/Checkbox';
import IconButton        from '@mui/material/IconButton';
import Chip              from '@mui/material/Chip';
import Alert             from '@mui/material/Alert';
import Divider           from '@mui/material/Divider';
import LinearProgress    from '@mui/material/LinearProgress';

// localStorage key — same DRY pattern as MoodContext
const GOALS_STORAGE_KEY = 'moodtracker_goals';

// ---------------------------------------------------------------------------
// REDUCER FUNCTION
// Defined OUTSIDE the component — Module 7 slide 22's exact pattern.
// WHY outside: the reducer is a pure function. It needs no access to component
// state or props. Keeping it outside makes this explicit and prevents
// accidental re-creation on every render.
//
// A pure function: given the same state + action, ALWAYS returns the same result.
// It never mutates the original state — it always returns a NEW array.
// ---------------------------------------------------------------------------
const goalsReducer = (state, action) => {
  switch (action.type) {

    case 'ADD_GOAL':
      // Return a new array with the new goal prepended.
      // Spread operator clones original — state is immutable (Module 6 slide 69).
      // id uses Date.now() — same reliable pattern as MoodContext.
      return [
        {
          id:        Date.now(),
          text:      action.payload.text,
          completed: false,           // every new goal starts incomplete
          createdAt: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day:   'numeric',
            year:  'numeric',
          }),
        },
        ...state,
      ];

    case 'TOGGLE_GOAL':
      // Map over every goal. Find the matching id and flip its completed value.
      // All others pass through unchanged.
      // WHY map: it returns a NEW array without mutating the original (Module 6 slide 70).
      return state.map(goal =>
        goal.id === action.payload.id
          ? { ...goal, completed: !goal.completed }
          : goal
      );

    case 'DELETE_GOAL':
      // Filter returns a new array excluding the goal with the matching id.
      // Module 6 slide 70: "filter and map don't mutate the original."
      return state.filter(goal => goal.id !== action.payload.id);

    case 'LOAD_GOALS':
      // Special action for restoring goals from localStorage on mount.
      // WHY a dedicated action: keeps the reducer as the single place
      // that controls state shape — nothing sets state directly.
      return action.payload;

    default:
      // Always return current state for unknown actions — never return undefined.
      return state;
  }
};

// ---------------------------------------------------------------------------
// HELPER — reads goals from localStorage safely
// Extracted as a function so the useReducer initializer and the
// useEffect both use the same logic. DRY principle.
// ---------------------------------------------------------------------------
const loadGoalsFromStorage = () => {
  try {
    const stored = localStorage.getItem(GOALS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// ---------------------------------------------------------------------------
// GOALS PAGE COMPONENT
// ---------------------------------------------------------------------------
function GoalsPage() {

  // useReducer takes two arguments (Module 7 slide 22):
  // 1. The reducer function — goalsReducer defined above
  // 2. The initial state — we load from localStorage immediately
  //
  // Returns two things (just like useState):
  // 1. goals — the current state array
  // 2. dispatch — the function we call to trigger state changes
  const [goals, dispatch] = useReducer(goalsReducer, loadGoalsFromStorage());

  // useState for the controlled text input only.
  // WHY separate from useReducer: the input field is local, temporary UI state.
  // It is not part of the goals data — it gets cleared after each submission.
  // Module 7 slide 21: "useState is simpler for basic, independent, isolated variables."
  const [inputText, setInputText]       = useState('');
  const [validationError, setValidationError] = useState('');

  // Sync goals array to localStorage whenever it changes.
  // Same pattern as MoodContext — external system synchronization (Module 7 slide 6).
  useEffect(() => {
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
  }, [goals]);

  // ---------------------------------------------------------------------------
  // DERIVED VALUES
  // These are calculated FROM state — not stored IN state.
  // Module 6 slide 62: "Avoid redundant state that can be calculated from other values."
  // ---------------------------------------------------------------------------
  const totalGoals     = goals.length;
  const completedGoals = goals.filter(g => g.completed).length;
  // Avoid division by zero when goals array is empty
  const progressPct    = totalGoals > 0
    ? Math.round((completedGoals / totalGoals) * 100)
    : 0;

  // ---------------------------------------------------------------------------
  // EVENT HANDLERS
  // Each one dispatches a specific action type — this is the ONLY way
  // we modify goals state. No setGoals anywhere in this component.
  // ---------------------------------------------------------------------------

  const handleAddGoal = () => {
    if (inputText.trim().length < 3) {
      setValidationError('Goal must be at least 3 characters.');
      return;
    }
    setValidationError('');

    // Dispatch ADD_GOAL with the input text as the payload.
    // The reducer handles building the full goal object.
    dispatch({
      type:    'ADD_GOAL',
      payload: { text: inputText.trim() },
    });

    // Clear the input field after dispatching — local UI state only
    setInputText('');
  };

  const handleToggleGoal = (id) => {
    // Dispatch TOGGLE_GOAL with just the id.
    // The reducer knows to flip completed on the matching goal.
    dispatch({
      type:    'TOGGLE_GOAL',
      payload: { id },
    });
  };

  const handleDeleteGoal = (id) => {
    dispatch({
      type:    'DELETE_GOAL',
      payload: { id },
    });
  };

  // Allow submitting the form with the Enter key — better UX
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAddGoal();
  };

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  return (
    <Box className="container" sx={{ maxWidth: 650, mx: 'auto', mt: 4 }}>

      {/* Page header */}
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
        My Goals
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Small, consistent steps. Track what matters to you.
      </Typography>

      {/* PROGRESS SECTION — only renders when there are goals */}
      {totalGoals > 0 && (
        <Card elevation={2} sx={{ borderRadius: 3, mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Overall Progress
              </Typography>
              <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700 }}>
                {completedGoals} / {totalGoals} complete
              </Typography>
            </Box>
            {/*
              value is derived — not stored in state.
              If we stored progressPct in state we'd violate Module 6 slide 62:
              "Avoid redundant state that can be calculated from other values."
            */}
            <LinearProgress
              variant="determinate"
              value={progressPct}
              sx={{ height: 10, borderRadius: 5 }}
              color={progressPct === 100 ? 'success' : 'primary'}
            />
            {progressPct === 100 && (
              <Alert severity="success" sx={{ mt: 2 }}>
                All goals complete — outstanding work!
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* ADD GOAL FORM */}
      <Card elevation={3} sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Add a New Goal
          </Typography>

          {validationError && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {validationError}
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <TextField
              label="What do you want to achieve?"
              placeholder="e.g. Read for 20 minutes every day"
              fullWidth
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              size="small"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddGoal}
              sx={{ borderRadius: 2, px: 3, py: 1, whiteSpace: 'nowrap' }}
            >
              Add Goal
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* GOALS LIST */}
      {goals.length === 0 ? (
        // Empty state — same pattern as HistoryPage
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Typography variant="h2" sx={{ fontSize: '3.5rem' }}>🎯</Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
            No goals yet.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add your first goal above to get started.
          </Typography>
        </Box>
      ) : (
        <Card elevation={2} sx={{ borderRadius: 3 }}>
          <List disablePadding>
            {/*
              .map() iterates the goals array.
              key={goal.id} satisfies Module 6 slide 44's key requirement.
              Each goal renders a ListItem with a Checkbox and delete button.
            */}
            {goals.map((goal, index) => (
              <Box key={goal.id}>
                <ListItem
                  sx={{
                    px: 2,
                    py: 1.5,
                    // Strike-through completed goals — visual feedback without
                    // needing a separate "status" field in state
                    opacity: goal.completed ? 0.6 : 1,
                    transition: 'opacity 0.2s ease',
                  }}
                  secondaryAction={
                    // Delete button aligned to the right via secondaryAction prop
                    <IconButton
                      edge="end"
                      aria-label="delete goal"
                      onClick={() => handleDeleteGoal(goal.id)}
                      color="error"
                      size="small"
                    >
                      ✕
                    </IconButton>
                  }
                >
                  <ListItemIcon sx={{ minWidth: 44 }}>
                    {/*
                      Checkbox is the primary interactive element on this page.
                      checked is controlled by goal.completed from state.
                      onChange dispatches TOGGLE_GOAL — never mutates goal directly.
                    */}
                    <Checkbox
                      checked={goal.completed}
                      onChange={() => handleToggleGoal(goal.id)}
                      color="primary"
                    />
                  </ListItemIcon>

                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        sx={{
                          textDecoration: goal.completed ? 'line-through' : 'none',
                          fontWeight: goal.completed ? 400 : 500,
                        }}
                      >
                        {goal.text}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          Added {goal.createdAt}
                        </Typography>
                        {goal.completed && (
                          <Chip label="Done" size="small" color="success" sx={{ height: 18, fontSize: '0.65rem' }} />
                        )}
                      </Box>
                    }
                  />
                </ListItem>

                {/* Divider between items — skip after the last one */}
                {index < goals.length - 1 && <Divider component="li" />}
              </Box>
            ))}
          </List>
        </Card>
      )}

    </Box>
  );
}

export default GoalsPage;