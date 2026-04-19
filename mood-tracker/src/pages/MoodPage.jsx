// OLD  PLACE HOLDER CODE
// function MoodPage() {
//   return <h1>Mood Page — Log your mood here</h1>;
// }

// export default MoodPage;

import { useState }      from 'react';
import { useNavigate }   from 'react-router-dom'; // Module 7 slide 54
import { useMoodContext } from '../context/MoodContext';

// MUI imports
import Box         from '@mui/material/Box';
import Card        from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography  from '@mui/material/Typography';
import Slider      from '@mui/material/Slider';
import TextField   from '@mui/material/TextField';
import Button      from '@mui/material/Button';
import Alert       from '@mui/material/Alert';

// Slider labels displayed below the track
// Each mark corresponds to one point on the 1–5 scale
const MOOD_MARKS = [
  { value: 1, label: '😞 Rough' },
  { value: 2, label: '😕 Low'   },
  { value: 3, label: '😐 Okay'  },
  { value: 4, label: '🙂 Good'  },
  { value: 5, label: '😄 Great' },
];

function MoodPage() {
  // useNavigate returns a function we call to change the route
  // Module 7 slide 54: "The most common way to use this function
  // is to pass the URL to navigate to as a single parameter."
  const navigate = useNavigate();

  // Pull addEntry from MoodContext — this is how we save the entry
  const { addEntry } = useMoodContext();

  // --- CONTROLLED FORM STATE ---
  // Each piece of form data gets its own state variable.
  // WHY controlled: React is always the single source of truth
  // for the input values — no reading from the DOM directly.
  const [rating, setRating]   = useState(3);    // default to middle value
  const [notes, setNotes]     = useState('');
  const [tag, setTag]         = useState('');   // optional category tag
  const [submitted, setSubmitted] = useState(false); // tracks post-submit state
  const [validationError, setValidationError] = useState('');

  // --- FORM VALIDATION ---
  const validate = () => {
    if (notes.trim().length < 5) {
      setValidationError('Please add a note of at least 5 characters.');
      return false;
    }
    setValidationError('');
    return true;
  };

  // --- SUBMIT HANDLER ---
  const handleSubmit = () => {
    // Validate before doing anything else
    if (!validate()) return;

    // Build the entry object — shape must match what HistoryPage expects
    // id and date are added inside addEntry (single responsibility)
    addEntry({
      rating,
      notes:  notes.trim(),
      tag:    tag.trim() || 'General', // default tag if left blank
    });

    // Mark as submitted to briefly show the success state
    setSubmitted(true);

    // Navigate to History after a short delay so the user
    // sees the success confirmation before the page changes.
    // useNavigate called inside setTimeout — still valid (Module 7 slide 54)
    setTimeout(() => {
      navigate('/history');
    }, 1200);
  };

  // --- RENDER ---
  return (
    <Box className="container" sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>

      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        Log Your Mood
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Be honest. This is just for you.
      </Typography>

      <Card elevation={3} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>

          {/* SUCCESS STATE: show confirmation before redirect */}
          {submitted ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              Entry saved! Taking you to your history...
            </Alert>
          ) : (
            <>
              {/* VALIDATION ERROR — only shows after a failed submit attempt */}
              {validationError && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                  {validationError}
                </Alert>
              )}

              {/* --- MOOD RATING SLIDER --- */}
              {/* This is the primary Interactive Element for the rubric */}
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                How are you feeling today?
              </Typography>
              <Box sx={{ px: 2, mb: 4 }}>
                <Slider
                  value={rating}
                  onChange={(e, newValue) => setRating(newValue)}
                  // WHY e and newValue: MUI Slider passes the event AND
                  // the new numeric value as separate args — unlike a text input
                  // where you'd use e.target.value
                  min={1}
                  max={5}
                  step={1}
                  marks={MOOD_MARKS}
                  color="primary"
                  sx={{ mt: 1 }}
                />
              </Box>

              {/* --- NOTES TEXT FIELD --- */}
              <TextField
                label="Reflection / Notes"
                placeholder="What's on your mind? What shaped today?"
                multiline
                rows={4}
                fullWidth
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                // fullWidth + multiline are the two props that make this
                // a proper journaling input rather than a single-line box
                sx={{ mb: 3 }}
              />

              {/* --- OPTIONAL TAG FIELD --- */}
              <TextField
                label="Tag (optional)"
                placeholder="e.g. Work, School, Personal"
                fullWidth
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                helperText="Add a category to filter your history later."
                sx={{ mb: 4 }}
              />

              {/* --- SUBMIT BUTTON --- */}
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={handleSubmit}
                sx={{ borderRadius: 3, py: 1.5 }}
              >
                Save Entry
              </Button>
            </>
          )}

        </CardContent>
      </Card>
    </Box>
  );
}

export default MoodPage;