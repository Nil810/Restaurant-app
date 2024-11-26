import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import ButtonGroup from "@mui/material/ButtonGroup";
import {
  Button
} from "@mui/material";
import { useIntl } from "react-intl";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import CashPaymentDialog from './CashPaymentDialog';
import { Box } from "@mui/material";

function PaymentOptions(props) {
  const [openDialog, setOpenDialog] = React.useState(false);
  const { formatMessage: t, locale, setLocale } = useIntl();
  console.log(props.order);
  const handleNotification = () => {
    console.log(props.order);
  };
 
  return (
    <div    >
     {props.order &&<ButtonGroup aria-label="Basic button group" >
                <Button
                  variant={props.paymentIndex === 0 ? "contained" : "outlined"}
                  style={{
                    backgroundColor: props.paymentIndex === 0 ? "#F7C919" : "inherit",
                    borderColor: props.paymentIndex === 0 ? "#F7C919" : "inherit",
                    color: props.paymentIndex === 0 ? "black" : "inherit",
                    borderColor: "#F7C919",
                    cursor:"pointer"
                  }}
                  onClick={() => {
                    //props.handlePaymentClick(0);
                    props.handlePayMode("CASH");
                    setOpenDialog(true);
                  }}
                >
                      {t({ id: "cash" })}
                </Button>
                <Button
                  variant={props.paymentIndex === 1 ? "contained" : "outlined"}
                  style={{
                    backgroundColor: props.paymentIndex === 1 ? "#F7C919" : "inherit",
                    borderColor: props.paymentIndex === 1 ? "#F7C919" : "inherit",
                    color: props.paymentIndex === 1 ? "black" : "inherit",
                    borderColor: "#F7C919",
                    cursor:"pointer"
                  }}
                  disabled={!props.order}
                  onClick={() => {
                    props.handlePaymentClick(1);
                    props.handlePayMode("UPI");
                    props.closeParentDialog();
                  }}
                >
                    {t({ id: "upi" })}
                </Button>
                <Button
                  variant={props.paymentIndex === 2 ? "contained" : "outlined"}
                  style={{
                    backgroundColor: props.paymentIndex === 2 ? "#F7C919" : "inherit",
                    borderColor: props.paymentIndex === 2 ? "#F7C919" : "inherit",
                    color: props.paymentIndex === 2 ? "black" : "inherit",
                    borderColor: "#F7C919",
                    cursor:"pointer"
                  }}
                  disabled={!props.order}
                  onClick={() => {
                    props.handlePaymentClick(2);
                    props.handlePayMode("CARD");
                    props.closeParentDialog();
                  }}
                >
                  {t({ id: "card" })}
                </Button>
                <Button
                  variant={props.paymentIndex === 3 ? "contained" : "outlined"}
                  style={{
                    backgroundColor: props.paymentIndex === 3 ? "#F7C919" : "inherit",
                    borderColor: props.paymentIndex === 3 ? "#F7C919" : "inherit",
                    color: props.paymentIndex === 3 ? "black" : "inherit",
                    borderColor: "#F7C919",
                    cursor:"pointer"
                  }}
                  disabled={!props.order}
                  onClick={() => {
                    props.handlePaymentClick(3);
                    props.handlePayMode("COUPON");
                    props.closeParentDialog();
                  }}
                >
                    {t({ id: "coupouns" })}
                </Button>
              </ButtonGroup>}
          
          <Dialog
            open={openDialog}
            onClose={()=>setOpenDialog(false)}
            >
            <Box sx={{ border: 1, p: 1, bgcolor: "background.paper" }}>
            <CashPaymentDialog 
            setCashPayDialog={()=>(props.handlePaymentClick(0),setOpenDialog(false))}
            totalAmount={props.order?.totalPrice|| 0}
            />
          </Box>
          </Dialog>
    
    </div>
  );
}

export default PaymentOptions;
