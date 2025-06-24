import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";

// Fix marker icon issue in Leaflet
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const res = await axios.get(
          `https://restcountries.com/v3.1/name/${name}?fullText=true`
        );
        setCountry(res.data[0]);
        setLoading(false);
      } catch (err) {
        setError("Country not found");
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
      {/* OpenStreetMap with marker */}
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
