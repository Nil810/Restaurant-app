import axios from "axios";
import React, { useState, useEffect } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import configs, { getParameterByName } from "../Constants";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import DownloadIcon from "@mui/icons-material/Download";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import QRCode from "react-qr-code";
import TableBarIcon from '@mui/icons-material/TableBar';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

function TableView(props) {
  const [tabNum, setTabNum] = useState("");
  const [tableData, setTableData] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [isTableView, setIsTableView] = useState(false);
  let userData = sessionStorage.getItem("userData")
    ? JSON.parse(sessionStorage.getItem("userData"))
    : "";
  console.log(userData);

  let baseURL = configs.baseURL;
  const userId = userData ? userData.sub : " ";
  let merchantData = sessionStorage.getItem("merchantData")
    ? JSON.parse(sessionStorage.getItem("merchantData"))
    : null;
  const merchCode = merchantData ? merchantData.merchantCode : "";

  const getTabByUser = `${baseURL}/api/tables?merchantCode=${merchCode}`;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [tabCapcity, setTabCapcity] = useState([]);
  const [notes, setNotes] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const [tableId, setTableId] = useState("");

  console.log(getTabByUser);

  const handleTabNum = (event) => {
    setTabNum(event.target.value);
  };

  const handleCapacity = (e) => {
    setTabCapcity(e.target.value);
  };

  const downloadQr = (element_id) => {
    console.log("i am downloading")
    const element = document.getElementById(element_id);
      document.getElementById(element_id).style.display = "block"
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const scaleFactor = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

    const x = (pdfWidth - imgWidth * scaleFactor) / 2;
    const y = (pdfHeight - imgHeight * scaleFactor) / 2;


    pdf.addImage(imgData, 'PNG', x, y, imgWidth * scaleFactor, imgHeight * scaleFactor);
      pdf.save("qrcode.pdf");
    });

    setTimeout(() => {
      document.getElementById(element_id).style.display = "none"
    }, 1000);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!tabNum) {
      console.log("All feilds are mandatry");
    } else if (tableId) {
      axios
        .put(`${baseURL}/api/tables/${tableId}?merchantCode=${merchCode}`, {
          number: tabNum,
          capacity: parseInt(tabCapcity),
          isAvailable: isAvailable,
          userId: merchCode,
          notes: notes,
        })
        .then((response) => {
          console.log(response.data);
          axios.get(getTabByUser).then((response) => {
            console.log(response.data);
            setTableData(response.data);
          });
          setDialogOpen(false);
          setTableId("");
        });
    } else {
      axios
        .post(`${baseURL}/api/tables?merchantCode=${merchCode}`, {
          number: tabNum,
          capacity: parseInt(tabCapcity),
          isAvailable: isAvailable,
          userId: merchCode,
          notes: notes,
        })
        .then((response) => {
          console.log(response.data);
          axios.get(getTabByUser).then((response) => {
            console.log(response.data);
            setTableData(response.data);
          });
          setDialogOpen(false);
          setIsAvailable(false);
          setNotes("");
          setTabCapcity("");
          setTabNum("");
          setSelectedOption("");
        });
    }
  };

  const handleDelete = (id) => {
    console.log(id);
    axios
      .delete(
        `${baseURL}/api/tables/${id}?merchantCode=${
          merchantData.length ? merchantData[0].merchantCode : " "
        }`
      )
      .then((response) => {
        console.log(response.data);
        axios.get(getTabByUser).then((response) => {
          console.log(response.data);
          setTableData(response.data);
        });
      });
  };

  useEffect(() => {
    console.log(tableData);
    if (!tableData) {
      axios.get(getTabByUser).then((response) => {
        console.log(response.data);
        setTableData(response.data);
      });
    }
  });

  const handleNote = (event) => {
    setNotes(event.target.value);
  };

  const handleAvail = () => {
    setIsAvailable(!isAvailable);
  };

  const handleEdit = (tabId) => {
    console.log(tabId);
    let fltData = tableData.filter((tab) => tab.id === tabId);
    console.log(fltData);
    setTableId(fltData[0].id);
    setIsAvailable(fltData[0].isAvailable);
    setNotes(fltData[0].notes);
    setTabCapcity(fltData[0].capacity);
    setTabNum(fltData[0].number);
    setDialogOpen(true);
  };

  function openCanvas() {
    const tableContainer = document.querySelector(".category-list");
    const table = tableContainer.querySelector("table");
  
    // Create canvas and set initial size
    const canvas = document.createElement("canvas");
    canvas.width = tableContainer.offsetWidth;
    canvas.height = tableContainer.offsetHeight;
    tableContainer.appendChild(canvas);
  
    const ctx = canvas.getContext("2d");
  
    const rectangleWidth = 250;
    const rectangleHeight = 100;
    const borderWidth = 2;
    const spacing = 50;
  
    let isDragging = false;
    let clickedIndex = null;
    let isFrozen = false;
  
    function drawRectangle(index, tableInfo) {
      const x = tableInfo.x;
      const y = tableInfo.y;
  
      ctx.strokeStyle = "black";
      ctx.lineWidth = borderWidth;
      ctx.strokeRect(x, y, rectangleWidth, rectangleHeight);
  
      ctx.fillStyle = tableInfo.isAvailable ? "lightgreen" : "red";
      ctx.fillRect(
        x + borderWidth,
        y + borderWidth,
        rectangleWidth - borderWidth * 2,
        rectangleHeight - borderWidth * 2
      );
  
      ctx.fillStyle = "black";
      ctx.font = "24px Arial bold";
      const textWidth = ctx.measureText(tableInfo.capacity).width;
      const textX = x + (rectangleWidth - textWidth) / 2;
      const textY = y + rectangleHeight / 2;
      ctx.fillText(tableInfo.capacity, textX, textY);
  
      ctx.font = "24px Arial bold";
      ctx.fillText(
        `Table ${tableInfo.number}`,
        x + borderWidth + 20,
        y + borderWidth + 20
      );
  
      const buttonWidth = 80;
      const buttonHeight = 30;
      const buttonX = x + rectangleWidth - buttonWidth - 10;
      const buttonY = y + rectangleHeight - buttonHeight - 10;
  
      ctx.fillStyle = "#007BFF";
      ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
      ctx.fillStyle = "white";
      ctx.font = "14px Arial";
      ctx.fillText("New Order", buttonX + 10, buttonY + 20);
  
      const toggleWidth = 80;
      const toggleHeight = 30;
      const toggleX = x + 10;
      const toggleY = y + rectangleHeight - toggleHeight - 10;
  
      ctx.fillStyle = tableInfo.isAvailable ? "green" : "gray";
      ctx.fillRect(toggleX, toggleY, toggleWidth, toggleHeight);
      ctx.fillStyle = "white";
      ctx.font = "14px Arial";
      ctx.fillText(
        tableInfo.isAvailable ? "Yes" : "No",
        toggleX + 5,
        toggleY + 20
      );
    }
  
    function adjustCanvasSize() {
      canvas.width = tableContainer.offsetWidth;
      canvas.height = tableContainer.offsetHeight;
  
      // Redraw rectangles after resizing
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      layoutCards();
    }
  
    function layoutCards() {
      let currentX = borderWidth;
      let currentY = borderWidth;
  
      tableData.forEach((tableInfo, index) => {
        if (currentX + rectangleWidth > canvas.width) {
          currentX = borderWidth;
          currentY += rectangleHeight + borderWidth * 2 + spacing;
        }
  
        tableInfo.x = currentX;
        tableInfo.y = currentY;
        drawRectangle(index, tableInfo);
  
        currentX += rectangleWidth + borderWidth * 2 + spacing;
      });
    }
  
    // API call to update table availability
    function updateTableAvailability(tableInfo) {
      const newAvailability = !tableInfo.isAvailable;
  
      // Update the API
      axios
        .put(`${baseURL}/api/tables/${tableInfo.id}?merchantCode=${merchCode}`, {
          number: tableInfo.number,
          capacity: tableInfo.capacity,
          isAvailable: newAvailability,
          userId: merchCode,
          notes: tableInfo.notes,
        })
        .then((response) => {
          console.log(response.data);
  
          // Update local state
          tableInfo.isAvailable = newAvailability;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          layoutCards();
        })
        .catch((error) => {
          console.error('Error updating table availability:', error);
        });
    }
  
    // Initial layout of cards
    layoutCards();
  
    // Mouse event handling
    canvas.addEventListener("mousedown", (event) => {
      if (!isFrozen) {
        const clickX = event.offsetX;
        const clickY = event.offsetY;
  
        tableData.forEach((tableInfo, index) => {
          const x = tableInfo.x;
          const y = tableInfo.y;
  
          if (
            clickX >= x &&
            clickX <= x + rectangleWidth &&
            clickY >= y &&
            clickY <= y + rectangleHeight
          ) {
            isDragging = true;
            clickedIndex = index;
          }
        });
      }
    });
  
    canvas.addEventListener("mousemove", (event) => {
      if (isDragging && !isFrozen) {
        const newX = event.offsetX - rectangleWidth / 2;
        const newY = event.offsetY - rectangleHeight / 2;
        tableData[clickedIndex].x = newX;
        tableData[clickedIndex].y = newY;
  
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        layoutCards();
      }
    });
  
    canvas.addEventListener("mouseup", () => {
      isDragging = false;
      clickedIndex = null;
    });
  
    canvas.addEventListener("click", (event) => {
      const clickX = event.offsetX;
      const clickY = event.offsetY;
  
      tableData.forEach((tableInfo, index) => {
        const x = tableInfo.x;
        const y = tableInfo.y;
  
        const buttonWidth = 80;
        const buttonHeight = 30;
        const buttonX = x + rectangleWidth - buttonWidth - 10;
        const buttonY = y + rectangleHeight - buttonHeight - 10;
  
        const toggleWidth = 80;
        const toggleHeight = 30;
        const toggleX = x + 10;
        const toggleY = y + rectangleHeight - toggleHeight - 10;
  
        if (
          clickX >= buttonX &&
          clickX <= buttonX + buttonWidth &&
          clickY >= buttonY &&
          clickY <= buttonY + buttonHeight
        ) {
          console.log(`New Order clicked for Table ${tableInfo.number}`);
        }
  
        if (
          clickX >= toggleX &&
          clickX <= toggleX + toggleWidth &&
          clickY >= toggleY &&
          clickY <= toggleY + toggleHeight
        ) {
          // Call the API to update availability
          updateTableAvailability(tableInfo);
        }
      });
    });
  
    // Adjust canvas size on window resize
    window.addEventListener("resize", adjustCanvasSize);
  
    const freezeButton = document.createElement("button");
    freezeButton.textContent = "Freeze Tables";
    freezeButton.addEventListener("click", () => {
      isFrozen = !isFrozen;
      freezeButton.textContent = isFrozen ? "Unfreeze Tables" : "Freeze Tables";
    });
  
    tableContainer.appendChild(freezeButton);
  
    // Toggle visibility of canvas and table
    table.style.display = isTableView ? "block" : "none";
    canvas.style.display = isTableView ? "none" : "block";
  
    if (isTableView) {
      table.style.display = "table";
    }
  }
  
  
  
  console.log(isTableView)
  

  return (
    <div>
      <Dialog open={dialogOpen} maxWidth="mb" fullWidth={true}>
        <DialogTitle
          style={{ textAlign: "center", fontSize: "20px", fontWeight: "bold" }}
        >
          {tableId ? "Edit Table Info" : "Add Table Info"}
        </DialogTitle>
        <div
          className="container"
          style={{ padding: "20px 40px", borderRadius: "10px", margin: "20px" }}
        >
          <label>
            {" "}
            Table Number <span className="text-danger">*</span>
          </label>
          <input
            className="input_cls"
            type="text"
            placeholder="Enter table no"
            value={tabNum}
            onChange={handleTabNum}
          /> <br/>
          <label className="m-2">
            {" "}
            Table Capacity <span className="text-danger">*</span>
          </label>
          <input
            className="input_cls"
            type="number"
            value={tabCapcity}
            onChange={handleCapacity}
          />

          <span
            style={{
              display: "flex",
              justifyContent: "left",
              alignItems: "center",
              marginTop: "12px",
            }}
          >
            Available:
            <input
              type="checkbox"
              style={{
                height: "25px",
                width: "25px",
                marginLeft: "5px",
                accentColor: "#3622cc",
              }}
              checked={isAvailable}
              onChange={handleAvail}
            />
          </span>
          <label className="m-2"> Notes (optional)</label>
          <input
            className="input_cls"
            type="text"
            placeholder="Enter notes"
            value={notes}
            onChange={handleNote}
          />
<br />
          <Button
            variant="contained"
            color="error"
            style={{ margin: "15px" }}
            onClick={() => {
              setDialogOpen(false);
              setIsAvailable(false);
              setNotes("");
              setTabCapcity("");
              setTabNum("");
              setTableId("");
            }}
          >
            Close{" "}
          </Button>

          <Button
            variant="contained"
            style={{ margin: "15px" }}
            color="success"
            onClick={(e) => handleSubmit(e)}
          >
            Save
          </Button>
        </div>
      </Dialog>

      <div className="header">
        <h4>Table View</h4>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={isTableView}
                onChange={() => {
                  setIsTableView(!isTableView);
                  openCanvas();
                }}
              />
            }
            label="Table View"
          />
        </FormGroup>
        <button
          className="add_btn"
          style={{ marginRight: "50px" }}
          onClick={() => setDialogOpen(true)}
        >
          <AddIcon /> Add New
        </button>
      </div>

      <div className="category-list" style={{ padding: "20px" }}>
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Table Number</th>
              <th>Capacity</th>
              <th>Notes</th>
              <th>Status</th>
              <th>Download QR</th>
              <th colSpan="2">Action</th>
            </tr>
          </thead>
          <tbody>
            {tableData &&
              tableData.map((tabInfo, k) => (
                <tr
                  key={tabInfo.id}
                  style={{ borderBottom: "1px solid #f0eeee", margin: "5px" }}
                >
                  <td style={{ fontWeight: "bold" }}>{tabInfo.number}</td>
                  <td>{tabInfo.capacity}</td>
                  <td>{tabInfo.notes}</td>
                  <td>{tabInfo.isAvailable ? <span> <TableBarIcon style={{color:"green"}} /></span> : <RestaurantMenuIcon style={{color:"red"}}/>}</td>
                  <td align="center">
                    <div 
                      id={"qr-img~" + k}
                  
                      style={{
                        display:"none",
                        border: "2px dotted",
                        border: "2px dotted",
                        padding: "5rem",
                        margin: "5rem",
                        textAlign: "center",
                      }}
                    >
                      <QRCode
                        id="qrcode"
                        size={556}
                        style={{
                          height: "280px",
                          width: "280px",
                        }}
                        value={`https://tto.${baseURL.split('.')[1]}.${baseURL.split('.')[2]}/?merchantCode=${merchCode}&isScan=true&tableNumber=${tabInfo.number}`}
                        // viewBox={0 0 456 456}
                      />
                      <h1>{"Table #" + (k + 1)}</h1>
                    </div>

                    <IconButton
                      aria-label="download"
                      size="large"
                      color="info"
                      // style={{marginLeft:"5rem"}}
                    >
                      <DownloadIcon onClick={() => downloadQr("qr-img~" + k)} />
                    </IconButton>
                  </td>
                  <td align="center">
                    <IconButton
                      aria-label="edit"
                      size="large"
                      color="info"
                      // style={{marginLeft:"5rem"}}
                      onClick={() => handleEdit(tabInfo.id)}
                    >
                      <EditIcon />
                    </IconButton>
                  </td>
                  <td align="center">
                    <IconButton
                      aria-label="delete"
                      size="large"
                      color="error"
                      onClick={() => handleDelete(tabInfo.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableView;
