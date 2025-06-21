import { useState } from "react";
import "./App.css";
import bgImage from "./assets/lucas-george-wendt-IYm2PCy0f8c-unsplash.jpg";
import { Box, TextField, Typography, Button } from "@mui/material";

function App() {
  const [showSearch, setShowSearch] = useState(false);

  const handleShowSearch = () => {
    setShowSearch(true);
  };

  const handleHideSearch = () => {
    setShowSearch(false);
  };

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f5f5f5",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 2,
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "left center",
          backgroundRepeat: "no-repeat",
          position: "relative",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 500,
            textAlign: "center",
            p: 3,
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ color: "#1976d2", fontWeight: "bold" }}
            onClick={handleHideSearch}
            style={{ cursor: "pointer" }}
          >
            Countries Library
          </Typography>
          {!showSearch && (
            <Button
              variant="contained"
              onClick={handleShowSearch}
              sx={{ mb: 3, textTransform: "none" }}
            >
              Search for a country
            </Button>
          )}

          {showSearch && (
            <TextField
              fullWidth
              placeholder="Type a country name..."
              variant="outlined"
              autoFocus
            />
          )}
        </Box>
      </Box>
    </>
  );
}

export default App;
