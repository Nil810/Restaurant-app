// Created by Sk
import * as React from "react";
import { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box"; // Import Box for layout
import { Switch, FormControlLabel } from "@mui/material";
import configs, { getParameterByName } from "../Constants";
import { styled } from "@mui/material/styles";
export default function MediaCard(props) {
  //added by sk
  const ColorSwitch = styled(Switch)(({ theme }) => ({
    width: 70, // Adjust width of the switch
    height: 40, // Adjust height of the switch
    padding: 8,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 3,
      "&.Mui-checked": {
        transform: "translateX(32px)", // Position when checked
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor: "#00cc66", // Green color for "on" state
          opacity: 1,
          border: "none",
        },
      },
    },
    "& .MuiSwitch-thumb": {
      width: 34, // Large thumb width
      height: 34, // Large thumb height
      backgroundColor: "#ffffff", // White color for the thumb
      boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.5)", // Shadow for depth effect
    },
    "& .MuiSwitch-track": {
      borderRadius: 20,
      backgroundColor: "#ff0000", // Red color for "off" state
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
    },
  }));

  const [checked, setChecked] = useState(props.available);
  const handleChange = (event) => {
    props.onToggle();
    setChecked(event.target.checked);
  };

  const handleNewOrder = () => {
    const url = `${configs.ttoUrl}/?merchantCode=${props.merchantCode}&isScan=true&tableNumber=${props.table}`;
    window.open(url, "_blank"); // Open the URL in a new tab
  };
  return (
    <Card
      sx={{
        margin: "20px",
        width: 230,
        maxWidth: 345,
        backgroundColor: props.available ? "#4caf50" : "#ef4444",
      }}
    >
      <CardMedia
        sx={{ height: 140 }}
        image={props.available?"./free.png":"./occupied.png"}
        title="green iguana"
      />
      <CardContent sx={{ backgroundColor: "white" }}>
        <Box display="flex" flexDirection="column">
          {/* First Row: Table and Dot */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography gutterBottom variant="h5" component="div">
              Table {props.table}
            </Typography>
            {/* <div
              className="dot"
              style={{
                height: "24px",
                width: "24px",
                backgroundColor: props.available ? "green" : "red", // Toggle color based on availability
                borderRadius: "50%", // Makes it a circle
                animation: "blink 1s infinite", // Add blinking animation
              }}
            ></div> */}
          </Box>

          {/* <style>
            {`
      @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
      }
    `}
          </style> */}

          {/* Second Row: Capacity and Freez */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginTop={1}
          >
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Capacity: {props.capacity}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions
        sx={{
          backgroundColor: "white",
          padding: "8px",
          justifyContent: "space-between",
        }}
      >
        {/*<Button
          size="small"
          onClick={props.onToggle} // Call the toggle function on click
          sx={{
            color: "black",
            border: "1px solid #1976d2", // Border color (blue)
            borderRadius: "4px", // Rounded corners
            "&:hover": { backgroundColor: "#1976d2", color: "white" }, // Hover effect
          }}
        >
          {props.available ? "Available" : "Unavailable"}{" "}
        </Button> */}
        <FormControlLabel
          style={{
            margin: 0,
            fontWeight: "bold",
            transform: "scale(1.2)",
          }}
          // label={<span style={{ fontSize: "0.9rem" }}>{"Available"}</span>}
          control={<ColorSwitch checked={checked} onChange={handleChange} />}
        />
        {props.available ? (
          <Button
            size="small"
            variant="contained"
            onClick={handleNewOrder}
          >
            New order
          </Button>
        ) : (
          <Button
            size="small"
             variant="outlined"
            // onClick={props.onEdit} // New function for Update Table
            onClick={handleNewOrder}
           
          >
            Open Order
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
