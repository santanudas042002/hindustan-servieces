import { Box, CircularProgress, Typography } from '@mui/material';
import './loadingContainer.scss';

const LoadingComponent = () => {
  return (
    <Box className="loading-container">
      <CircularProgress className="loading-spinner" size={60} />
      <Typography variant="h6" className="loading-text">
        Loading...
      </Typography>
    </Box>
  );
};

export default LoadingComponent;