import { CloudDone, Spa } from "@mui/icons-material";
import axios from "axios";
import moment from "moment";
import html2pdf from "html2pdf.js";
import { useEffect, useState } from "react";
import configs, { getParameterByName } from "../Constants";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import Currencies from "../root/currency";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import Card from "@mui/material/Card"
import { useIntl } from "react-intl";

const Reports = () => {
  const [statusType, setStatusType] = useState("inProgressOrders");
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();

  const [handleDate, setHandleDate] = useState([]);
  const [fliterData, setFilterData] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [report, setReport] = useState();
  const [todaySummary, setTodaySummary] = useState(false);
  console.log(fromDate);
  console.log(toDate);
  console.log(handleDate);
  console.log(fliterData);
  const [orderDetails, setOrderDetails] = useState();
  const [isOpen, setIsOpen] = useState(false);
  let baseURL = configs.baseURL;
  let userData = sessionStorage.getItem("userData")
    ? JSON.parse(sessionStorage.getItem("userData"))
    : "";

  const userId = userData ? userData.sub : " ";
  console.log(baseURL + "/api/orders/report/" + userId);

  let merchantData = sessionStorage.getItem("merchantData")
    ? JSON.parse(sessionStorage.getItem("merchantData"))
    : null;
  const merchCode = merchantData ? merchantData.merchantCode : "";
  useEffect(() => {
    // axios.get(baseURL+"/api/orders?userid="+userId)
    //   // .then(response => setOrderDetails(response.data))
  }, []);

  let currency = Currencies.filter(
    (curen) => curen.abbreviation == merchantData.currency
  );
  //console.log(currency)
  let SelectCurrency = currency && currency[0] ? currency[0].symbol : "";
  console.log(SelectCurrency);
  console.log(orderDetails);

  let handleData = () => {
    if (fromDate && toDate) {
      axios
        .get(
          `${baseURL}/api/orders/report/${merchCode}?start_date=${fromDate}&end_date=${toDate}`
        )
        .then((response) => {
          console.log(response.data);
          setReport(response.data);
          setFromDate();
          setToDate();
        });
    }
  };

  const orderStatus1 = (e) => {
    let status = e.target.value;
    if (status === "pending") {
      let orderItems =
        report.length && report.filter((item) => item.inProgress);
      setFilterData(orderItems);
      setIsSearch(true);
    } else if (status === "deliver") {
      let orderItems =
        report.length && report.filter((item) => item.isDelivered);
      setFilterData(orderItems);
      setIsSearch(true);
    } else if (status === "serving") {
      let orderItems = report.length && report.filter((item) => item.isReady);
      setFilterData(orderItems);
      setIsSearch(true);
    } else if (status === "cancel") {
      let orderItems =
        report.length && report.filter((item) => item.isCanceled);
      setFilterData(orderItems);
      setIsSearch(true);
    } else {
      setIsSearch(false);
    }
  };

  const downloadAsPDF = () => {
    console.log("Downloading...");
  
    const pdf = new jsPDF("p", "mm");
  
    if (todaySummary) {
      pdf.setFontSize(14);
      const todayDate = moment().format("DD-MM-YYYY");
      const yStart = 5;
      let y = yStart;
      const items = [
        `Total Orders: ${fullReports ? fullReports.length : 0}`,
        `Total Amount: ${totalAmount}`,
        `Cancelled Orders: ${cancelOrders.length}`,
        `CGST: ${cgst.toFixed(2)}`,
        `SGST: ${sgst.toFixed(2)}`,
        `POS Orders: ${eposOrders.length}`,
        `POS Amount: ${eposAmount}`,
        `SOK Orders: ${sokOrders.length}`,
        `SOK Amount: ${sokAmount}`,
        `TOK Orders: ${tokOrders.length}`,
        `TOK Amount: ${tokAmount}`,
      ];
      y += 1;
      pdf.text(`Daily Sales summary`, 14, y);
      y=y+7
      pdf.text(`Date: ${todayDate}`, 14, y);
      items.forEach((item, index) => {
        y = y + 8;
        pdf.text(item, 14, y);
      });
  
      pdf.save(`Report_${todayDate}.pdf`);
    } else {
      const rowsPerPage = 40;
      const totalRows = fullReports.length;
      let currentPage = 1;
      let yPos = 0;
      let overallRowIndex = 0;
  
      const addPage = () => {
        if (currentPage > 1) {
          pdf.addPage();
        }
        yPos = 0;
      };
  
      const tableHeader = [
        "#Token",
        "",
        "Price(Inc Tax)",
        "Time",
        "Payment",
        "More",
      ];
      addPage();
      const headerRowHeight = 30;
      tableHeader.forEach((header, index) => {
        pdf.text(header, 10 + index * 50, 10 + yPos);
      });
      yPos += headerRowHeight + 30;
  
      for (let i = 0; i < totalRows; i += rowsPerPage) {
        addPage();
        const pageRows = fullReports.slice(i, i + rowsPerPage);
        pageRows.forEach((row, rowIndex) => {
          overallRowIndex++;
          const rowData = [
            `# ${row.number}`,
            row.orderType === "Eat in" ? "Eat In" : "Take Out",
            row.discountAmount
              ? row.discountType === "price"
                ? row.totalPrice - row.discountAmount
                : row.totalPrice - (row.totalPrice * row.discountAmount) / 100
              : row.totalPrice,
            moment(`${row.createdAt}`).format("DD-MM-YYYY h:m a"),
            row.paymentType === "Pay here" ? "Online" : "Cash",
          ];
          const rowHeight = 10;
          rowData.forEach((data, colIndex) => {
            pdf.text(data.toString(), 10 + colIndex * 50, 30 + yPos);
          });
          yPos += rowHeight;
        });
        currentPage++;
      }
    }
  
    pdf.save("Report.pdf");
  };
  
  const downloadAsExcel = () => {
    console.log("Downloading as Excel...");

    const excelData = fullReports.map((row) => ({
      "Token /Tabel Number": row.number,
      "Order Type": row.orderType === "Eat in" ? "Eat In" : "Take Out",
      "Price (Inc Tax)":
        row.discountPrice === "price"
          ? row.totalPrice - row.discountAmount
          : row.totalPrice - (row.totalPrice * row.discountAmount) / 100,
      Time: moment(`${row.createdAt}`).format("DD-MM-YYYY h:m a"),
      Payment: row.paymentType === "Pay here" ? "Online" : "Cash",
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Report.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const orderListHandler = (itemId) => {
    let orderItems = report.filter((item) => item.id === itemId);
    setOrderDetails(orderItems[0]);
    setIsOpen(true);
  };

  let fullReports = isSearch ? fliterData : report;
  console.log(fullReports);

  const handleTodaysSummary = () => {
    setTodaySummary(true);
    const today = new Date();
    setFromDate(today.toISOString().split("T")[0]);
    setToDate(today.toISOString().split("T")[0]);
  };

  useEffect(() => {
    if (fromDate && toDate) {
      axios
        .get(
          `${baseURL}/api/orders/report/${merchCode}?start_date=${fromDate}&end_date=${toDate}`
        )
        .then((response) => {
          console.log(response.data);
          setReport(response.data);
        })
        .catch((error) => {
          console.error("Error fetching report data:", error);
        });
    }
  }, [fromDate, toDate, baseURL, merchCode]);
  const totalAmount = fullReports
    ? fullReports.reduce((sum, item) => sum + item.totalPrice, 0)
    : 0;
  const cancelOrders = fullReports
    ? fullReports.filter((item) => item.isCanceled === true)
    : 0;
  const cgst = totalAmount * 0.025;
  const sgst = totalAmount * 0.025;
  const eposOrders = fullReports
    ? fullReports.filter((item) => item.orderSource === "EPOS")
    : 0;
  const sokOrders = fullReports
    ? fullReports.filter((item) => item.orderSource === "Self Order")
    : 0;
  const tokOrders = fullReports
    ? fullReports.filter((item) => item.orderSource === "Table Order")
    : 0;

  const eposAmount = eposOrders
    ? eposOrders.reduce((acc, item) => acc + item.totalPrice, 0)
    : 0;
  const sokAmount = sokOrders
    ? sokOrders.reduce((acc, item) => acc + item.totalPrice, 0)
    : 0;
  const tokAmount = tokOrders
    ? tokOrders.reduce((acc, item) => acc + item.totalPrice, 0)
    : 0;
  console.log(cancelOrders);

  const { formatMessage: t, locale, setLocale } = useIntl();

  return (
    <div className="container bg-light">
      <div className="header">
        <h4 align="center">Reports</h4>
      </div>
      <div className="sub-container">
        <span className="m-3">
          <h6 style={{ margin: "7px" }}>{t({ id: "orders" })} Date</h6>
          <label htmlFor="">From:</label>
          <input
            type="date"
            className="mx-3"
            onChange={(e) => setFromDate(e.target.value)}
            style={{ border: "none", outline: "none" }}
          />
          &nbsp;&nbsp;
          <label htmlFor="">To:</label>
          <input
            type="date"
            className="mx-3"
            onChange={(e) => setToDate(e.target.value)}
            style={{ border: "none", outline: "none" }}
          />
        </span>

        <span className="m-3 ">
          <label htmlFor="">{t({ id: "orders" })} Status</label>
          <br />
          <select
            onChange={orderStatus1}
            style={{
              border: "none",
              outline: "none",
              height: "25px",
              width: "120px",
              borderRadius: "5px",
            }}
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="deliver">Delivered</option>
            <option value="serving">Serving</option>
            <option value="cancel">Cancelled</option>
          </select>
        </span>
        <Button variant="contained" color="success" onClick={handleData}>
          Search
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleTodaysSummary}
        >
          {t({ id: "todays_summary" })}
        </Button>
      </div>
      <div className="button-container">
        <select
          name=""
          id=""
          className="bg-danger text-light border border-0 rounded-2"
          style={{ height: "35px", width: "75px" }}
        >
          <option>select</option>
          <option>5</option>
          <option>10</option>
        </select>
        <span>
          <Button
            variant="contained"
            color="info"
            style={{ margin: "8px" }}
            onClick={downloadAsExcel}
          >
            Excel
          </Button>
          <Button
            variant="contained"
            color="warning"
            style={{ margin: "8px" }}
            onClick={downloadAsPDF}
          >
            Pdf
          </Button>
        </span>
      </div>
      {!todaySummary ? (
        <div id="tableReport" style={{ overflow: "scroll", height: "70VH" }}>
          <table style={{ width: "100%", fontSize: "18px" }}>
            <thead style={{ background: "#f1f1f1" }}>
              <th>#Token</th>
              <th></th>
              <th>Price(Inc Tax)</th>
              <th>Time</th>
              <th>Payment</th>
              {/* <th>Paid?</th>  */}
              {/* <th>Details</th> */}
              <th>More</th>
            </thead>
            <tbody>
              {fullReports && fullReports.length
                ? fullReports.map((items, key) => {
                    console.log(items);
                    return (
                      <>
                        <tr key={key} style={{ textAlign: "center" }}>
                          <td># {items.number}</td>
                          <td>
                            {items.orderType === "Eat in" ? (
                              <img
                                hight="20px"
                                alt=""
                                width="20px"
                                src="./images/eat_in.png"
                              />
                            ) : (
                              <img
                                hight="20px"
                                width="20px"
                                alt=""
                                src="./images/take-out-2.png"
                              />
                            )}
                          </td>
                          <td>
                            {items.discountAmount
                              ? items.discountType === "price"
                                ? items.totalPrice - items.discountAmount
                                : items.totalPrice -
                                  (items.totalPrice * items.discountAmount) /
                                    100
                              : items.totalPrice}
                          </td>
                          <td style={{ fontSize: "12px" }}>
                            {moment(`${items.createdAt}`).format(
                              "DD-MM-YYYY h:m a"
                            )}
                          </td>
                          <td>
                            {items.paymentType === "Pay here"
                              ? "Online"
                              : "Cash"}
                          </td>

                          <td>
                            <button
                              className="btn"
                              id="show_btn"
                              onClick={() => orderListHandler(items.id)}
                            >
                              <ReceiptLongOutlinedIcon />
                            </button>
                          </td>
                          <td></td>
                        </tr>
                      </>
                    );
                  })
                : ""}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <h3>{t({ id: "todays_report" })}</h3>
          <Card
          id="card"
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
    padding: "20px",
    width: "fit-content",
    border: "1px solid #ddd",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  }}
>
  <span>{t({ id: "daily_summary" })}</span>
  <span>{fromDate}</span>
  <span style={{ display: "flex", justifyContent: "space-between", width: "200px" }}>
    <span>{t({ id: "total_orders" })}:</span> 
    <span>{fullReports ? fullReports.length : 0}</span>
  </span>
  <span style={{ display: "flex", justifyContent: "space-between", width: "200px" }}>
    <span>{t({ id: "total_ammount" })}:</span> 
    <span>{totalAmount}</span>
  </span>
  {/* <span style={{ display: "flex", justifyContent: "space-between", width: "200px" }}>
    <span>Cancel Orders:</span> 
    <span>{cancelOrders.length > 0 ? cancelOrders : 0}</span>
  </span> */}
  <span style={{ display: "flex", justifyContent: "space-between", width: "200px" }}>
    <span>CGST:</span> 
    <span>{cgst.toFixed(2)}</span>
  </span>
  <span style={{ display: "flex", justifyContent: "space-between", width: "200px" }}>
    <span>SGST :</span> 
    <span>{sgst.toFixed(2)}</span>
  </span>
  <span style={{ display: "flex", justifyContent: "space-between", width: "200px" }}>
    <span>POS {t({ id: "orders" })}:</span> 
    <span>{eposOrders.length}</span>
  </span>
  <span style={{ display: "flex", justifyContent: "space-between", width: "200px" }}>
    <span>POS {t({ id: "ammount" })}:</span> 
    <span>{eposAmount}</span>
  </span>
  <span style={{ display: "flex", justifyContent: "space-between", width: "200px" }}>
    <span>SOK {t({ id: "orders" })}:</span> 
    <span>{sokOrders.length}</span>
  </span>
  <span style={{ display: "flex", justifyContent: "space-between", width: "200px" }}>
    <span>SOK {t({ id: "ammount" })}:</span> 
    <span>{sokAmount}</span>
  </span>
  <span style={{ display: "flex", justifyContent: "space-between", width: "200px" }}>
    <span>TOK {t({ id: "orders" })}:</span> 
    <span>{tokOrders.length}</span>
  </span>
  <span style={{ display: "flex", justifyContent: "space-between", width: "200px" }}>
    <span>TOK {t({ id: "ammount" })}:</span> 
    <span>{tokAmount}</span>
  </span>
</Card>

        </>
      )}
      <Dialog
        className="dialog-box"
        maxWidth="md"
        fullWidth={true}
        open={isOpen}
      >
        <div style={{ padding: "20px" }} className="order-tab">
          <h5 align="center">
            Order summary token : #
            <span style={{ fontSize: "35px" }}>
              {orderDetails && orderDetails.number}
            </span>
          </h5>

          <table style={{ width: "100%", textAlign: "center" }} border="1">
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails &&
                orderDetails.orderItems.map((orderItems) => (
                  <tr>
                    <td>{orderItems.name}</td>
                    <td>{orderItems.quantity}</td>
                    <td>{orderItems.price}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          <Button
            variant="contained"
            color="error"
            style={{ float: "right", margin: "9px" }}
            onClick={() => setIsOpen(false)}
          >
            Close
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default Reports;

// http://localhost:3000/orderList?serve_url=https://apps.digitallive24.com&userid=625ed8a6f5b364ec758c1f0b
{
  /* <thead>
              <tr>
                <th>Resturants</th>
                <th>Date</th>
                <th>Invoice No</th>
                <th>Total no of bills</th>
                <th>My Amount</th>
                <th>Total Discount</th>
                <th>Net Sales()</th>
                <th>Total tax</th>
                <th>Total Sales</th>
                <th>Cash</th>
                <th>Card</th>
              </tr>
            </thead> */
}
