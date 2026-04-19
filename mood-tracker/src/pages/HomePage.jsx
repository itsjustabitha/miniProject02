// OLD CODE AS A PLACE HOLDER
// function HomePage() {
//   return <h1>Home Page — Daily Quote goes here</h1>;
// }

// export default HomePage;

import { useState, useEffect } from 'react';
import axios from 'axios';

// MUI component imports — each one has a specific job
import Box               from '@mui/material/Box';
import Card              from '@mui/material/Card';
import CardContent       from '@mui/material/CardContent';
import Typography        from '@mui/material/Typography';
import CircularProgress  from '@mui/material/CircularProgress';
import Alert             from '@mui/material/Alert';
import Button            from '@mui/material/Button';
import Divider           from '@mui/material/Divider';

// The API URL is stored as a constant outside the component.
// WHY: If the URL ever changes, you update it in one place only. DRY principle.
const QUOTE_URL = 'https://api.quotable.io/random?tags=motivational';

function HomePage() {

  // --- STATE SETUP ---
  // Three explicit variables, each owning one specific job.
  // WHY three instead of one object: easier to read, easier to update independently.

  const [quoteData, setQuoteData] = useState(null);    // holds { content, author } when fetch succeeds
  const [isLoading, setIsLoading] = useState(true);    // true = show spinner, false = show content
  const [error, setError]         = useState(null);    // null = no error, string = show error message

  // --- FETCH FUNCTION ---
  // Defined as a named function (not inline in useEffect) for two reasons:
  // 1. The "New Quote" button can call it directly — DRY, no duplicate code needed.
  // 2. Named functions are easier to read and debug
  const fetchQuote = async () => {
    // Reset state before every fetch attempt — handles the "New Quote" button case
    // where we're fetching again after a previous success
    setIsLoading(true);
    setError(null);

    try {
      // axios.get returns a promise — we await it.
      // response.data is already parsed JSON — no .json() call needed (unlike fetch)
      const response = await axios.get(QUOTE_URL);

      // We only store the two fields we actually use in the UI
      setQuoteData({
        content: response.data.content,
        author:  response.data.author,
      });

    } catch (err) {
      // If the request fails for ANY reason (network down, CORS, 500 error),
      // we store a human-readable message — not the raw error object
      setError('Could not load your daily quote. Check your connection and try again.');

    } finally {
      // finally runs whether the try succeeded OR the catch fired.
      // WHY: We always want to stop the spinner, no matter what happened.
      setIsLoading(false);
    }
  };

  // --- useEffect SETUP ---
  // Empty dependency array [] = run fetchQuote ONCE, on component mount only.
  // Module 7 slide 13: "If the dependency array is empty, the effect runs
  // only once, when the component is first mounted."
  useEffect(() => {
    fetchQuote();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // NOTE: The eslint comment suppresses a warning about fetchQuote not being
  // in the dependency array. fetchQuote is stable — it doesn't need to be there.

  // --- RENDER LOGIC ---
  // We render one of three states: loading, error, or success.
  // This is the same conditional rendering pattern from Module 7 slide 25.

  const renderQuoteContent = () => {

    // STATE 1: Loading — show MUI spinner
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 4 }}>
          <CircularProgress color="primary" />
          <Typography variant="body2" color="text.secondary">
            Fetching your daily motivation...
          </Typography>
        </Box>
      );
    }

    // STATE 2: Error — show MUI Alert with retry button
    if (error) {
      return (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={fetchQuote}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      );
    }

    // STATE 3: Success — show the quote card
    if (quoteData) {
      return (
        <>
          <Typography
            variant="h5"
            component="blockquote"
            sx={{
              fontStyle: 'italic',
              lineHeight: 1.7,
              color: 'text.primary',
              mb: 2,
            }}
          >
            "{quoteData.content}"
          </Typography>
          <Divider sx={{ my: 1.5 }} />
          <Typography variant="subtitle1" color="text.secondary" sx={{ textAlign: 'right' }}>
            — {quoteData.author}
          </Typography>
        </>
      );
    }
  };

  // --- MAIN RETURN ---
  return (
    <Box className="container" sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>

      {/* Page heading */}
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        Welcome to MoodTracker
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        A daily habit of self-awareness leads to better decisions, clearer goals,
        and a stronger sense of wellbeing.
      </Typography>

      {/* Quote Card — MUI Card wrapping our conditional render */}
      <Card elevation={3} sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent sx={{ p: 3 }}>

          <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: 2 }}>
            Daily Motivation
          </Typography>

          {/* This is where loading / error / success renders */}
          <Box sx={{ mt: 2 }}>
            {renderQuoteContent()}
          </Box>

        </CardContent>
      </Card>

      {/* New Quote button — only visible when not loading */}
      {!isLoading && (
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={fetchQuote}
            sx={{ borderRadius: 3, px: 4 }}
          >
            New Quote
          </Button>
        </Box>
      )}

    </Box>
  );
}

export default HomePage;