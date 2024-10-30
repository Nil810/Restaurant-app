import React from "react";
import { useEffect, useState } from "react";
import axios, { formToJSON } from "axios";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import configs, { getParameterByName } from "../Constants";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box } from "@mui/material";
import ButtonGroup from "@mui/material/ButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Snackbar from "@mui/material/Snackbar";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import { useIntl } from "react-intl";
import Typography from "@mui/material/Typography";
import Currencies from "../root/currency";

import TableBarIcon from "@mui/icons-material/TableBar";
import Chip from "@mui/material/Chip";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { Alert } from "@mui/material";

import html2pdf from "html2pdf.js";

import {
  CardActionArea,
  CardContent,
  CardMedia,
  Button,
  Slide,
  Card,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import BillPrint from "./BillPrint";
import PaymentOptions from "./sub_comp/PaymentOptions";

const Epos = (props) => {
  const [order, setOrder] = useState();
  const [popUpOpen, setPopUpOpen] = useState(false);
  const closeModal = () => setPopUpOpen(false);
  const [totalProducts, setTotalProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openPhone, setOpenPhone] = useState(false);
  const [cashPayDialog, setCashPayDialog] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectPro, setSelectPro] = useState();
  const [proOpen, setProOpen] = useState(false);
  const [holdOpen, setHoldOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [filterPro, setFilterPro] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [orderItem, setOrderItem] = useState([]);
  const [variety, setVariety] = useState([]);
  const [cookInst, setCookInst] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDiscountMethod, setSelectedDiscountMethod] = useState("");
  const [price, setPrice] = useState("");
  const [percent, setPercent] = useState(0);
  const [catProducts, setCatProducts] = useState([]);
  const [catId, setCatId] = useState("");
  const [isPayment, setIsPayment] = useState(false);
  const [placeOrder, setPlaceOrder] = useState(true);
  const [procheckbox, setProCheckBox] = useState([]);
  const [addons, setAddons] = useState([]);
  const [addonsGroup, setAddonsGroup] = useState([]);
  const [totalAddons, setTotalAddons] = useState([]);
  const [addOnOrders, setAddOnOrders] = useState([]);
  const [cookalignment, setCookAlignment] = useState([]);
  const [custId, setCustId] = useState("");
  const [alignment, setAlignment] = useState("left");
  const [selectedVar, setSelectedVar] = useState({});
  const [addonvalue, setAddonValue] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selAdons, setSelAdons] = useState([]);
  const [invoiceId, setInvoiceId] = useState("1");
  const [dialogStep, setDialogStep] = useState(1);
  const [invoiceNo, setInvoiceNo] = useState(new Date().getTime());
  const [showProducts, setShowProducts] = useState(true);
  const [showOrders, setShowOrders] = useState(false);
  const [qRPath, setQRPath] = useState("");
  const [paymentAndBillDialog, setPaymentAndBillDialog] = useState(false);
  const [customerDetail, setCustomerDetail] = useState(false);
  const [tableDetail, setTableDetail] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(false);
  const [discValue, setDiscValue] = useState(0);
  const [isleftAlign, setIsLeftAign] = useState(false);
  const [mobileNo, setMoblileNo] = useState("");
  const [containedIndex, setContainedIndex] = useState(0);
  const [paymentIndex, setPaymentIndex] = useState(1);
  const [existingData, setExistingData] = useState({});
  const [isCustomerFound, setIsCustomerFound] = useState(true);
  const [billPrint, setBillPrint] = useState(false);
  const [phnumber, setPhnumber] = useState(
    existingData ? existingData.phoneNo : 0
  );
  const [selectedCat, setSelectedCat] = useState("");
  const [name, setName] = useState(existingData ? existingData.Name : "");
  const [email, setEmail] = useState(existingData ? existingData.Email : "");
  const [customInstr, setCustomInstr]= useState("")
  const [address, setAddress] = useState(
    existingData ? existingData.Address : ""
  );
  const [tableData, setTableData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [ordId, setOrdId] = useState("");
  const { formatMessage: t, locale, setLocale } = useIntl();
  let authApi = configs.authapi;
  const handleTableChange = (event) => {
    setSelectedTable(event.target.value);
    let tabId = tableData.filter((tab) => tab.number === event.target.value);
    console.log(tabId);
    localStorage.setItem("tableId", tabId[0].id);
  };

  const handleDiscountMethodSelect = (event) => {
    setSelectedDiscountMethod(event.target.value);
    console.log(event.target.value);
    // setIsDropdownOpen(false)
  };
  const randomNumber = Math.floor(Math.random() * 1000000000);
  const customerID = custId
    ? custId.toString()
    : mobileNo
      ? mobileNo
      : randomNumber.toString();

  const handleClose = () => {
    setAnchorEl(false);
  };

  let cmsUrl = `${configs.cmsUrl}?token=${sessionStorage.getItem("token")}`;
  const handledisc = () => {
    setIsDropdownOpen(true);
  };

  const handleAlignment = (event, newAlignment) => {
    let newVar={};
    newVar[newAlignment] = variety[newAlignment];
    setSelectedVar(newVar);
  };

  const handleCookAlignment = (newAlignment) => {
    let updateCookInst = [...cookalignment];
    if(cookalignment.indexOf(newAlignment) == -1){
      updateCookInst.push(newAlignment);
    }else{
      updateCookInst.splice(updateCookInst.indexOf(newAlignment),1);
    }
    setCookAlignment(updateCookInst);
  };

  let cat = categories;

  const adAddons = (e, itemId, index,pi) => {
    let AoIndx = -1;
    let newAdOns =[...selAdons]; 
    newAdOns.map((ao, i) => {return ao.id == itemId?AoIndx=i:false});
    console.log(AoIndx);
    if(AoIndx != -1){
      newAdOns.splice(AoIndx,1);
    }else{
      newAdOns.push(pi);
    }
    setSelAdons(newAdOns);
  };

  let baseURL = configs.baseURL;

  const removeAddons = (itemId) => {
    console.log(itemId);
  };
  let userToken = sessionStorage.getItem("token")
    ? sessionStorage.getItem("token")
    : "";
  const handleOrder = () => {
    //document.getElementById('bar').style.display='none';
    setShowOrders(true);
    setShowProducts(false);
  };
  let userData = sessionStorage.getItem("userData")
    ? JSON.parse(sessionStorage.getItem("userData"))
    : "";
  console.log(userData);

  let merchantData = sessionStorage.getItem("merchantData")
    ? JSON.parse(sessionStorage.getItem("merchantData"))
    : null;
  console.log(merchantData);
   merchantData.taxPerc = merchantData.taxPerc|| merchantData.takeAwayTax;
    
  if(containedIndex==1){
      merchantData.taxPerc = merchantData.dineinTax;
    }

  const merchCode = merchantData ? merchantData.merchantCode : "";
  useEffect(() => {
    setIsLeftAign(merchantData.isLeftAlign);
  }, [merchantData]);

  if (document.getElementById("navBar")) {
    document.getElementById("navBar").style.display = "flex";
  }
  let currency = Currencies.filter(
    (curen) => curen.abbreviation == merchantData.currency
  );
  //console.log(currency)
  let SelectCurrency = currency && currency[0] ? currency[0].symbol : "";
  console.log(SelectCurrency);

  const userId = userData ? userData.sub : " ";
  const getCatByUser = `${baseURL}/api/categories?merchantCode=${merchCode}`;
  const getProductByUser = baseURL + `/api/products?merchantCode=${merchCode}`;
  const getLatestInvoiceNumber =
    configs.payServer + `/api/invoice/latest/${userId}`;

  let orderDet = JSON.parse(localStorage.getItem("newOrder"));

  const selectedCurrency = (
    <span dangerouslySetInnerHTML={{ __html: SelectCurrency }} />
  );
  console.log(selectedCurrency);

  function summaryPath1(orderDetails) {
    console.log(orderDetails);
    const fullName = userData ? userData.name : "";

    if (orderDetails) {
      window.location.href = `${window.location.origin
        }/billPrint?serve_url=${baseURL}&orderId=${orderDetails ? orderDetails.id : ""
        }&merchantCode=${merchCode ? merchCode : ""}&currency=${currency.length && currency[0].abbreviation
        }&restaurant=${fullName}&address=${userData || merchantData ? merchantData.address || userData.address : ""
        }&cgst=${merchantData.taxPerc}&invoice_no=${invoiceNo}`;
    }
  }

  let orderData = {
    orderId: orderDet ? orderDet.id : "",
    merchantCode: merchCode ? merchCode : "",
    currency: currency.length && currency[0].abbreviation,
    restaurant: merchantData ? merchantData.firstName : "",
    address:
      userData || merchantData ? merchantData.address || userData.address : "",
    cgst: merchantData.taxPerc,
    taxPerc:merchantData.taxPerc,
    invoice_no: invoiceNo,
  };
  useEffect(() => {
    if (!categories.length) {
      axios.get(getCatByUser).then((response) => {
        //console.log(response.data);
        setCategories(response.data);
      });
    }
  }, []);

  //console.log(categories)
  useEffect(() => {
    axios.get(getProductByUser).then((response) => {
      let orderableCats=[];
      categories.map(ct=> {if(ct.isOrderableAlone || !ct.isAddOn){
        orderableCats.push(ct.id);
    }});
      let orderableItems = response.data.filter(itm => orderableCats.indexOf(itm.category) != -1)
      setTotalProducts(response.data);
      setProducts(orderableItems);

      let addons = [];
      categories.map((c) => {
        if (c.isAddOn) {
          addons.push(c.id);
        }
      });
      setAddonsGroup(
        response.data.filter((pro) => addons.indexOf(pro.category) != -1)
      );
    });
  }, [categories]);

  const handleTableDetail = () => {
    setTableDetail(true);
  };
  const handleCustomerDetail = () => {
    setCustomerDetail(true);
  };
  const cancelCustomer = () => {
    setCustomerDetail(false);
  };
  const cancelTable = () => {
    setTableDetail(false);
  };

  const addPrductToOrder = (p) => {
    console.log(p);
    console.log(orderItem);

    p.quantity = 1;
    let orders = orderItem && orderItem.length ? orderItem : [];
    orders.push(JSON.parse(JSON.stringify(p)));
    console.log("final order", orders);
    setOrderItem(orders);
    updateOrderDetails(orders);
    // }
  };

  const handleProduct = (p) => {
    console.log(p);
    setBillPrint(false);
    if (p.isPriceVariety || p.add_ons || p.cookInstructions) {
      setIsOpen(true);
      setSelectedVar({});
      setCookAlignment([]);
      setVariety(p && p.varietyPrices ? JSON.parse(p.varietyPrices) : {});
      setCookInst(p && p.cookInstructions ? p.cookInstructions.split(",") : []);

      const paddon = p.add_ons.split(",").filter((a) => a.length);
      let addName = addonsGroup.filter((li) => paddon.indexOf(li.id) != -1);
      setAddons(addName);
      setProCheckBox([]);
      setSelAdons([]);
      setSelectedProduct(p);

    } else {
      addPrductToOrder(p);
    }
  };
  const handleMobileSubmit = () => {
    if (phnumber) {
      // createNewOrder()

      if (existingData != {} && custId != "") {
        axios
          .put(`${authApi}/customer/${custId}`, {
            phone: phnumber,
            firstName: name,
            address: address,
          })
          .then((res) => {
            console.log(res.data);
            setOpenPhone(false);
          });
      } else {
        let data = {
          email: `${phnumber}@menulive.in`,
          phone: phnumber,
          firstName: name,
          lastName: "",
          address: address,
          password: phnumber,
          isEmailVerified: false,
          isPhoneVerified: false,
          referenceDetails: "",
          merchantCode: merchCode,
        };
        axios
          .post(
            `${authApi}/customer/auth-and-register`,
            { ...data }
          )
          .then((res) => {
            setCustId(res.data.user.id);
            console.log(res.data);
          });
        setOpenPhone(false);
      }
    }
  };

  const showVarietyBtn = (variety) => {
    if(!Object.keys(variety).length) return;
     let selectedVarArr =Object.keys(selectedVar);
  let selVarArr = selectedVarArr.length?selectedVarArr:
  handleAlignment('',Object.keys(variety)[0])
  console.log(selVarArr)
    return (
      <ToggleButtonGroup
        value={selVarArr}
        onChange={handleAlignment}
        exclusive
        aria-label="text alignment"
        style={{ backgroundColor: "white", overflow: "auto" }}
      >
        {Object.keys(variety).map((key, index) => (
          <ToggleButton
            style={{ display: "inline-block", padding: "none !important" }}
            value={key}
            aria-label="left aligned"
          >
            <div style={{ display: "block", width: "100%" }}>{key}</div>
            <div
              style={{ color: "#000", fontWeight: "bold", fontSize: "1.2em" }}
            >
              {selectedCurrency}
              {+variety[key]}
            </div>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    );
  };
  const showinstructionBtn = () => {
    return (
      <div>
      <ToggleButtonGroup
        value={cookalignment}
        exclusive
        aria-label="text alignment"
        style={{ backgroundColor: "white" }}
      >
        {cookInst.map((key, index) => (
          <ToggleButton
            style={{ display: "inline-block", padding: "none !important" }}
            value={key}
             onClick={()=>handleCookAlignment(key)}
            aria-label="left aligned"
          >
            <div style={{ display: "block", width: "100%" }}>{key}</div>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <div style={{padding:"10px 50px"}}>
 <TextField
              className="notes"
              type="text"
              variant="outlined"
              min={1}
              style={{fontSize:'1.2em'}}
              value={customInstr}
              onChange={(e)=>setCustomInstr(e.target.value)}
              fullWidth={true}
              placeholder={t({ id: "add_custom_notes" })}
            />
      </div>
      </div>
    );
  };

  const nextHandler = () => {
  
    selectedProduct.sub_pro = {};
   
      //Set price if variety price availabe
    let varName = Object.keys(selectedVar);
    selectedProduct.price = varName.length
      ? parseFloat(variety[varName[0]])
      : selectedProduct.price;
      selectedProduct.sub_pro.addons = [...selAdons];
      selectedProduct.sub_pro.variety = selectedVar;
      selectedProduct.sub_pro.cookInstructions = cookalignment;
      if(customInstr){
        selectedProduct.sub_pro.cookInstructions.push(customInstr);
      }
      addPrductToOrder(selectedProduct);

      addOnOrders.map((a) => addPrductToOrder(a));
 

    setIsOpen(false);
    setAddons([]);
    setSelAdons([]);
    setSelectedProduct();
  };

  const updateOrderDetails = (newOrderItem) => {
    console.log(newOrderItem);
    console.log(orderItem);
    let orderItems = (newOrderItem || orderItem).map((x) => {
      if (!x.quantity) {
        x.quantity = 1;
        
      }
    let addonsPrice =(x.sub_pro && x.sub_pro.addons
            ? x.sub_pro.addons.reduce((acc, val) => acc + val.price, 0)
            : 0)
      x.totalPrice = (x.price+addonsPrice) * x.quantity;
      return x;
    });
    const itemsCount = orderItems.reduce((a, c) => a + c.quantity, 0);
    setItemCount(itemsCount);
    const itemsPrice = orderItems.reduce((a, c) => a + c.totalPrice, 0);
    let txPerc = merchantData.taxPerc|| merchantData.takeAwayTax;
     let orderType="Take Away";
    if(containedIndex==1){
      txPerc = merchantData.dineinTax;
      orderType="Eat In";
    }
    console.log('----------',txPerc);
    const taxPrice = 
      txPerc
        ? ((txPerc / 100) * itemsPrice * 100) / 100
      : 0;
    
    let totalPrice = parseFloat(itemsPrice + taxPrice).toFixed(2);

    if(merchantData.isItemInclusiveTax){
        totalPrice = parseFloat(itemsPrice).toFixed(2);
    }

    

    console.log(taxPrice);
    const setpro = [addons];
    console.log(selectedDiscountMethod);
    console.log(discValue);
   

    let order = {
      number: 0,
      isPaid: false,
      isReady: false,
      inProgress: true,
      isCanceled: false,
      isDelivered: false,
      orderType: orderType,
      customerId: customerID,
      orderSource: "EPOS",
      paymentType: "At Counter",
      payGateOrderId: "",
      currency: currency[0].abbreviation,
      set_pro: setpro,
      orderStatus: "NEW", //ACCEPTED, REJECTED
      totalPrice: totalPrice,
      taxPrice: taxPrice,
      discountType: selectedDiscountMethod,
      discountAmount: parseFloat(discValue),
      orderItems: orderItems,
      userId: merchCode,
    };
    setOrder(order);
  };

  useEffect(() => {
    if (orderItem && orderItem.length) {
      updateOrderDetails();
    }
  }, [orderItem, containedIndex, discValue, percent]);

  let productItems = isSearch ? filterPro : products;

  const handleAdd = (indx) => {
    order.orderItems[indx].quantity += 1;
    // let item = order.orderItems[indx].map(x => {
    //   if ((x._id ? x._id : x.id) === itemId) {
    //     x.quantity = x.quantity + 1;
    //     subPro.quantity += 1
    //   }
    //   return x
    // });
    setOrderItem(order.orderItems);
  };
  console.log(order);

  const handleRemove = (indx) => {
    console.log("index" + indx);
    let ord = order;
    console.log(ord);
    ord.orderItems[indx].quantity = ord.orderItems[indx].quantity - 1;

    console.log(ord.orderItems);
    let items = ord.orderItems.filter((x) => x.quantity !== 0);
    console.log(items);
    ord.orderItems = items;
    ord.totalPrice = 0;
    ord.taxPrice = 0;
    items.length >= 0 ? setOrderItem(items) : setOrder(ord);
    // setOrderItem(items);
    setPrice();
    setPercent();
    setItemCount(items.length);
  };

  const deleteItem = (itemId) => {
    // myArray.shift();
    if (order.orderItems.length === 1) {
      let ord = order;
      let item = ord.orderItems.filter((item, i) => i !== 0);
      ord.totalPrice = 0;
      ord.taxPrice = 0;
      ord.orderItems = item;
      setOrder(ord);
      setOrderItem(item);
    } else {
      let item = order.orderItems.filter((x) => x._id !== itemId);
      setOrderItem(item);
    }
  };
  const handleSearch = (e) => {
    let val = e.target.value;
    let fltData = totalProducts.filter(
      (pro) => pro.name.toLowerCase().indexOf(val.toLowerCase()) !== -1
    );
    setFilterPro(fltData);
    setIsSearch(val ? true : false);
  };

  useEffect(() => {
    axios({
      method: "get",
      url: `${authApi}/customer?merchantCode=${merchCode}`,
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((res) => {
      console.log(res.data);
      setCustomerData(res.data);
    });
  }, []);

  const handleSearchCustomer = () => {
    const customer = customerData.find(
      (customer) =>
        customer.phnumber === phnumber ||
        customer.email === email ||
        customer.name === name
    );
    if (customer) {
      setIsCustomerFound(true);
      console.log("Customer found:", customer);
      setName(customer.firstName);
      setEmail(customer.email);
      setPhnumber(customer.phone);
    } else {
      setIsCustomerFound(false);
      alert("Customer not found");
      return <Alert severity="error">Customer not found</Alert>;
    }
  };
  const handleAddCustomer = () => {
    if (phnumber) {
      // createNewOrder()

      if (existingData != {} && custId != "") {
        axios
          .put(`${authApi}/customer/${custId}`, {
            phone: phnumber,
            firstName: name,
            email: email,
          })
          .then((res) => {
            console.log(res.data);
            setOpenPhone(false);
          });
      } else {
        let data = {
          email: email,
          phone: phnumber,
          firstName: name,
          lastName: "",
          address: "",
          password: phnumber,
          isEmailVerified: false,
          isPhoneVerified: false,
          referenceDetails: "",
          merchantCode: merchCode,
        };
        axios
          .post(
            `${authApi}/customer/auth-and-register`,
            { ...data }
          )
          .then((res) => {
            setCustId(res.data.user.id);
            console.log(res.data);
          });
        setOpenPhone(false);
      }
    }
  };
  const handleCancle = () => {
    setOrderItem([]);
    setOrder();
    setPrice();
    setPercent();
    setIsPayment(false);
    setPlaceOrder(true);
    setDialogStep(1);
    setIsDropdownOpen(false);
    setSelectedDiscountMethod("");
  };

  const imageOnErrorHandler = (event) => {
    event.currentTarget.src = "./images/blank.jpg";
  };
  const catPath = `/categories`;
  const varPath = `/varieties`;
  const orderListPath = `/orderList`;
  const productPath = `/productDetails`;
  const tabPath = `/table`;
  const reportsPath = `/reports`;
  const settingPath = "/setting";
  const handleCancel = () => {
    setOpenPhone(false);
    setBillPrint(false);
  };


  const createOrder = (e, isOrder, isSaveOrder) => {
    if (!order) return;
    if (containedIndex == 1) {
      console.log(containedIndex);
      let tabId = localStorage.getItem("tableId");
      order.orderType = "Eat In";
      order.number = selectedTable;
      order.customerId = selectedTable;
      order.isPaid = isSaveOrder ? false : true;
      order.isDelivered = order.isPaid;
      order.tableId = tabId;
      const tabupdate = tableData.filter((tab) => tab.number === selectedTable);
      console.log(tabupdate);
      if (tabupdate.length > 0) {
        tabupdate[0].isAvailable = false;
      }
      if (tabupdate.length > 0 && !isSaveOrder) {
        tabupdate[0].isAvailable = true;
      }
      if (tabupdate.length > 0) {
        axios
          .put(
            `${baseURL}/api/tables/${tabupdate[0].id}?merchantCode=${merchantData ? merchantData.merchantCode : " "
            }`,
            tabupdate[0]
          )
          .then((res) => {
            console.log(res.data);
          });
        setMoblileNo("");
        setSelectedTable("");
      }
    } else if (containedIndex === 2) {
      order.orderType = "Delivery";
    } else if (containedIndex === 0) {
      order.orderType = "Take Away";
      order.isPaid = true;
    }
    order.orderItems = order.orderItems.map((it) => {
      console.log(it.sub_pro);
      let item = {
        _id: it._id,
        quantity: it.quantity,

        price:
          it.price +
          (it.sub_pro && it.sub_pro.addons
            ? it.sub_pro.addons.reduce((acc, val) => acc + val.price, 0)
            : 0),
        name: it.name,
        sub_pro: JSON.stringify(it.sub_pro),
      };
      if (order.isDelivered) {
        item.status = "delivered";
      }
      return item;
    });
    console.log(order);
    console.log(order.totalPrice);
    if (ordId) {
      console.log(ordId);
      console.log(order.totalPrice);
      const updateOrder = async () => {
        try {
          await axios.put(
            `${baseURL}/api/orders/${ordId}?userId=${merchantData ? merchantData.merchantCode : " "
            }`,
            order
          );
          console.log("Order updated successfully.");
        } catch (error) {
          console.error("Error updating order:", error);
        }
      };

      updateOrder();
    } else {
      console.log(order);
      order.discountType = selectedDiscountMethod;
      order.discountAmount = parseFloat(discValue);
      axios
        .post(
          `${baseURL}/api/orders?userId=${merchantData ? merchantData.merchantCode : " "
          }`,
          order
        )
        .then((res) => {
          setOrdId(res.data.id);
          console.log(res.data);
          setSnackbarOpen(true);
          setOrderItem();
          setOrder();
          localStorage.setItem("newOrder", JSON.stringify(res.data));
          if (!isOrder) {
            // if (!PrintInterface) {
            if (!window.PrintInterface) {
              //console.log(window.PrintInterface);
              sessionStorage.setItem("billing", true);
              summaryPath1(res.data);
            } else {
              setBillPrint(true);
              setOrdId("");
              localStorage.setItem("isPrintCall", "N");
            }
          }
          let billData = {};
          billData.userId = merchantData.merchantCode;
          billData.appName = "EPOS";
          billData.payType = "onetime";
          billData.payStatus = "paid";
          billData.purchaseItems = JSON.stringify(order.orderItems);

          axios
            .post(`${configs.payUrl}/api/new-order`, billData)
            .then((res) => {
              console.log(res.data.invoiceData);
              setInvoiceNo(res.data.invoiceData.invoicePath);
            });
        });
    }
    console.log(isOrder);
    setOrderItem();
    setOrder();
    setShowOrders(false);
    setShowProducts(true);
    setItemCount(0);
    setOrdId();
    // sessionStorage.setItem("billing", true);
    // summaryPath1();
    setPrice();
    setPercent();
    setDialogStep(3);
  };

  const handleHold = () => {
    if (containedIndex === 1 && mobileNo) {
      let data = {
        email: `${mobileNo}@menulive.in`,
        phone: mobileNo,
        firstName: name ? name : "No Name",
        lastName: "",
        address: address,
        password: mobileNo,
        isEmailVerified: false,
        isPhoneVerified: false,
        referenceDetails: "",
        merchantCode: merchCode,
      };
      axios
        .post(`${authApi}/customer/auth-and-register`, {
          ...data,
        })
        .then((res) => {
          console.log(res.data);
          setCustId(res.data.user.id);
        });
    }
    console.log(order);

    if (order) {
      console.log(order);
      console.log(discValue);
      order.discountType = selectedDiscountMethod;
      order.discountAmount = parseFloat(discValue);
      let orderOnHold = localStorage.getItem("orderOnHold");
      const timestamp = new Date().toLocaleString();
      order.timestamp = timestamp;
      if (containedIndex === 1 && selectedTable != "") {
        console.log(tableData);
        tableData.isAvailable = "false";
        let isOrderwithPrint = true;
        createOrder(null, isOrderwithPrint, true);
      }
      if (orderOnHold) {
        orderOnHold = JSON.parse(orderOnHold);
        orderOnHold.push(order);
        localStorage.setItem("orderOnHold", JSON.stringify(orderOnHold));
      } else {
        localStorage.setItem("orderOnHold", JSON.stringify([order]));
      }

      setOrderItem([]);
      setOrder();
      setPrice();
      setPercent();
      setIsPayment(false);
      setPlaceOrder(true);
      setDialogStep(1);
      setIsDropdownOpen(false);
      setSelectedDiscountMethod("");
      setCustomInstr("");
      setSelectedVar({});

    } else {
      alert("Please Add An Order");
    }
  };


  useEffect(() => {
    if (containedIndex === 1) {
      axios
        .get(`${baseURL}/api/tables?merchantCode=${merchCode}`)
        .then((res) => {
          setTableData(res.data.filter((tab) => tab.isAvailable === true));
        });
    }
  }, [containedIndex === 1]);

  const handlepostResume = (customerId, tabNumber) => {
    const orderResume = JSON.parse(localStorage.getItem("orderOnHold"));
    const ppostResume = orderResume.find(
      (ordRes) => ordRes.customerId === customerId
    );
    console.log(ppostResume);
    const index = orderResume.findIndex(
      (ordRes) => ordRes.customerId === customerId
    );

    if (ppostResume && index !== -1) {
      setOrder(ppostResume);
      setOrderItem(ppostResume.orderItems);
      setSelectedTable(tabNumber);
      orderResume.splice(index, 1);
      localStorage.setItem("orderOnHold", JSON.stringify(orderResume));
      setHoldOpen(false);
    } else {
      console.error("Unable to find order for user:", userId);
    }
  };

  const handleCancelord = (customerId) => {
    const orderResume = JSON.parse(localStorage.getItem("orderOnHold"));

    const index = orderResume.findIndex(
      (ordRes) => ordRes.customerId === customerId
    );

    if (index !== -1) {
      orderResume.splice(index, 1);
      localStorage.setItem("orderOnHold", JSON.stringify(orderResume));
      setHoldOpen(false);
    } else {
      console.error("Order not found for customerId:", customerId);
    }
  };

  const handleResume = () => {
    console.log("resume");
    setHoldOpen(true);
  };

  const categoryClickHandler = (catName, catId, isAddOn) => {
    let prodAsPerCat = totalProducts.filter((p) => p.category == catId);
    setProducts(prodAsPerCat);
    setSelectedCat(catId);
  };

  const handleItem = () => { };

  const cancleOrder = () => {
    setIsPayment(false);
    // setPlaceOrder(false)
    //setPlaceOrder(true);
    setOrderItem([]);
    setBillPrint(false);
    setOrder();
    // setDialogStep(1);
    window.location.href = "/epos";
  };

  const handleBack = () => {
    document.getElementById("bar").style.display = "flex";
    setShowOrders(false);
    setBillPrint(false);
    setShowProducts(true);
  };
  const handlePayMode = (mode) => {
    let ord = order;
    ord.paymentState = "PAID";
    ord.isPaid = true;
    ord.payVia = mode;
    setOrder(ord);
  };
 
  const closeHandler = () => {
    setIsOpen(false);
    setDialogStep(1);
    setIsDropdownOpen(false);
    setSelectedDiscountMethod("");
  };
  const handlediscsubmit = () => {
    const valuedisc = parseFloat(discValue);
    console.log(selectedDiscountMethod);
    if (selectedDiscountMethod === "percentage") {
      const taxPrice = order.totalPrice * (valuedisc / 100);
      const percent = order.totalPrice - taxPrice;
      console.log(percent);
      setPercent(percent);
    } else {
      const discValue = order.totalPrice - valuedisc;
      setPrice(discValue);
      console.log(order.totalPrice);
    }

    setIsDropdownOpen(false);
  };

  const showCategories = () => {
    return (
      <div>
        <div className={"cat_cont"}>
          <div className={!selectedCat?"chip selected-chip":"chip"} onClick={handleAllCategory}>
            All{" "}
          </div>

          {cat &&
            cat.filter(ct=> ct.isOrderableAlone || !ct.isAddOn).map((category) => {
              let cId = category._id || category.id;
              return (
                <div
                  onClick={() =>
                    categoryClickHandler(category.name, cId, category.isAddOn)
                  }
                >
                  <div className={category.id== selectedCat?"chip selected-chip":"chip"}>{category.name}</div>
                </div>
              );
            })}
        </div>
      </div>
    );
  };

  window.onafterprint = () => {
    setPaymentAndBillDialog(false);
    //setShowBillBtn(false);
  };

  const handleEdit = () => {
    setOpenPhone(true);
    setExistingData({
      phoneNo: phnumber,
      Name: name,
      Address: address,
    });
  };
  console.log(order);

  const handleAllCategory = () => {
    setProducts(products);
    setSelectedCat("");
  };
 
  const showdialogForAddons = () => {
    let adonsCats = categories.filter(cat => selectedProduct.add_ons.indexOf(cat.id) != -1);
    return (
      <Box className="boxdialog">
        <Dialog
          onClose={closeHandler}
          aria-labelledby="max-width-dialog-title"
          open={isOpen}
          fullWidth={true}
        >
          <div id="dbox">
            <h2 style={{ textAlign: "center" }}>{selectedProduct.name}</h2>
            <Box id="adionorder" style={{ margin: "10px" }}>
              {variety && Object.keys(variety).length?<h4 style={{ textAlign: "center" }}>{"SELECT SIZE"}</h4>:""}
              <div style={{ textAlign: "center", fontWeight: "bold" }}>
                {showVarietyBtn(variety)}
              </div>
              
       
              {adonsCats.length?
                adonsCats.map((aoCat, i) => (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignContent: "center",
                      padding: "3px 15px",
                      fontSize: "20px",
                      flexWrap: "wrap",
                      marginBottom:"20px"
                    }}
                  >
                    <h3 style={{width:"100%",margin:"5px",textAlign:'center',color:"#fff"}}><b> {aoCat.name}</b></h3>
                    <div className='textsmall_b' >{'(Min. '+aoCat.minAddOnAllowed+ ', Max '+aoCat.maxAddOnAllowed+')'}</div>
                    {totalProducts.filter(aopi=> aopi.category== aoCat.id).map(pi => <div className="chip-select" style={{backgroundColor:procheckbox[i]?'#0cb600':"#c6c2c2"}}>
                       <Checkbox
                          id={`checkboxId-${i}`}
                          checked={procheckbox[i]}
                          onChange={(e) =>
                            adAddons(e, pi.id, i,pi)
                          }
                        />
                      <span> {pi.name} </span>
                      <b style={{fontSize:'0.7em',color:'#fff'}}>
                        {selectedCurrency} {pi.price}
                      </b>
                      
                    </div>
                    )}


                  </div>
                ))
                : ""}

              <h4 style={{ textAlign: "center" }}>
                 {t({ id: "select_cook_instruction" })}
              </h4>
              <div style={{ textAlign: "center", fontWeight: "bold",marginBottom:"20px" }}>
                {showinstructionBtn(cookInst)}
              </div>

              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Button
                  variant="contained"
                  id="btn_cancel"
                  onClick={closeHandler}
                >
                  {t({ id: "cancel" })}
                </Button>
                <Button variant="contained" id="btnAdd" onClick={nextHandler}>
                 {t({ id: "Next" })}
                </Button>
              </Box>
            </Box>
          </div>
        </Dialog>
      </Box>
    );
  };
  const handleClick = (index) => {
    setContainedIndex(index);
   // updateOrderDetails();
  };

  

  const handlePaymentClick = (index) => {
    setPaymentIndex(index);
  };

  const handleTakeAway = () => { };
  const handleDineIn = () => { };
  const handleDelivery = () => {
    setOpenPhone(true);
  };
  console.log(order);
  const showOrdersItems = () => {
    return (
      <div className="pos_container" style={{ background: "#fff" }}>
        <div className="items">
          <div className="content">
            <div style={{ textAlign: "center" }}>
              <ButtonGroup aria-label="Basic button group">
                <Button
                  variant={containedIndex === 0 ? "contained" : "outlined"}
                  style={{
                    backgroundColor:
                      containedIndex === 0 ? "#F7C919" : "inherit",
                    borderColor: containedIndex === 0 ? "#F7C919" : "inherit",
                    color: containedIndex === 0 ? "black" : "inherit",
                    borderColor: "#F7C919",
                  }}
                  onClick={() => {
                    handleClick(0);
                    handleTakeAway();
                  }}
                >
                 {t({ id: "take_away" })}
                </Button>
                <Button
                  variant={containedIndex === 1 ? "contained" : "outlined"}
                  style={{
                    backgroundColor:
                      containedIndex === 1 ? "#F7C919" : "inherit",
                    borderColor: containedIndex === 1 ? "#F7C919" : "inherit",
                    color: containedIndex === 1 ? "black" : "inherit",
                    borderColor: "#F7C919",
                  }}
                  onClick={() => {
                    handleClick(1);
                    handleDineIn();
                  }}
                >
                  {t({ id: "dine_in" })}
                </Button>
                <Button
                  variant={containedIndex === 2 ? "contained" : "outlined"}
                  style={{
                    backgroundColor:
                      containedIndex === 2 ? "#F7C919" : "inherit",
                    borderColor: containedIndex === 2 ? "#F7C919" : "inherit",
                    color: containedIndex === 2 ? "black" : "inherit",
                    borderColor: "#F7C919",
                  }}
                  onClick={() => {
                    handleClick(2);
                    handleDelivery();
                  }}
                >
                   {t({ id: "delivery" })}
                </Button>
              </ButtonGroup>
              <Dialog
                aria-labelledby="max-width-dialog-title"
                style={{ backgroundColor: "#fff !important" }}
                open={openPhone}
                fullWidth={true}
                maxWidth="xs"
              // className='Orderp'
              >
                <DialogTitle id="titorder">
                  <b>Enter Customer Details</b>
                </DialogTitle>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    margin: "10px",
                  }}
                >
                  <label>Enter Mobile Number</label>
                  <input
                    type="number"
                    placeholder="Enter Mobile"
                    onChange={(e) => setPhnumber(e.target.value)}
                    value={phnumber}
                    className="number_input"
                    pattern="[1-9]{1}[0-9]{9}"
                    style={{ border: "none", padding: "10px" }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    margin: "10px",
                  }}
                >
                  <label>Enter Email</label>
                  <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ border: "none", padding: "10px" }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    margin: "10px",
                  }}
                >
                  <label>Enter Name</label>
                  <input
                    type="text"
                    placeholder="Enter Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ border: "none", padding: "10px" }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    padding: "10px",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleCancel}
                  >
                    Close
                  </Button>

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSearchCustomer}
                  >
                    Search
                  </Button>

                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleAddCustomer}
                  >
                    Add
                  </Button>
                </div>
              </Dialog>
            </div>

            <div>
              <ArrowBackIcon onClick={handleBack} id="back" />
              <table
                align="center"
                id="pos-items"
                cellPadding="5px"
                style={{ width: "100%" }}
              >
                <thead>
                  <tr>
                    <th>ITEM</th>
                    <th>{t({ id: "price" })}</th>
                    <th style={{ width: "120px", textAlign: "center" }}>
                      QNT.
                    </th>
                    <th>{t({ id: "total" })}</th>
                  </tr>
                </thead>
                <tbody>
                  {order
                    ? order.orderItems.map((item, indx) => {
                      const subProArray = item.sub_pro;
                      console.log(subProArray);
                      const subProNames =
                        subProArray && subProArray.addons
                          ? subProArray.addons.map((subPro) => subPro.name)
                          : [];
                      const subVariety = subProArray
                        ? subProArray.variety
                        : "";
                      console.log(order);
                      console.log(subVariety);
                      return (
                        <>
                          <tr>
                            <td>
                              {" "}
                              <b>{item.name}</b> <br />{" "}
                              {subProNames.length > 0 ? (
                                <Chip
                                  label={subProNames.join(",").toUpperCase()}
                                  color="primary"
                                  style={{
                                    marginLeft: "10px",
                                    fontSize: "10px",
                                    fontWeight: "bold",
                                  }}
                                />
                              ) : (
                                subProNames
                              )}{" "}
                              {subProArray&&subProArray.cookInstructions && subProArray.cookInstructions.length ? (
                                <Chip
                                  label={subProArray.cookInstructions.join(',').toUpperCase()}
                                  color="primary"
                                  style={{
                                    marginLeft: "10px",
                                    fontSize: "8px",
                                    fontWeight: "bold",
                                  }}
                                />
                              ) : (
                                ""
                              )}
                              {subVariety ? (
                                <Chip
                                  label={Object.keys(subVariety).join(',').toUpperCase()}
                                  color="primary"
                                  style={{
                                    marginLeft: "10px",
                                    fontSize: "10px",
                                    fontWeight: "bold",
                                  }}
                                />
                              ) : (
                                ""
                              )}
                            </td>
                            <td>
                              {selectedCurrency}
                              {item.price +
                                (subProArray && subProArray.addons
                                  ? subProArray.addons.reduce(
                                    (acc, val) => acc + val.price,
                                    0
                                  )
                                  : 0)}
                            </td>
                            <td>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <button
                                  className="add_btn"
                                  onClick={() => handleRemove(indx)}
                                >
                                  <RemoveIcon />
                                </button>
                                <span style={{ margin: "0px 8px" }}>
                                  {item.quantity}
                                </span>
                                <button
                                  className="add_btn"
                                  onClick={() => handleAdd(indx)}
                                >
                                  <AddIcon />
                                </button>
                              </div>
                            </td>
                            <td>
                              {selectedCurrency}
                              {item.quantity *
                                (item.price +
                                  (subProArray && subProArray.addons
                                    ? subProArray.addons.reduce(
                                      (acc, val) => acc + val.price,
                                      0
                                    )
                                    : 0))}
                            </td>
                            {false && (
                              <td>
                                <IconButton
                                  aria-label="delete"
                                  size="small"
                                  color="error"
                                  onClick={() => deleteItem(item._id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </td>
                            )}
                          </tr>
                        </>
                      );
                    })
                    : ""}

                  <tr>
                    <td colSpan="3" align="left" style={{ color: "#81ed40" }}>
                    {t({ id: "sub_total" })}
                    </td>
                    <td>
                      <b>
                        {order ? (order.totalPrice - order.taxPrice).toFixed(2) : ""}
                      </b>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3" style={{ color: "#81ed40" }} align="left">
                    {t({ id: "tax" })}
                    </td>
                    <td>
                      {selectedCurrency}{" "}
                      {order ? order.taxPrice.toFixed(2) : " "}
                    </td>
                  </tr>
                  <tr
                    style={
                      price || percent
                        ? { display: " table-row" }
                        : { display: "none" }
                    }
                  >
                    <td style={{ color: "#aa3c06" }} colSpan="3" align="left">
                    {t({ id: "discount" })}
                    </td>
                    <td>
                      {"- "}{" "}
                      {price ? discValue : percent ? discValue + "%" : ""}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{ color: "#81ed40", fontSize: "1.2em" }}
                      colSpan="2"
                      align="left"
                    >
                      <b>{t({ id: "total" })}</b>
                    </td>
                    <td colSpan="2" align="right">
                      <b style={{ fontSize: "1.6em" }}>
                        {selectedCurrency}{" "}
                        {price || percent
                          ? price || percent
                          : order
                            ? order.totalPrice
                            : ""}
                      </b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {order && order.totalPrice && (
              <Button
                variant="outlined"
                className="btn-border"
                id="discbtn"
                onClick={handledisc}
              >
                {t({ id: "discount" })}
              </Button>
            )}
            <div id="disc">
              {isDropdownOpen && (
                <div id="sel1">
                  <div>
                    <Button
                      onClick={(event) => handleDiscountMethodSelect(event)}
                      variant="outlined"
                      value="percentage"
                    >
                      Percent(%)
                    </Button>
                    <Button
                      onClick={(event) => handleDiscountMethodSelect(event)}
                      variant="outlined"
                      value="price"
                    >
                      {"Fix( " + merchantData.currency + " )"}
                    </Button>
                    {false && (
                      <Button
                        onClick={handleDiscountMethodSelect}
                        variant="outlined"
                        value="coupon"
                      >
                        Coupon
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div>
              {selectedDiscountMethod && (
                <div style={{ display: "inline-block" }}>
                  <TextField
                    id="discval"
                    size="small"
                    variant="outlined"
                    type="number"
                    value={discValue}
                    onChange={(e) => setDiscValue(e.target.value)}
                    style={{
                      display: "inline-block",
                      borderRadius: "10px",
                      width: "150px",
                      backgroundColor: "#577283",
                    }}
                  />

                  <Button
                    variant="contained"
                    color="success"
                    style={
                      selectedDiscountMethod
                        ? { display: "inline-block", marginLeft: "10px" }
                        : { display: "none" }
                    }
                    onClick={handlediscsubmit}
                  >
                    {t({ id: "apply" })}
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div
            className="footer"
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <div>
              
              <PaymentOptions handlePaymentClick={handlePaymentClick} handlePayMode={handlePayMode} paymentIndex={paymentIndex} order={order}/>

            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "17px",
              }}
            >
              <CancelIcon onClick={handleCancle} color="error" />
              <Button
                variant="outlined"
                className="btn-border"
                onClick={handleResume}
              >
                   {t({ id: "resume" })}
              </Button>
              <Button
                variant="outlined"
                className="btn-border"
                onClick={handleHold}
                disabled={!order}
              >
                {t({ id: "save" })}
              </Button>
              <Button
                variant="contained"
                disabled={!order}
                id="btn"
                onClick={createOrder}
              >
                 {t({ id: "finish_order" })}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const showProductsCard = () => {
    return (
      <div className="product_container">
        {productItems.length ? (
          productItems.map((p) => {
            return (
              <>
                <Card onClick={() => handleProduct(p)} className="product">
                  <CardActionArea
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      flexWrap: "wrap",
                    }}
                  >
                    <CardMedia
                      component="img"
                      alt={p.name}
                      onError={imageOnErrorHandler}
                      image={`${baseURL}/` + p.image}
                      className="img-product"
                    />
                    
                    <CardContent className="cardFooter">
                      <Box className="foot">
                        <Typography variant="h6" component="p" className="txtf">
                          {p.name}
                        </Typography>
                        <b style={{fontSize:"0.7em"}}>{selectedCurrency} {p.price}</b>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </>
            );
          })
        ) : (
          <h5 className="text-danger">{"No Item Found"}</h5>
        )}
      </div>
    );
  };
  console.log(isleftAlign);
  const orderHold = localStorage.getItem("orderOnHold");
  const orderHoldData = orderHold ? JSON.parse(orderHold) : "";
  console.log(orderHoldData);
  console.log(billPrint);
  return (
    <div
      className="main_po"
      style={
        isleftAlign
          ? { flexDirection: "row-reverse" }
          : { flexDirection: "row" }
      }
    >
      <div style={{ display: "inline-block" }} className="orderlist">
        {showOrdersItems()}
        <style>
          {`
                @media (orientation: portrait) {
                    .orderlist {
                        display: ${showOrders ? "block !important" : "none !important"
            };
                    }
                }
                `}
        </style>
      </div>
      {billPrint && (
        <BillPrint orderDetails={orderData} setBillPrint={setBillPrint} />
      )}

      <div
        style={showProducts ? { display: "inline-block" } : { display: "none" }}
        className="productslist"
      >
        {showCategories()}

        <div
          style={{
            display: "flex",
            marginTop: "10px",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "inline-block",
              marginLeft: "10px",
              width: "50%",
            }}
          >
            <Button
              onClick={handleCustomerDetail}
              id="butt"
              style={
                containedIndex === 0
                  ? { display: "flex", fontSize: "10px" }
                  : { display: "none" }
              }
            >
              <PermContactCalendarIcon />
              <span> {t({ id: "customer" })}</span>
            </Button>
          </div>
          <div
            style={
              containedIndex === 1
                ? {
                  display: "inline-block",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                }
                : { display: "none", marginLeft: "10px" }
            }
          >
            <span
              style={
                selectedTable
                  ? { display: "block", fontSize: "10px" }
                  : { display: "none" }
              }
            >
              {t({ id: "table_number" })} {selectedTable}
            </span>
            <Button onClick={handleTableDetail} id="butt">
              <TableBarIcon />
              <span style={{ fontSize: "10px" }}>Table</span>
            </Button>
          </div>
          <div
            style={
              containedIndex === 2
                ? { display: "inline-block", marginLeft: "10px" }
                : { display: "none", marginLeft: "10px" }
            }
          >
            <Button color="success" onClick={handleEdit}>
              Edit Customer Info
            </Button>
          </div>

          <div className="search">
            <SearchIcon />
            <input
              type="text"
              className="search_input"
              placeholder="Search Item"
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className="products-epos-list">{showProductsCard()}</div>
      </div>
      <span id="bar" onClick={handleOrder}>
        <span className="cart_count">{itemCount}</span>
        <ShoppingBagIcon sx={{ cursor: "pointer", color: "white" }} />
      </span>
      {selectedProduct && showdialogForAddons()}

      <Dialog open={customerDetail} style={{zIndex:2132321, width: "50% !important" }}>
        
        <div>
        
        {customerDetail && <div style={{padding:'20px'}}>
        <header><h3>{'Customer Details'}</h3></header>
          <input
            type="text"
            placeholder="Customer"
            onChange={(e) => setMoblileNo(e.target.value)}
            value={mobileNo || name}
            style={{
              display: "block",
              backgroundColor: "white",
              border: "1px solid #ccc",
              padding: "5px",
              borderRadius: "20px",
            }}
          />
           <footer style={{ margin: "10px", textAlign: "end" }}>
          <Button
            variant="contained"
            className={"btnDialog-Fill"}
            onClick={() => {
              cancelCustomer();
            }}
          >
            {"Ok"}
          </Button>
        </footer>
          </div>
        }
        </div>
       
      </Dialog>

      <Dialog open={tableDetail} style={{ width: "50% !important" }}>
        <div style={{ textAlign: "center", padding: "10px" }}>
          {tableData.length ? (
            <ul id="ul-list">
              {tableData.map((tab) => (
                <li key={tab.number}>
                  <input
                    type="radio"
                    name="tableSelection"
                    value={tab.number}
                    onChange={handleTableChange}
                  />
                  {`Table Number ${tab.number}`}
                </li>
              ))}
            </ul>
          ) : (
            ""
          )}
        </div>

        <div style={{ margin: "10px", textAlign: "end" }}>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              cancelTable();
            }}
          >
            {"Select"}
          </Button>
        </div>
      </Dialog>

      <Dialog
        onClose={() => setProOpen(false)}
        open={proOpen}
        maxWidth="xs"
        fullWidth={true}
      >
        <div style={{ padding: "0px", height: "100%" }}>
          {selectPro ? (
            <div className="pro_item">
              <img
                src={
                  selectPro.image === ""
                    ? "../images/blank.jpeg"
                    : baseURL + "/" + selectPro.image
                }
                onError={imageOnErrorHandler}
                style={{ width: "100%", height: "150px", borderRadius: "8px" }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  fontSize: "20px",
                }}
              >
                <h5>{selectPro.name}</h5>
                <span>
                  {SelectCurrency}
                  {selectPro.price}
                </span>
              </div>
            </div>
          ) : (
            ""
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <button
              className="btn btn-danger btn-small m-2"
              onClick={() => {
                setSelectPro();
                setProOpen(false);
              }}
            >
              {"Close"}
            </button>
            <button className="btn btn-info btn-small m-2" onClick={handleItem}>
              {"Add"}
            </button>
          </div>
        </div>
      </Dialog>

      <Dialog
        onClose={() => setHoldOpen(false)}
        open={holdOpen}
        maxWidth="xs"
        fullWidth={true}
      >
        <div style={{ padding: "0px", height: "100%" }}>
          <h4 style={{ margin: "10px", textAlign: "center" }}>
            {" "}
            ORDERS ON HOLD
          </h4>
          {orderHold && orderHoldData && orderHoldData.length
            ? orderHoldData.map((ordHold) => (
              <div className="pro_item" key={ordHold.userId}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    fontSize: "20px",
                  }}
                >
                  <span>{ordHold.customerId}</span>
                  <span>
                    {selectedCurrency}
                    {ordHold.discountType === "price"
                      ? ordHold.totalPrice - ordHold.discountAmount
                      : ordHold.totalPrice -
                      (ordHold.totalPrice * ordHold.discountAmount) / 100}
                  </span>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleCancelord(ordHold.customerId)}
                  >
                    X
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() =>
                      handlepostResume(ordHold.customerId, ordHold.number)
                    }
                  >
                    {t({ id: "resume" })}
                  </Button>

                  <br />
                </div>
                <span style={{ fontSize: "small" }}>{ordHold.timestamp}</span>
              </div>
            ))
            : ""}
        </div>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        message="Order Added Successfully!"
      />
    </div>
  );
};

export default Epos;
