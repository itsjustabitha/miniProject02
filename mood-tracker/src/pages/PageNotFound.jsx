// OLD CODE - PLACE HOLDER
// function PageNotFound() {
//   return <h1>404 — Page Not Found</h1>;
// }

// export default PageNotFound;

import { useNavigate } from 'react-router-dom';
import { Link }        from 'react-router-dom';

import Box        from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button     from '@mui/material/Button';
import Paper      from '@mui/material/Paper';

function PageNotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        minHeight:      '70vh',
        textAlign:      'center',
        px: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{ borderRadius: 4, px: 6, py: 6, maxWidth: 480 }}
      >
        <Typography variant="h1" sx={{ fontSize: '5rem', mb: 1 }}>
          🧭
        </Typography>

        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          404 — Page Not Found
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Looks like you've wandered off the path. That's okay —
          even mood trackers get lost sometimes.
        </Typography>

        {/* Two options: go home via Link, or go back via useNavigate */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/"
            sx={{ borderRadius: 3, px: 4 }}
          >
            Go Home
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate(-1)}
            sx={{ borderRadius: 3, px: 4 }}
          >
            Go Back
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default PageNotFound;