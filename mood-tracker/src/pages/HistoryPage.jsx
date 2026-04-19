// OLD PLACE HOLDER CODE
// function HistoryPage() {
//   return <h1>History Page — Your mood entries go here</h1>;
// }

// export default HistoryPage;


import { useState }      from 'react';
import { Link }          from 'react-router-dom';
import { useMoodContext } from '../context/MoodContext';

// MUI imports
import Box         from '@mui/material/Box';
import Card        from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography  from '@mui/material/Typography';
import Button      from '@mui/material/Button';
import Chip        from '@mui/material/Chip';
import Divider     from '@mui/material/Divider';
import Dialog      from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

// Maps numeric rating to a display object — keeps JSX clean and DRY.
// Instead of writing conditional logic inline, we look up the value once.
const MOOD_DISPLAY = {
  1: { emoji: '😞', label: 'Rough',  color: 'error'   },
  2: { emoji: '😕', label: 'Low',    color: 'warning'  },
  3: { emoji: '😐', label: 'Okay',   color: 'default'  },
  4: { emoji: '🙂', label: 'Good',   color: 'primary'  },
  5: { emoji: '😄', label: 'Great',  color: 'success'  },
};

// --- SINGLE ENTRY CARD ---
// Extracted as its own component — Module 6 slide 35's "Extract Components" pattern.
// WHY: HistoryPage stays readable. Each card's logic is isolated and testable.
// Receives one entry and the delete handler as props.
function MoodEntryCard({ entry, onDeleteRequest }) {
  const mood = MOOD_DISPLAY[entry.rating] || MOOD_DISPLAY[3];

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 3,
        // Left border color gives instant visual mood signal without reading the text
        borderLeft: '5px solid',
        borderLeftColor: `${mood.color}.main`,
        transition: 'box-shadow 0.2s ease',
        '&:hover': { elevation: 5, boxShadow: 4 },
      }}
    >
      <CardContent sx={{ pb: 1 }}>

        {/* Top row: date on left, mood chip on right */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography variant="caption" color="text.secondary">
            {entry.date}
          </Typography>
          {/* Chip displays the mood rating at a glance */}
          <Chip
            label={`${mood.emoji}  ${mood.label} (${entry.rating}/5)`}
            color={mood.color}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Box>

        <Divider sx={{ mb: 1.5 }} />

        {/* Notes / reflection content */}
        <Typography variant="body1" sx={{ lineHeight: 1.7, mb: 1.5 }}>
          {entry.notes}
        </Typography>

        {/* Tag chip — secondary label for filtering context */}
        {entry.tag && (
          <Chip
            label={entry.tag}
            variant="outlined"
            size="small"
            color="secondary"
          />
        )}

      </CardContent>

      {/* CardActions keeps the delete button visually separated from content */}
      <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
        <Button
          size="small"
          color="error"
          // onDeleteRequest passes the id UP to HistoryPage's confirm dialog.
          // WHY: The Dialog state lives in HistoryPage, not here.
          // This card only signals intent — it does not delete directly.
          // That is inverse data flow: child signals, parent decides.
          onClick={() => onDeleteRequest(entry.id)}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}

// --- EMPTY STATE COMPONENT ---
// Extracted for the same reason — keeps the main return block readable.
// A dedicated empty state is better UX than rendering nothing.
function EmptyState() {
  return (
    <Box
      sx={{
        textAlign: 'center',
        mt: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Typography variant="h2" sx={{ fontSize: '4rem' }}>
        📭
      </Typography>
      <Typography variant="h6" color="text.secondary">
        No entries yet.
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Start tracking your mood to see your history here.
      </Typography>
      {/*
        Link from react-router-dom used as the 'component' prop for MUI Button.
        WHY: We get MUI's button styling AND react-router's client-side
        navigation in one element — no page reload, no styling compromise.
      */}
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/mood"
        sx={{ borderRadius: 3, mt: 1, px: 4 }}
      >
        Log Your First Mood
      </Button>
    </Box>
  );
}

// --- MAIN HISTORY PAGE ---
function HistoryPage() {
  // Pull entries and deleteEntry from MoodContext.
  // No props needed — context makes this available anywhere in the tree.
  const { entries, deleteEntry } = useMoodContext();

  // Confirm dialog state — tracks which entry id is pending deletion.
  // WHY null as default: null means no dialog is open.
  // When the user clicks Delete on a card, we store that card's id here.
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  // Called when a card's Delete button is clicked.
  // Opens the confirm dialog by storing the id.
  const handleDeleteRequest = (id) => {
    setPendingDeleteId(id);
  };

  // Called when the user confirms deletion in the dialog.
  // This is where deleteEntry actually fires — not in the card.
  const handleConfirmDelete = () => {
    deleteEntry(pendingDeleteId);  // inverse data flow: triggers context update
    setPendingDeleteId(null);      // close the dialog
  };

  // Called when the user cancels — just close the dialog, touch nothing.
  const handleCancelDelete = () => {
    setPendingDeleteId(null);
  };

  return (
    <Box className="container" sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>

      {/* Page header row */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Your History
        </Typography>
        {/* Entry count — only shown when there is something to count */}
        {entries.length > 0 && (
          <Chip
            label={`${entries.length} ${entries.length === 1 ? 'entry' : 'entries'}`}
            color="primary"
            variant="outlined"
          />
        )}
      </Box>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        A record of your emotional patterns over time.
      </Typography>

      {/* CONDITIONAL RENDER: empty state OR the list */}
      {entries.length === 0 ? (
        <EmptyState />
      ) : (
        /*
          .map() iterates over the entries array.
          Each MoodEntryCard receives:
          - key={entry.id}  → required by React for list reconciliation
                               (Module 6 slide 44 — "key prop is required for lists")
          - entry={entry}   → the full data object for that card to display
          - onDeleteRequest → the handler function so the card can signal deletion intent
        */
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {entries.map(entry => (
            <MoodEntryCard
              key={entry.id}
              entry={entry}
              onDeleteRequest={handleDeleteRequest}
            />
          ))}
        </Box>
      )}

      {/* CONFIRM DELETE DIALOG */}
      {/*
        WHY a confirm dialog instead of deleting immediately:
        Deleting is destructive and irreversible (no database to restore from).
        A dialog prevents accidental taps — especially on mobile.
        pendingDeleteId being non-null is what opens it.
      */}
      <Dialog
        open={pendingDeleteId !== null}
        onClose={handleCancelDelete}
      >
        <DialogTitle>Delete this entry?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This entry will be permanently removed from your history.
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}

export default HistoryPage;