import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/lucas-george-wendt-IYm2PCy0f8c-unsplash.jpg";
import {
  Box,
  TextField,
  Typography,
  Button,
  Autocomplete,
} from "@mui/material";

function Home() {
  const [showSearch, setShowSearch] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const handleShowSearch = () => {
    setShowSearch(true);
  };

  const handleHideSearch = () => {
    setShowSearch(false);
  };

  // Fetch country suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (inputValue.length < 2) return;
      try {
        const res = await axios.get(
          `https://restcountries.com/v3.1/name/${inputValue}`
        );
        setSuggestions(res.data.map((country) => country.name.common).sort());
      } catch (error) {
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [inputValue]);

  const handleSelectCountry = (event, value) => {
    if (value) {
      navigate(`/country/${encodeURIComponent(value)}`);
    }
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
            style={{ cursor: "pointer", color: "#9a2738" }}
          >
            Countries Library
          </Typography>
          {!showSearch && (
            <Button
              variant="contained"
              onClick={handleShowSearch}
              sx={{ mb: 3, textTransform: "none" }}
              style={{ backgroundColor: "#9a2738", color: "#fff" }}
            >
              Search for a country
            </Button>
          )}

          {showSearch && (
            <Autocomplete
              freeSolo
              options={suggestions}
              onInputChange={(e, val) => setInputValue(val)}
              onChange={handleSelectCountry}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Type a country name..."
                  variant="outlined"
                  autoFocus
                />
              )}
            />
          )}
        </Box>
      </Box>
    </>
  );
}

export default Home;
