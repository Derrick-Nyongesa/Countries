import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
  Grid,
  IconButton,
  Button,
  Paper,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import PinterestIcon from "@mui/icons-material/Pinterest";
import MenuIcon from "@mui/icons-material/Menu";

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

function Country() {
  const { name } = useParams();
  const [country, setCountry] = useState(null);
  const [borderData, setBorderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const res = await axios.get(
          `https://restcountries.com/v3.1/name/${name}?fullText=true`
        );
        const countryData = res.data[0];
        setCountry(countryData);

        // Fetch GeoJSON borders using cca3
        const cca3 = countryData.cca3;
        const geoRes = await axios.get(
          `https://raw.githubusercontent.com/johan/world.geo.json/master/countries/${cca3}.geo.json`
        );
        setGeoData(geoRes.data);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Country not found or GeoJSON fetch failed");
        setLoading(false);
      }
    };
    fetchCountry();
  }, [name]);

  if (loading)
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box textAlign="center" mt={10}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );

  const capitalCoords = country.capitalInfo?.latlng || country.latlng;

  return (
    <Box>
      <Box>
        <img
          src={country.flags.svg}
          alt="Country Flag"
          style={{
            width: "100%",
          }}
        />
      </Box>
      <Box px={3} py={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => (window.location.href = "/")}
          startIcon={<MenuIcon />}
        >
          Back to Home
        </Button>
      </Box>

      <Box display="flex" justifyContent="center" alignItems="center">
        <Box display="flex" alignItems="center" gap={2} px={3} py={2}>
          <Avatar
            src={country.coatOfArms.svg}
            alt="coat of arms"
            variant="square"
            sx={{ width: 160, height: 140 }}
          />
          <Box>
            <Typography variant="h3" fontWeight="bold">
              {country.name.common}
            </Typography>
            <Typography
              variant="subtitle1"
              fontStyle="italic"
              color="text.secondary"
            >
              {country.name.official}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr", // 1 column on extra-small screens
            sm: "1fr 1fr", // 2 columns on small screens
            md: "1fr 1fr 1fr 1fr", // 4 columns on medium+ screens
          },
        }}
      >
        <Paper sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="body1">
            <strong>Short Form</strong>
          </Typography>
          <Typography variant="body1">{country.cioc}</Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="body1">
            <strong>Capital</strong>
          </Typography>
          <Typography variant="body1">
            {country.capital?.[0] || "N/A"}
          </Typography>
        </Paper>

        <Paper sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="body1">
            <strong>Region</strong>
          </Typography>
          <Typography variant="body1">
            {country.region} - {country.subregion}
          </Typography>
        </Paper>

        <Paper sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="body1">
            <strong>Currency</strong>
          </Typography>
          {country.currencies
            ? Object.entries(country.currencies).map(
                ([code, { name, symbol }]) => (
                  <Typography key={code} variant="body1">
                    {code}: {name} ({symbol})
                  </Typography>
                )
              )
            : "N/A"}
        </Paper>

        <Paper sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="body1">
            <strong>Languages</strong>
          </Typography>
          {country.languages
            ? Object.entries(country.languages).map(([key, value]) => (
                <Typography key={key} variant="body1">
                  {value}
                </Typography>
              ))
            : "N/A"}
        </Paper>

        <Paper sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="body1">
            <strong>Area</strong>
          </Typography>
          <Typography variant="body1">
            {country.area.toLocaleString()} km²
          </Typography>
        </Paper>

        <Paper sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="body1">
            <strong>Population</strong>
          </Typography>
          <Typography variant="body1">
            {country.population.toLocaleString()}
          </Typography>
        </Paper>

        <Paper sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="body1">
            <strong>Timezone</strong>
          </Typography>
          <Typography variant="body1">{country.timezones}</Typography>
        </Paper>

        <Paper sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="body1">
            <strong>Borders</strong>
          </Typography>
          {country.borders
            ? Object.entries(country.borders).map(([key, value]) => (
                <Typography key={key} variant="body1">
                  {value}
                </Typography>
              ))
            : "N/A"}
        </Paper>
        <Paper sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="body1">
            <strong>Driving Side</strong>
          </Typography>
          <Typography variant="body1">{country.car.side}</Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="body1">
            <strong>Start of Week</strong>
          </Typography>
          <Typography variant="body1">{country.startOfWeek}</Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="body1">
            <strong>Landlocked Country?</strong>
          </Typography>
          <Typography variant="body1">
            {country.landlocked ? "Yes" : "No"}
          </Typography>
        </Paper>
      </Box>

      {capitalCoords && (
        <Box mt={3}>
          <Box textAlign="center">
            <Typography variant="body1" mb={1}>
              <strong>Location Map</strong>
            </Typography>
          </Box>
          <MapContainer
            center={capitalCoords}
            zoom={6}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {geoData && (
              <GeoJSON data={geoData} style={{ color: "blue", weight: 2 }} />
            )}
            <Marker position={capitalCoords}>
              <Popup>{country.capital?.[0] || country.name.common}</Popup>
            </Marker>
          </MapContainer>
        </Box>
      )}
    </Box>
  );
}

export default Country;
