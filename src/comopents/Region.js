import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
} from "@mui/material";

function Region() {
  const { region } = useParams();
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountriesByRegion = async () => {
      try {
        const response = await axios.get(
          `https://restcountries.com/v3.1/region/${region}`
        );
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching region data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCountriesByRegion();
  }, [region]);

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <Typography variant="h6">Loading countries in {region}...</Typography>
      </Box>
    );
  }

  return (
    <Box px={3} py={2}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontWeight: "bold", mb: 2 }}
      >
        {region}
      </Typography>

      <Grid container spacing={2}>
        {countries.map((country) => (
          <Grid item xs={12} sm={6} md={4} key={country.cca3}>
            <Card
              onClick={() => navigate(`/country/${country.name.common}`)}
              sx={{ cursor: "pointer" }}
            >
              <CardMedia
                component="img"
                height="140"
                image={country.flags.svg}
                alt={`Flag of ${country.name.common}`}
              />
              <CardContent>
                <Typography variant="h6">{country.name.common}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Region;
