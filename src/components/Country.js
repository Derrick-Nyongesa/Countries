import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Box, Typography, Button, Paper } from "@mui/material";
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
  const navigate = useNavigate();

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
          onClick={() => navigate("/")}
          startIcon={<MenuIcon />}
          style={{ backgroundColor: "#9a2738", color: "#fff" }}
        >
          Back to Home
        </Button>
      </Box>

      <Box display="flex" justifyContent="center" alignItems="center">
        <Box display="flex" alignItems="center" gap={2} px={3} py={2}>
          <Box
            component="img"
            src={country.coatOfArms.svg}
            alt="coat of arms"
            sx={{
              width: 180,
              height: 180,
              objectFit: "contain",
              borderRadius: 1,
              backgroundColor: "#fff",
            }}
          />

          <Box>
            <Typography variant="h3" fontWeight="bold">
              {country.name.common}
            </Typography>
            <Typography
              variant="subtitle1"
              fontStyle="italic"
              color="text.secondary"
              className="fade-in-up"
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
          <Typography variant="body1" textTransform={"uppercase"}>
            Short Form
          </Typography>
          <Typography
            variant="body1"
            className="fade-in-up"
            fontWeight="bold"
            style={{ color: "#9a2738" }}
          >
            <strong>{country.cioc}</strong>
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="body1" textTransform={"uppercase"}>
            Capital
          </Typography>
          <Typography
            variant="body1"
            className="fade-in-up"
            fontWeight="bold"
            style={{ color: "#9a2738" }}
          >
            <strong>{country.capital?.[0] || "N/A"}</strong>
          </Typography>
        </Paper>

        <Paper sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="body1" textTransform={"uppercase"}>
            Region
          </Typography>
          <Typography
            variant="body1"
            className="fade-in-up"
            fontWeight="bold"
            style={{
              color: "#9a2738",
              cursor: "pointer",
            }}
          >
            <strong>
              <span
                onMouseEnter={(e) => {
                  e.target.style.color = "#d32f2f";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "#9a2738";
                }}
                style={{
                  textDecoration: "underline",
                }}
                onClick={() => navigate(`/region/${country.region}`)}
              >
                {country.region}
              </span>{" "}
              -{" "}
              <span
                onMouseEnter={(e) => {
                  e.target.style.color = "#d32f2f";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "#9a2738";
                }}
                style={{ textDecoration: "underline" }}
                onClick={() => navigate(`/subregion/${country.subregion}`)}
              >
                {country.subregion}
              </span>
            </strong>
          </Typography>
        </Paper>

        <Paper sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="body1" textTransform={"uppercase"}>
            Currency
          </Typography>
          {country.currencies
            ? Object.entries(country.currencies).map(
                ([code, { name, symbol }]) => (
                  <Typography
                    key={code}
                    variant="body1"
                    className="fade-in-up"
                    fontWeight="bold"
                    style={{ color: "#9a2738" }}
                  >
                    <strong>
                      {code}: {name} ({symbol})
                    </strong>
                  </Typography>
                )
              )
            : "N/A"}
        </Paper>

        <Paper sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="body1" textTransform={"uppercase"}>
            Languages
          </Typography>
          {country.languages
            ? Object.entries(country.languages).map(([key, value]) => (
                <Typography
                  key={key}
                  variant="body1"
                  className="fade-in-up"
                  fontWeight="bold"
                  style={{ color: "#9a2738" }}
                >
                  <strong>{value}</strong>
                </Typography>
              ))
            : "N/A"}
        </Paper>

        <Paper sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="body1" textTransform={"uppercase"}>
            Area
          </Typography>
          <Typography
            variant="body1"
            className="fade-in-up"
            fontWeight="bold"
            style={{ color: "#9a2738" }}
          >
            <strong>{country.area.toLocaleString()} km²</strong>
          </Typography>
        </Paper>

        <Paper sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="body1" textTransform={"uppercase"}>
            Population
          </Typography>
          <Typography
            variant="body1"
            className="fade-in-up"
            fontWeight="bold"
            style={{ color: "#9a2738" }}
          >
            <strong>{country.population.toLocaleString()}</strong>
          </Typography>
        </Paper>

        <Paper sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="body1" textTransform={"uppercase"}>
            Timezone
          </Typography>
          <Typography
            variant="body1"
            className="fade-in-up"
            fontWeight="bold"
            style={{ color: "#9a2738" }}
          >
            <strong>{country.timezones}</strong>
          </Typography>
        </Paper>

        <Paper sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="body1" textTransform={"uppercase"}>
            Borders
          </Typography>
          {country.borders
            ? Object.entries(country.borders).map(([key, value]) => (
                <Typography
                  key={key}
                  variant="body1"
                  className="fade-in-up"
                  fontWeight="bold"
                  style={{
                    color: "#9a2738",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#d32f2f";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "#9a2738";
                  }}
                >
                  <strong>{value}</strong>
                </Typography>
              ))
            : "N/A"}
        </Paper>
        <Paper sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="body1" textTransform={"uppercase"}>
            Driving Side
          </Typography>
          <Typography
            variant="body1"
            className="fade-in-up"
            fontWeight="bold"
            style={{ color: "#9a2738" }}
          >
            <strong>{country.car.side}</strong>
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="body1" textTransform={"uppercase"}>
            Start of Week
          </Typography>
          <Typography
            variant="body1"
            className="fade-in-up"
            fontWeight="bold"
            style={{ color: "#9a2738" }}
          >
            <strong>{country.startOfWeek}</strong>
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="body1" textTransform={"uppercase"}>
            Landlocked Country?
          </Typography>
          <Typography
            variant="body1"
            className="fade-in-up"
            fontWeight="bold"
            style={{ color: "#9a2738" }}
          >
            <strong>{country.landlocked ? "Yes" : "No"}</strong>
          </Typography>
        </Paper>
      </Box>

      {capitalCoords && (
        <Box mt={3}>
          <Box textAlign="center">
            <Typography variant="body1" mb={1} textTransform={"uppercase"}>
              Location Map
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
