// PaymentDialog.js
import React from 'react';
import { useEffect, useState } from "react";
import { Box, TextField, Button, ButtonGroup } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

const CashPaymentDialog = ({
  setCashPayDialog,
  totalAmount
}) => {

  const [cashAmount, setCashAmount] = useState(0);
  const [otherAmount, setOtherAmount] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [otherMethod, setOtherMethod] = useState(null);
  const [changeDue, setChangeDue] = useState(0);

  const handleOtherPaymentSelection = (index) => {
    setSelectedMethod(index);
  };

    const handleCashAmountChange = (e) => {
    const newCashAmount = e.target.value;
    setCashAmount(newCashAmount);
    calculateChangeDue(newCashAmount, otherAmount);
  };

  const handleOtherAmountChange = (e) => {
    const newOtherAmount = e.target.value;
    setOtherAmount(newOtherAmount);
    calculateChangeDue(cashAmount, newOtherAmount);
  };

   const calculateChangeDue = (cashAmount, otherAmount) => {
    const change = totalAmount - (parseFloat(cashAmount) || 0) - (parseFloat(otherAmount) || 0);
    setChangeDue(change.toFixed(2));
  };

  return (
      <div p={3}  >
      <DialogTitle sx={{ m: 0, p: 2 }}><b>{'Cash Change Details'}</b></DialogTitle>
        <IconButton
          aria-label="close"
          onClick={()=>setCashPayDialog(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent style={{borderTop:'1px solid #ccc', borderBottom:'1px solid #ccc',padding:'0px 20px'}}>
        <div className={'dialog-row'}>
        <label>
          Bill Amount: 
        </label>
        <h2><b>{totalAmount}</b></h2>
        </div>
        <div className={'dialog-row'}>
         <label>
           Paid by Cash: 
        </label>
        <TextField
          variant="outlined"
          type="number"
          value={cashAmount}
          onChange={handleCashAmountChange}
          style={{fontSize:'1.5em',width:"150px",padding:'5px!important',textAlign:'right'}}
        />
        </div>

        <div className={'dialog-row'} style={{marginTop:'10px'}}>
          <div>
        <label style={{width:"200px"}}>
          {"Split Paid By: "} 
        </label>
        
        <ButtonGroup>
          <Button
            variant={selectedMethod === 1 ? "contained" : "outlined"}
            onClick={() => handleOtherPaymentSelection(1)}
             style={{color:"#000"}}
          >
            UPI
          </Button>
          <Button
            variant={selectedMethod === 2 ? "contained" : "outlined"}
            onClick={() => handleOtherPaymentSelection(2)}
             style={{color:"#000"}}
          >
            Card
          </Button>
          <Button
            variant={selectedMethod === 3 ? "contained" : "outlined"}
            onClick={() => handleOtherPaymentSelection(3)}
            style={{color:"#000"}}
          >
            Coupons
          </Button>
        </ButtonGroup>
        </div>
        {selectedMethod === 1 || selectedMethod === 2 || selectedMethod === 3 ? (
          <TextField
            variant="outlined"
            type="number"
            value={otherAmount}
            onChange={handleOtherAmountChange}
             style={{fontSize:'1.5em',width:"150px",padding:'5px',textAlign:'right'}}
          />
        ) : null}
        </div>
       
        <div className={'dialog-row'}>
        <label>
          Change Due:
        </label>
        <h2 style={{color:"red"}}><b>{changeDue}</b></h2>
        </div>
      
        </DialogContent>
          <DialogActions>
        <div display="flex" justifyContent="space-between" mt={2} width="100%">
          <Button variant="outlined" color="error" onClick={()=>setCashPayDialog(false)} style={{ flex: 1, marginRight: '30px' }}>
            Cancel
          </Button>
          <Button onClick={()=>setCashPayDialog(false)} className='btnDialog-Fill' variant="contained"  style={{ flex: 1 }}>
            NEXT
          </Button>
        </div>
          </DialogActions>
      </div>
  );
};

export default CashPaymentDialog;
