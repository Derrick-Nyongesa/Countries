import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Avatar, Paper } from "@mui/material";

function Region() {
  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2} px={3} py={2}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          Continent/Region
        </Typography>
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
          <Avatar
            src="country flags svg"
            alt="country flag"
            variant="square"
            sx={{ width: 80, height: 60 }}
          />
          <Typography
            variant="body1"
            className="fade-in-up"
            fontWeight="bold"
            style={{ color: "#9a2738" }}
          >
            country name common
          </Typography>
          <Typography
            variant="subtitle1"
            fontStyle="italic"
            color="text.secondary"
            className="fade-in-up"
          >
            country name official
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}

export default Region;
