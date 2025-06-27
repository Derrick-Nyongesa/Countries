import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
} from "@mui/material";

function SubRegion() {
  const { subregion } = useParams();
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountriesByRegion = async () => {
      try {
        const response = await axios.get(
          `https://restcountries.com/v3.1/subregion/${subregion}`
        );
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching subregion data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCountriesByRegion();
  }, [subregion]);

  if (loading)
    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#ffffff",
          zIndex: 9999,
        }}
      >
        <div className="loader" />
      </Box>
    );
  return (
    <Box px={3} py={2}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontWeight: "bold", mb: 2 }}
      >
        {subregion}
      </Typography>

      <List>
        {countries.map((country) => (
          <React.Fragment key={country.cca3}>
            <ListItem
              button
              onClick={() => navigate(`/country/${country.name.common}`)}
            >
              <ListItemAvatar>
                <Avatar
                  variant="square"
                  src={country.flags.svg}
                  alt={`Flag of ${country.name.common}`}
                  sx={{ width: 40, height: 30 }}
                />
              </ListItemAvatar>
              <ListItemText
                primaryTypographyProps={{
                  sx: {
                    fontWeight: "bold",
                    color: "#9a2738",
                    textDecoration: "underline",
                    cursor: "pointer",
                    "&:hover": {
                      color: "#d32f2f",
                    },
                  },
                }}
                primary={country.name.common}
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
}

export default SubRegion;
