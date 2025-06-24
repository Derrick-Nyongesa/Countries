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
    <Box sx={{ p: 3, maxWidth: 700, mx: "auto" }}>
      <Card sx={{ p: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={country.flags.svg}
              alt="flag"
              variant="square"
              sx={{ width: 80, height: 60 }}
            />
            <Typography variant="h4" fontWeight="bold">
              {country.name.common}
            </Typography>
          </Box>
          <Typography variant="body1" mt={2}>
            <strong>Official Name:</strong> {country.name.official}
          </Typography>
          <Typography variant="body1">
            <strong>Capital:</strong> {country.capital?.[0] || "N/A"}
          </Typography>
          <Typography variant="body1">
            <strong>Region:</strong> {country.region}
          </Typography>
          <Typography variant="body1">
            <strong>Subregion:</strong> {country.subregion}
          </Typography>
          <Typography variant="body1">
            <strong>Population:</strong> {country.population.toLocaleString()}
          </Typography>
          <Typography variant="body1">
            <strong>Area:</strong> {country.area.toLocaleString()} km²
          </Typography>
          <Typography variant="body1">
            <strong>Languages:</strong>{" "}
            {country.languages
              ? Object.values(country.languages).join(", ")
              : "N/A"}
          </Typography>
          <Typography variant="body1">
            <strong>Currencies:</strong>{" "}
            {country.currencies
              ? Object.values(country.currencies)
                  .map((c) => `${c.name} (${c.symbol})`)
                  .join(", ")
              : "N/A"}
          </Typography>
          <Typography variant="body1">
            <strong>Timezones:</strong> {country.timezones.join(", ")}
          </Typography>
        </CardContent>
      </Card>

      {capitalCoords && (
        <Box mt={3}>
          <Typography variant="h6" mb={1}>
            Location Map
          </Typography>
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
