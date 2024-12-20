import React, { useState, useEffect } from "react";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import configs, { getParameterByName } from "../Constants";
import { json } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TablePagination from "@mui/material/TablePagination";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-responsive-list";
import "react-responsive-list/assets/index.css";
import Box from "@mui/material/Box";
import { FormControlLabel } from "@mui/material";
import Gallery from "./Gallery";
function FoodDescription() {
  const [addonsGroup, setAddonsGroup] = useState([]);
  const [categories, setCategories] = useState([]);
  const [foodName, setFoodName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [price, setPrice] = useState(0);
  const [calorie, setCalorie] = useState(0);
  const [inStock, setInstock] = useState(true);
  const [description, setDescription] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [categoryType, setCategoryType] = useState("");
  const [variety, setVariety] = useState(false);
  const [option, setOption] = useState([]);
  // console.log(description);
  const [hideProductList, setHideProductList] = useState(false);
  const [selectProductId, setSelectProductId] = useState(0);
  const [hideEdit, setHideEdit] = useState(false);
  // console.log(selectProductId);
  const [products, setProducts] = useState([]);
  const [catItem, setCatItem] = useState();
  const [catType, setCatType] = useState();
  const [proStack, setProStack] = useState();
  // console.log(catItem);
  const [catId, setCatId] = useState(0);
  const [tags, setTags] = useState();
  const [cooktags, setCookTags] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterPro, setFilterPro] = useState([]);
  const [addOn, setAddOn] = useState([]);
  const [select, setSelect] = useState("");
  const [pricevalues, SetPriceValues] = useState({});
  const [selOption, setSeloption] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(7);
  const [image, setImage] = useState(false);
  const [optMap, setOptMap] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddon, setShowAddon] = useState(false);
  console.log(pricevalues);
  //add by sk
  const [selectedCategory, setSelectedCategory] = useState("");
  console.log("selected category------------", selectedCategory);
  let baseURL = configs.baseURL;

  const [userInfo, setUserInfo] = useState([]);
  const [showGallery, setShowGallery] = useState(false);
  const handleSelectedImage = (image) => {
    setSelectedImage(image);
  };
  const handleGallery = () => {
    setSearchQuery(foodName);
    setShowGallery(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleSubmitImage = () => {
    if (selectedImage) {
      console.log("Selected Image:", selectedImage);
      // Perform any other actions with the selected image
    } else {
      console.error("No image selected!");
    }
    setShowGallery(false); // Close the dialog after submission
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const removeTags = (indexToRemove) => {
    setCookTags([...cooktags.filter((_, index) => index !== indexToRemove)]);
  };
  const addTags = (event) => {
    if (event.target.value !== "") {
      setCookTags([...cooktags, event.target.value]);
      //props.selectedTags([...tags, event.target.value]);
      event.target.value = "";
    }
  };
  let userData = sessionStorage.getItem("userData")
    ? JSON.parse(sessionStorage.getItem("userData"))
    : "";
  console.log(userData);

  let merchantData = sessionStorage.getItem("merchantData")
    ? JSON.parse(sessionStorage.getItem("merchantData"))
    : null;
  const merchCode = merchantData ? merchantData.merchantCode : "";

  console.log(baseURL + "/api/products");
  let cur = merchantData ? merchantData.currency : "";
  let SelectCurrency = cur.toUpperCase() === "INR" ? "₹" : "$";

  const userId = userData ? userData.sub : " ";
  const getCatByUser = `${baseURL}/api/categories?merchantCode=${merchCode}`;
  const getProductByUser = baseURL + `/api/products?merchantCode=${merchCode}`;
  const getVariety = baseURL + `/api/varieties?merchantCode=${merchCode}`;

  const handleCategoryType = (event) => {
    console.log(event.target.value);
    setCategoryType(event.target.value);
  };

  const handleFoodNameChange = (event) => {
    setFoodName(event.target.value);
  };
  const handleChangeVariety = (e) => {
    setVariety(e.target.checked);
    axios.get(getVariety).then((response) => {
      console.log(response.data);
      setOption(response.data);
    });
  };
  useEffect(() => {
    if (variety) {
      axios.get(getVariety).then((response) => {
        console.log(response.data);
        setOption(response.data);
      });
    }
  }, [variety]);

  console.log(select);
  const handleSelectChange = (e) => {
    setSelect(e.target.value);

    let opt = option.filter((opt) => opt.id === select);
    console.log(opt);
    let optmap = opt.map((optmap, index) => optmap.items.split(","));
    console.log(optmap);
    optmap.map((items, index) => {
      let obj = {};
      items.forEach((item) => {
        obj[item] = "";
      });
      console.log(obj);
    });
  };

  useEffect(() => {
    const opt = option.filter((opt) => opt.id === select);
    console.log(opt);
    setOptMap(opt.map((optmap, index) => optmap.items.split(",")));
  }, [option, select]);

  const handleInputChange = (e) => {
    var formData = new FormData();
    let file = e.target.files[0];
    console.log(e.target);
    console.log(file);
    let fileName = "pro_" + new Date().getTime() + file.name;

    formData.append("uploader", file, fileName);
    let postQueriesUrl = baseURL + "/api/upload/INVENTORY_ITEM";
    axios.post(postQueriesUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setImageURL("app-uploads/customers/inventories/" + fileName);

    //setImageURL(file);
  };

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };

  const handleCalorieChange = (event) => {
    setCalorie(event.target.value);
  };

  const handleInStockChange = (event) => {
    setInstock(event.target.value);
    console.log(event.target.value);
  };

  const handleTagsChange = (event) => {
    setTags(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  // const handleAddOns=(event)=>{
  //   setAddOn(event.target.value);
  // }
  let catAddongrp;
  if (categories.length) {
    catAddongrp = [...categories, ...addonsGroup];
  }
  console.log(catAddongrp);

  const handleClose = () => {
    setHideProductList(false);
    setHideEdit(false);
    setInstock("");
    setCalorie("");
    setFoodName("");
    setDescription("");
    setPrice("");
    setVariety(false);
    setSelect("");
    SetPriceValues("");
    setInstock("");
    setTags("");
    setCookTags("");
    setImageURL("");
    setAddOn([]);
    setCatType("");
    setCatItem("");
    setProStack("");
    setSelectProductId("");
  };

  const setTextValue = (value, item) => {
    SetPriceValues((prevValues) => ({
      ...prevValues,
      [item]: value,
    }));
  };
  console.log(pricevalues);
  console.log(catType);
  const handleSubmit = (event) => {
    event.preventDefault();
    // setHideProductList(false);
    console.log(pricevalues);
    console.log(
      `Food name: ${foodName},image:${imageURL}, cat_type:${categoryType},category:${catId},Description: ${description}, Price: ${price}, Calorie: ${calorie}, InStock:${inStock},Tags:${tags}`
    );
    console.log(cooktags);
    if (!foodName || !catId) {
      console.log("error");
      let cat_type = document.getElementsByClassName("category");
      cat_type[0].style.borderColor = "red";

      let fname = document.getElementsByClassName("name");
      fname[0].innerHTML = "required";
      fname[1].style.borderColor = "red";
    } else if (selectProductId) {
      console.log(cooktags.length ? cooktags.join(",") : "");
      console.log(imageURL);
      axios
        .put(baseURL + "/api/products/" + selectProductId, {
          cat_type: categoryType,
          category: catId,
          name: foodName,
          description: description,
          image:
            selectedImage && selectedImage.image
              ? selectedImage.image
              : imageURL,
          isPriceVariety: variety,
          varietyGroupId: select.toString(),
          varietyPrices: JSON.stringify(pricevalues),
          cookInstructions: cooktags.length ? cooktags.join(",") : "",
          price: price,
          calorie: calorie,
          inStock: inStock,
          id: selectProductId,
          tags: tags,
          add_ons: addOn.length ? addOn.join(",") : "",
          userId: userId,
        })
        .then((response) => {
          console.log(response.data);
          axios.get(`${getProductByUser}`).then((response) => {
            console.log(response.data);
            setProducts(response.data);
          });
        });
      setHideProductList(false);
      setHideEdit(false);
    } else {
      axios
        .post(baseURL + "/api/products", {
          cat_type: categoryType,
          category: catId,
          name: foodName,
          description: description,
          image: imageURL != "" ? imageURL : selectedImage.image,
          price: price,
          isPriceVariety: variety,
          varietyGroupId: select,
          varietyPrices: JSON.stringify(pricevalues),
          calorie: calorie,
          inStock: inStock ? inStock : false,
          tags: tags,
          cookInstructions: cooktags.length ? cooktags.join(",") : "",
          add_ons: addOn.length ? addOn.join(",") : "",
          userId: userId,
        })
        .then((response) => {
          console.log(response.data);
          axios.get(`${getProductByUser}`).then((response) => {
            console.log(response.data);
            setProducts(response.data);
          });
        });
      setHideProductList(false);
      setHideEdit(false);
    }

    setCookTags("");
    setSelectedImage();
    setTags("");
    setInstock("");
    setCatId("");
    setCalorie("");
    setFoodName("");
    setDescription("");
    setPrice("");
    setVariety(false);
    setSelect("");
    SetPriceValues("");
    setInstock("");
    setImageURL("");
    setCookTags([]);
    setAddOn([]);
    setCatType("");
    setProStack("");
    setCatItem("");
    setSelectProductId("");
  };
  useEffect(() => {
    console.log(categories);

    if (!categories.length) {
      axios.get(getCatByUser).then((response) => {
        console.log(response.data);
        if (response.data.length !== categories.length) {
          setCategories(response.data);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (!products.length) {
      getProductsList();
    }
  });

  const getProductsList = () => {
    axios.get(getProductByUser).then((response) => {
      if (response.data) {
        console.log(response.data);
        setProducts(response.data);
        let addons = [];
        addons = categories.filter((c) => c.isAddOn);
        let addIds = addons.map((a) => a.id);
        console.log(addIds);
        setAddonsGroup(
          response.data.filter((pro) => addIds.indexOf(pro.category) !== -1)
        );
      }
    });
  };
  console.log(addonsGroup);
  const handleCategoryId = (event, catId) => {
    let selectCatId = event?.target?.value || catId;
    setCatId(selectCatId);
    setCatItem(selectCatId);
    //console.log(event.target.value);
    console.log(categories);
    let addonsval = categories.filter((addcat) => addcat.isAddOn === true);
    //console.log(addonsval,event.target.value)
    let addvalue = addonsval.filter((addonval) => addonval.id === selectCatId);
    console.log(addvalue);
    if (addvalue.length > 0) {
      setShowAddon(false);
    } else {
      setShowAddon(true);
    }
  };
  console.log(addonsGroup);
  const handleUpload = () => {
    setImage(true);
  };
  const handleDelete = (id) => {
    console.log(id);
    axios.delete(baseURL + "/api/products/" + id).then((response) => {
      getProductsList();
    });
  };

  const handleEdit = (
    pro_id,
    pro_image,
    pro_category,
    proCat_type,
    pro_stock
  ) => {
    console.log(pro_image);
    console.log(pro_id);
    setHideEdit(true);
    setCatItem(pro_category);
    setCatType(proCat_type);
    setProStack(pro_stock);

    setSelectProductId(pro_id);
    if (pro_image) {
      setImageURL(pro_image);
    } else {
      setImageURL(imageURL);
    }
    axios.get(getVariety).then((response) => {
      console.log(response.data);
      setSeloption(response.data);
    });

    const prodata = products.filter((pro) => pro.id === pro_id);

    setFoodName(prodata[0].name);
    setDescription(prodata[0].description);
    setVariety(prodata[0].isPriceVariety);
    if (prodata[0].isPriceVariety) {
      setSelect(prodata[0].varietyGroupId);
      SetPriceValues(JSON.parse(prodata[0].varietyPrices));
    }
    setPrice(prodata[0].price);
    setInstock(prodata[0].inStock);
    setCalorie(prodata[0].calorie);
    setTags(prodata[0].tags);
    setCookTags(
      prodata[0].cookInstructions ? prodata[0].cookInstructions.split(",") : []
    );

    console.log(prodata[0]);
    setCatId(prodata[0].category);
    setAddOn(prodata[0].add_ons.split(",").filter((a) => a.length));
    handleCategoryId(null, prodata[0].category);
  };

  const handleStocks = (prod) => {
    console.log(prod);
    axios
      .put(baseURL + "/api/products/" + prod.id, {
        cat_type: prod.cat_type,
        category: prod.category,
        name: prod.name,
        description: prod.description,
        image: prod.image,
        price: prod.price,
        calorie: prod.calorie,
        inStock: prod.inStock ? false : true,
        id: prod.id,
        tags: prod.tags,
        add_ons: prod.add_ons,
        userId: prod.userId,
      })
      .then((response) => {
        getProductsList();
      });
  };
  const filterProducts = (event) => {
    let fname = event.target.value;
    console.log(fname);
    let filter = products.filter(
      (li) => li.name.toLowerCase().indexOf(fname.toLowerCase()) !== -1
    );
    console.log(filter);
    setFilterOpen(fname ? true : false);
    setFilterPro(fname ? filter : []);
  };

  const removeAddons = (indexToRemove) => {
    setAddOn([...addOn.filter((_, index) => index !== indexToRemove)]);
  };
  const handleAddOns = (event) => {
    let val = event.target.value;
    if (val) {
      let existItem = addOn.filter((x) => x === val);
      const items = existItem.length
        ? addOn.map((x) => (x === existItem[0] ? val : x))
        : [...addOn, val];
      console.log(event.target.value);
      setAddOn(items);
    }
  };
  let cat_ad = [];

  if (categories && products) {
    console.log(categories, products);
    let adFilter = categories.filter((cat) => cat.isAddOn);
    console.log(adFilter);
    let addPro = products.filter((pro) =>
      adFilter.filter((li) => {
        if (li.id === pro.category) {
          cat_ad.push(pro);
        }
      })
    );
  }

  console.log(select.length);
  const imageOnErrorHandler = (event) => {
    event.currentTarget.src = "./images/blank.jpeg";
  };

  let catAddon = categories;
  let prod = filterOpen ? (filterPro.length ? filterPro : "") : products;
  console.log(catId);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };
  return (
    <>
      <div className="container">
        <div className="header">
          <h4 className="">Items</h4>
          <div className="search">
            <SearchIcon />
            <input
              type="text"
              onChange={filterProducts}
              placeholder="Enter Name"
              style={{
                border: "none",
                outline: "none",
                width: "87%",
                backgroundColor: "transparent",
              }}
            />
          </div>

          {/* add by sk */}
          <div>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                id="category-select"
                value={selectedCategory}
                label="Category"
                 size="small"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.name}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          {merchCode && !merchCode.activeProviderId ? (
            <button
              className="add_btn"
              onClick={() => setHideProductList(true)}
            >
              <AddIcon /> Add New
            </button>
          ) : (
            <span></span>
          )}
        </div>

        <Dialog
          open={hideProductList || hideEdit}
          maxWidth="lg"
          fullWidth={true}
        >
          <div className="dialogTitle">
            <DialogTitle style={{ textAlign: "center", fontWeight: "bold" }}>
              {hideEdit ? "Edit Products" : "Add Products"}
            </DialogTitle>
          </div>

          <div>
            {hideProductList || hideEdit ? (
              <>
                <form
                  style={{
                    padding: "18px",
                    paddingLeft: "18px",
                    paddingTop: "50px",
                  }}
                >
                  <FormControl sx={{ m: 1, minWidth: 150 }}>
                    <InputLabel id="demo-simple-select-helper-label">
                      Category
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-helper-label"
                      id="demo-simple-select-helper"
                      label="Category"
                      value={catId}
                      onChange={(e) => handleCategoryId(e)}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {catAddon &&
                        catAddon.length &&
                        catAddon.map((cat) => (
                          <MenuItem
                            key={cat.id}
                            value={cat.id}
                            selected={catItem === cat.id}
                          >
                            {cat.name}
                            {cat.isAddOn ? (
                              <span
                                className="MuiChip-filledError MuiChip-filled"
                                style={{
                                  padding: "3px 7px",
                                  marginLeft: "5px",
                                }}
                              >
                                {"ADD-ON"}
                              </span>
                            ) : (
                              ""
                            )}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                  <br />
                  <div className="row">
                    <div className="col">
                      <Box
                        sx={{
                          width: 500,
                          maxWidth: "100%",
                        }}
                        noValidate
                        autoComplete="off"
                      >
                        <TextField
                          fullWidth
                          id="fullWidth"
                          label="Name"
                          defaultValue=""
                          onChange={handleFoodNameChange}
                          name="foodname"
                          value={foodName}
                        />
                      </Box>
                    </div>

                    <div className="col">
                      <Box
                        sx={{
                          width: 500,
                          maxWidth: "100%",
                        }}
                        noValidate
                        autoComplete="off"
                      >
                        <div>
                          <TextField
                            fullWidth
                            id="fullWidth"
                            label="Description"
                            defaultValue=""
                            onChange={handleDescriptionChange}
                            name="description"
                            value={description}
                          />
                        </div>
                      </Box>
                    </div>
                  </div>
                  <br />
                  <div className="row dialog-row">
                    <label>Item Image </label>
                    <div className="col">
                      <Box
                        sx={{
                          width: 500,
                          maxWidth: "100%",
                        }}
                        noValidate
                        autoComplete="off"
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginLeft: "10px",
                          }}
                        >
                          <Button variant="contained" onClick={handleGallery}>
                            Add From Gallery
                          </Button>
                          <Button variant="outlined" onClick={handleUpload}>
                            Upload New
                          </Button>
                        </div>
                      </Box>
                      <span style={{ fontSize: "1rem" }}>
                        {selectedImage ? selectedImage.name : ""}
                      </span>
                    </div>
                    <div
                      className="col"
                      style={image ? { display: "block" } : { display: "none" }}
                    >
                      <Box
                        sx={{
                          width: 500,
                          maxWidth: "100%",
                        }}
                        noValidate
                        autoComplete="off"
                      >
                        <TextField
                          fullWidth
                          id="fullWidth"
                          label=""
                          defaultValue=""
                          onChange={handleInputChange}
                          type="file"
                          name="image"
                        />
                      </Box>
                    </div>
                  </div>
                  <br />
                  <div className="dialog-row">
                    <label
                      style={{ marginTop: "8px", marginLeft: "10px" }}
                      htmlFor=""
                    >
                      Price{" "}
                    </label>{" "}
                    <br />
                    <label
                      style={{ marginTop: "8px", marginLeft: "10px" }}
                      htmlFor=""
                    >
                      Has Varieties ?
                    </label>
                    <input
                      onChange={handleChangeVariety}
                      type="checkbox"
                      name="variety"
                      style={{
                        height: "25px",
                        width: "25px",
                        marginLeft: "5px",
                        cursor: "pointer",
                        accentColor: "rgb(54, 34, 204)",
                      }}
                      checked={variety}
                    />
                    <div
                      id="vgroup"
                      style={{
                        display: variety ? "block" : "none",
                        width: "220px",
                        marginLeft: "20px",
                      }}
                    >
                      <label htmlFor="">Select Variety Group</label>
                      <select
                        className="select_input"
                        value={select}
                        onChange={handleSelectChange}
                      >
                        <option>Select Variety Group</option>

                        {option.map((opt) => (
                          <option value={opt.id} selected={opt.id === select}>
                            {opt.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <br />

                  <div className="row">
                    <div className="col">
                      <Box
                        sx={{
                          width: 500,
                          maxWidth: "100%",
                        }}
                        noValidate
                        autoComplete="off"
                      >
                        <div
                          id="itemPrice"
                          style={
                            select ? { display: "block" } : { display: "none" }
                          }
                        >
                          {optMap.flat().map((item, index) => (
                            <TextField
                              key={index}
                              size="small"
                              id={`outlined-basic-${index}`}
                              label={item}
                              variant="outlined"
                              value={pricevalues[item]}
                              style={{ marginRight: "10px" }}
                              onChange={(e) =>
                                setTextValue(e.target.value, item)
                              }
                            />
                          ))}
                        </div>
                        <div
                          id="price"
                          style={{ display: variety ? "none" : "block" }}
                        >
                          <TextField
                            fullWidth
                            id="fullWidth"
                            label="Add Item Price"
                            defaultValue=""
                            onChange={handlePriceChange}
                            type="text"
                            name="price"
                            value={price}
                          />
                        </div>
                      </Box>
                    </div>
                    <div className="col">
                      <Box
                        sx={{
                          width: 500,
                          maxWidth: "100%",
                        }}
                        noValidate
                        autoComplete="off"
                      >
                        <TextField
                          fullWidth
                          id="fullWidth"
                          label="Calorie"
                          defaultValue=""
                          onChange={handleCalorieChange}
                          type="text"
                          name="calorie"
                          value={calorie}
                        />
                      </Box>
                    </div>
                  </div>
                  {/* </div> */}
                  <div
                    style={{
                      marginTop: "8px",
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <div className="row">
                      <div className="col">
                        <FormControl sx={{ m: 1, minWidth: 150 }}>
                          <InputLabel id="demo-simple-select-helper-label">
                            In Stock
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            value={inStock}
                            label="In Stock"
                            onChange={handleInStockChange}
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            <MenuItem value={true} selected={proStack}>
                              Yes
                            </MenuItem>
                            <MenuItem value={false} selected={!proStack}>
                              No
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                      <div className="col">
                        <FormControl sx={{ m: 1, minWidth: 150 }}>
                          <InputLabel id="demo-simple-select-helper-label">
                            Food Type
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            label="Food Type"
                            value={categoryType || "Non-Veg"}
                            onChange={handleCategoryType}
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            <MenuItem value="Veg">Veg</MenuItem>
                            <MenuItem value="Non-Veg">Non-Veg</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                    {/* Food Type Select Start  */}
                  </div>

                  <div style={{ display: showAddon ? "block" : "none" }}>
                    <label
                      style={{ marginTop: "10px", marginLeft: "10px" }}
                      htmlFor=""
                    >
                      Add-on Categories
                    </label>
                    <div className="tags-input " style={{ display: "block" }}>
                      <div id="addons">
                        {addOn.map((tag, index) => {
                          console.log(addOn);

                          let addName = categories.filter(
                            (li) => li.id === tag
                          );
                          addName = addName.length ? addName[0].name : "";
                          return (
                            <span key={index} className="tag">
                              <span className="tag-title">{addName}</span>
                              <span
                                className="rmv-btn"
                                onClick={() => removeAddons(index)}
                              >
                                x
                              </span>
                            </span>
                          );
                        })}
                      </div>

                      <select
                        className="select_input"
                        style={{ marginTop: "10px" }}
                        onChange={handleAddOns}
                      >
                        <option>Select</option>
                        {categories
                          .filter((cat) => cat.isAddOn)
                          .map((li) => (
                            <option value={li.id}>{li.name}</option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <div className="row-last">
                    <div className="col">
                      <Box
                        sx={{
                          width: 500,
                          maxWidth: "100%",
                        }}
                        noValidate
                        autoComplete="off"
                      >
                        <TextField
                          fullWidth
                          id="fullWidth"
                          label="Tags"
                          defaultValue=""
                          onChange={handleTagsChange}
                          //className="input_cls"
                          type="text"
                          name="tags"
                          value={tags}
                        />
                      </Box>
                    </div>

                    <div className="col">
                      <Box
                        sx={{
                          width: 500,
                          maxWidth: "100%",
                        }}
                        noValidate
                        autoComplete="off"
                      >
                        <ul id="tags">
                          {cooktags && cooktags.length ? (
                            cooktags.length &&
                            cooktags.map((cooktags, index) => (
                              <li key={index} className="tag">
                                <span className="tag-title">{cooktags}</span>
                                <span
                                  className="btn"
                                  onClick={() => removeTags(index)}
                                >
                                  x
                                </span>
                              </li>
                            ))
                          ) : (
                            <span className="tag-title"></span>
                          )}{" "}
                        </ul>
                        <TextField
                          fullWidth
                          id="fullWidth"
                          label="Cooking Instruction"
                          defaultValue=""
                          onKeyUp={(event) =>
                            event.key === "Enter" ? addTags(event) : null
                          }
                          //className="input_cls"
                          type="text"
                          //name="calorie"
                          //value={calorie}
                        />
                      </Box>
                    </div>
                  </div>
                </form>

                <div className="fixed-buttons">
                  <Button
                    className="save-btn btnDialog-Fill"
                    variant="contained"
                    color="success"
                    style={{ margin: "20px" }}
                    onClick={handleSubmit}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    style={{ margin: "20px" }}
                    className="close-btn"
                    onClick={handleClose}
                  >
                    Close
                  </Button>
                </div>
              </>
            ) : (
              ""
            )}
          </div>
        </Dialog>
        <Dialog
          onClose={() => setShowGallery(false)}
          open={showGallery}
          fullWidth={true}
          style={{ width: "600px", margin: "auto" }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <div
              className="header"
              style={{
                flex: "0 0 auto",
                padding: "8px",
                borderBottom: "1px solid #ccc",
                position: "sticky",
                top: "0",
                backgroundColor: "#fff",
                zIndex: "1",
                justifyContent:"space-evenly"
              }}
            >
              <div
                className="search"
                style={{ display: "flex", alignItems: "center" }}
              >
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search item image"
                  onChange={handleSearch}
                  style={{
                    border: "none",
                    outline: "none",
                    width: "100%",
                    backgroundColor: "transparent",
                    marginLeft: "8px",
                  }}
                  value={searchQuery}
                />
              </div>
              <input 
              type="button"
              value="Search"
              style={{
                border:"1px solid black",
                borderRadius:"15px",
                marginLeft:"5px",
                padding:"5px 15px",
                cursor:"pointer",
                backgroundColor:"#000",
                color:"#fff"
              }}
              // onClick={}
              />
            </div>

            <div
              className="content"
              style={{ flex: "1 1 auto", overflowY: "auto", padding: "8px" }}
            >
              <Gallery
                onSelectImage={handleSelectedImage}
                searchQuery={searchQuery}
              />
            </div>

            <div
              className="footer"
              style={{
                flex: "0 0 auto",
                padding: "8px",
                borderTop: "1px solid #ccc",
                position: "sticky",
                bottom: "0",
                backgroundColor: "#fff",
                zIndex: "1",
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Button
                variant="outlined"
                color="warning"
                onClick={() => setShowGallery(false)}
              >
                Cancel
              </Button>
              <Button
                style={{ background: "#f7c919" }}
                variant="contained"
                onClick={handleSubmitImage}
              >
                SELECT
              </Button>
            </div>
          </div>
        </Dialog>

        <div className="product-list">
          <Table width="100%" cellPadding="4px">
            <Thead>
              <Tr>
                <Th>Name</Th>
                {/* <th>Description</th> */}
                <Th>Images</Th>
                <Th>Price</Th>
                <Th>Calorie</Th>

                <Th>Veg/Non-Veg</Th>
                <Th>Category</Th>
                {/* <th>Tags</th> */}
                <Th>Instock</Th>

                <Th>Action</Th>
              </Tr>
            </Thead>

            <Tbody>
              {prod.length
                ? prod
                    .filter((p) => {
                      if (!selectedCategory) return true; // Show all products if no category is selected
                      const categoryMatch = catAddon.find(
                        (cat) =>
                          (p.category.id || p.category) === (cat._id || cat.id)
                      );
                      return (
                        categoryMatch && categoryMatch.name === selectedCategory
                      );
                    })
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((p) => {
                      console.log(p);
                      let cat_name =
                        catAddon && catAddon.length
                          ? catAddon.filter(
                              (cat) =>
                                (p.category.id ? p.category.id : p.category) ===
                                (cat._id ? cat._id : cat.id)
                            )
                          : [];
                      console.log(p);
                      cat_name = cat_name.length ? cat_name[0].name : "";

                      return (
                        <Tr
                          style={{
                            borderBottom: "1px solid #f0eeee",
                            margin: "5px",
                          }}
                        >
                          <Td
                            style={{
                              overflow: "hidden",
                              whiteSpace: "wrap",
                              fontWeight: "bold",
                            }}
                          >
                            {p.name}
                          </Td>
                          {/* <Td style={{maxWidth:"100px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace: "nowrap"}}>{p.description}</Td> */}
                          <Td style={{ padding: "10px 0px" }}>
                            <img
                              src={
                                p.image === ""
                                  ? "./images/blank.jpg"
                                  : baseURL + "/" + p.image
                              }
                              alt={p.name}
                              onError={imageOnErrorHandler}
                              style={{
                                width: "80px",
                                height: "40px",
                                borderRadius: "5px",
                              }}
                            />
                          </Td>
                          <Td>
                            {SelectCurrency}{" "}
                            {p.isPriceVariety
                              ? Object.values(JSON.parse(p.varietyPrices)).join(
                                  ` ${SelectCurrency}`
                                )
                              : p.price}
                          </Td>

                          <Td>{p.calorie}</Td>

                          <Td>
                            {p.cat_type.toLowerCase() ===
                            "Non-Veg".toLocaleLowerCase() ? (
                              <img
                                src="./images/Non-veg.png"
                                height="30px"
                                style={{ marginLeft: "20px" }}
                              />
                            ) : (
                              <img
                                src="./images/veg.png"
                                height="30px"
                                style={{ marginLeft: "20px" }}
                              />
                            )}
                          </Td>
                          <Td>{cat_name}</Td>
                          <Td>
                            <input
                              type="checkbox"
                              checked={p.inStock}
                              onChange={() => handleStocks(p)}
                              style={{
                                width: "40px",
                                height: "20px",
                                accentColor: "#31e631",
                                cursor: "pointer",
                              }}
                            />
                          </Td>
                          <Td>
                            {!merchCode.activeProviderId && (
                              <Td align="center">
                                <IconButton
                                  aria-label="delete"
                                  size="large"
                                  color="info"
                                  onClick={() =>
                                    handleEdit(
                                      p.id,
                                      p.image,
                                      p.category,
                                      p.cat_type,
                                      p.inStock
                                    )
                                  }
                                >
                                  <EditIcon />
                                </IconButton>
                              </Td>
                            )}

                            {!merchCode.activeProviderId && (
                              <Td align="center">
                                {/* <button className='btn btn-danger' onClick={()=> handleDelete(p.id)}><DeleteIcon/></button> */}
                                <IconButton
                                  aria-label="delete"
                                  size="large"
                                  color="error"
                                  onClick={() => handleDelete(p.id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Td>
                            )}
                          </Td>
                        </Tr>
                      );
                    })
                : ""}
            </Tbody>
          </Table>
          {prod && prod.length > 0 && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={prod.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default FoodDescription;
