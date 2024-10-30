import axios from "axios";
import React, { useState, useEffect } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import configs, { getParameterByName } from "../Constants";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-responsive-list";
import { TextField } from "@mui/material";
import { Box } from "@mui/material";
import "react-responsive-list/assets/index.css";
import Gallery from "./Gallery";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";

//Added by Mojahid
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function Category(props) {
  const [foodName, setFoodName] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [userInfo, setUserInfo] = useState([]);
  const [filterCat, setFilterCat] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [catId, setCatId] = useState("");
  const [addonsGroup, setAddonsGroup] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addOn, setAddOn] = useState(false);
  const [noAddOn, setNoAddOn] = useState(1);
  const [minNoAddOn, setMinNoAddOn] = useState(0);
   const [hasError, setHasError] = useState("");
  const [catIndex, setCatIndex] = useState(1);
  const [showGallery, setShowGallery] = useState(false);
  const [image, setImage] = useState(false);
  const [orderableAlone, setOrderableAlone]= useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  Array.prototype.move = function (from, to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
  };
  let baseURL = configs.baseURL;
  let userData = sessionStorage.getItem("userData")
    ? JSON.parse(sessionStorage.getItem("userData"))
    : "";

  let merchantData = sessionStorage.getItem("merchantData")
    ? JSON.parse(sessionStorage.getItem("merchantData"))
    : null;

  const merchCode = merchantData ? merchantData.merchantCode : "";

  const getCatByUserUrl = `${baseURL}/api/categories?merchantCode=${merchCode}`;

  useEffect(() => {
    fetchCatData();
  }, []);
  const handleSelectedImage = (image) => {
    setSelectedImage(image);
  };
  const handleFoodNameChange = (event) => {
    setFoodName(event.target.value);
  };
  const handleOderableCheck = (event) =>{
    setOrderableAlone(!orderableAlone);
  }

  const handleImageURLChange = (e) => {
    var formData = new FormData();
    let file = e.target.files[0];
    let fileName = "cat_" + new Date().getTime() + file.name;
    formData.append("uploader", file, fileName);
    let postQueriesUrl = baseURL + "/api/upload/INVENTORY_ITEM";
    axios.post(postQueriesUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setImageURL("app-uploads/customers/inventories/" + fileName);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!foodName) {
      setHasError("Category Name is required");
      return;
    }else if(noAddOn< minNoAddOn){
      setHasError("Max limit can't be more than min. limit");
      return;
    } else if (catId) {
      axios
        .put(
          baseURL + "/api/categories/" + catId + `?merchantCode=${merchCode}`,
          {
            name: foodName,
            image: imageURL ? imageURL : selectedImage.image,
            tags: tags.length ? tags.join("~") : "",
            isAddOn: addOn,
            serialNumber: catIndex ? catIndex : 1,
            maxAddOnAllowed: parseInt(noAddOn),
            minAddOnAllowed: parseInt(minNoAddOn),
            userId: userData.sub,
            isOrderableAlone:orderableAlone
          }
        )
        .then((response) => {
          fetchCatData();
        });
    } else {
      axios
        .post(`${baseURL}/api/categories?merchantCode=${merchCode}`, {
          name: foodName,
          image: imageURL ? imageURL : selectedImage.image,
          tags: tags.length ? tags.join("~") : "",
          isAddOn: addOn,
          serialNumber: catIndex ? catIndex : 1,
          maxAddOnAllowed: parseInt(noAddOn),
          minAddOnAllowed: parseInt(minNoAddOn),
          isOrderableAlone:orderableAlone,
          userId: userData.sub,
        })
        .then((response) => {
          fetchCatData();
        });
    }
    setHasError("");
  };

  const handleDelete = (id) => {
    console.log(id);
    axios.delete(baseURL + "/api/categories/" + id).then((response) => {
      fetchCatData();
    });
  };

  const fetchCatData = () => {
    axios.get(getCatByUserUrl).then((response) => {
      console.log("responseData", response.data);
      setCategories(response.data);
      setDialogOpen(false);
      setAddOn(false);
      setTags("");
      setFoodName("");
      setNoAddOn(1);
      setMinNoAddOn(0);
      setCatIndex(1);
      setImageURL("");
      setSelectedOption("");
    });
  };

  const removeTags = (indexToRemove) => {
    setTags([...tags.filter((_, index) => index !== indexToRemove)]);
  };
  const addTags = (event) => {
    if (event.target.value !== "") {
      setTags([...tags, event.target.value]);
      //props.selectedTags([...tags, event.target.value]);
      event.target.value = "";
    }
  };
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
  const handleAddon = () => {
    setAddOn(!addOn);
  };

  const imageOnErrorHandler = (event) => {
    event.currentTarget.src = "./images/blank.jpg";
  };

  const handleSearch = (e) => {
    let val = e.target.value;
    let fltData = categories.filter(
      (cat) => cat.name.toLowerCase().indexOf(val.toLowerCase()) !== -1
    );
    console.log(fltData);
    setFilterCat(fltData);
    setIsSearch(val ? true : false);
  };
  const handleSearch1 = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleEdit = (cat) => {
    console.log(cat);
    setAddOn(cat.isAddOn);
    setTags(cat.tags.split("~"));
    setFoodName(cat.name);
    setImageURL(cat.image);
    setCatId(cat.id);
    setNoAddOn(cat.maxAddOnAllowed);
    setMinNoAddOn(cat.minAddOnAllowed);
    setCatIndex(cat.serialNumber);
    setDialogOpen(true);
    setOrderableAlone(cat.isOrderableAlone);
  };
  const categorieItems = isSearch ? filterCat : categories;

  const handleGallery = () => {
    setShowGallery(true);
  };
  const handleUpload = () => {
    setImage(true);
  };
  const handleSubmitImage = () => {
    if (selectedImage) {
      console.log("Selected Image:", selectedImage);
    } else {
      console.error("No image selected!");
    }
    setShowGallery(false);
  };

  // ADDED by  MOJAHID ************************************
  const handleDragEnd = (results) => {
    console.log(results);
    if (!results.destination) {
      return;
    }
    let Cats = [...categories];
    //arr.move(from, to)
    Cats.move(results.source.index,results.destination.index)
    console.log("new TEMPUSER", Cats);
    const reorderCatIds = Cats.map(cat => cat.id);
    updateDragAndDrop(reorderCatIds, Cats);
  };

  const updateDragAndDrop = async (reorderCatIds,Cats) => {
    try {

      axios
        .put(
          baseURL + "/api/categories/update_by_prop?propName=serialNumber",
          reorderCatIds
        )
        .then(async (response) => {
          //fetchCatData();
          setCategories(Cats);
        });
    } catch (err) {
      console.log("Error from frag n drop URL ", err);
    }
  };

  // End Lines

  return (
    <div style={{ height: "98vh" }}>
      <Dialog open={dialogOpen} maxWidth="mb" style={{ textAlign: "left" }}>
        <DialogTitle sx={{ m: 0, p: 2 }} style={{ fontWeight: "bold" }}>
          {catId ? "Edit Category" : "Add Category"}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => {
            setDialogOpen(false);
            setAddOn(false);
            setTags("");
            setFoodName("");
            setImageURL("");
            setCatId("");
          }}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
        <CloseIcon />
        </IconButton>
        <DialogContent
          style={{
            borderTop: "1px solid #ccc",
            borderBottom: "1px solid #ccc",
            padding: "10px 30px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              textAlign: "left",
              margin: "10px 10px 10px 0px",
            }}
          >
            <TextField
              type="text"
              label="Category name(*)"
              variant="outlined"
              defaultValue={foodName}
              fullWidth
              size="small"
              value={foodName}
              onChange={handleFoodNameChange}
            />

            

          </div>


        <div style={{
              display: "flex",
              marginTop: "20px",
            }}>
            <span>Can Be Ordered Alone?:</span>
            <input
              type="checkbox"
              defaultChecked={orderableAlone}
              style={{
                height: "25px",
                width: "25px",
                marginLeft: "5px",
                accentColor: "#3622cc",
              }}
              checked={orderableAlone}
              onChange={handleOderableCheck}
            />
            </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <lable>{"Category Icon: "}</lable>
            <Button variant="contained" onClick={handleGallery}>
              Add From Gallery
            </Button>
            <Button variant="contained" onClick={handleUpload}>
              Upload New
            </Button>
          </div>
          <span style={{ fontSize: "1rem" }}>
            {selectedImage ? selectedImage.name : ""}
          </span>
          <div
            className="colchoose"
            style={image ? { display: "block" } : { display: "none" }}
          >
            <Box
              sx={{
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
          <br style={{ height: "20px", width: "100%", display: "block" }}></br>
          <div className={"dialog-row"}>
            <span>Add-on:</span>
            <input
              type="checkbox"
              defaultChecked={addOn}
              style={{
                height: "25px",
                width: "25px",
                marginLeft: "5px",
                accentColor: "#3622cc",
              }}
              checked={addOn}
              onChange={handleAddon}
            />
            {addOn && (
              <TextField
                type="number"
                placeholder="Min. allowed limit"
                size="small"
                value={ minNoAddOn}
                 InputProps={{
                  inputProps: { 
                      max: 100, min: 0 
                  }
              }}
                label="Min. Order:"
                variant="outlined"
                onChange={(e) =>setMinNoAddOn(e.target.value)}
              />
            )}
            {addOn && (
              <TextField
                type="number"
                placeholder="Max. allowed limit"
                size="small"
                value={noAddOn}
                style={{marginLeft:"10px"}}
                InputProps={{
                  inputProps: { 
                      max: 100, min: 0 
                  }
              }}
                label="Max. Order:"
                variant="outlined"
                onChange={(e) => setNoAddOn(e.target.value)}
              />
            )}
          </div>

          <div style={{ marginTop: "30px" }}>
            <label>Tags</label>
            <div className="tags-input">
              <ul id="tags">
                {tags.length ? (
                  tags.length &&
                  tags.map((tag, index) => (
                    <li key={index} className="tag">
                      <span className="tag-title">{tag}</span>
                      <span className="btn" onClick={() => removeTags(index)}>
                        x
                      </span>
                    </li>
                  ))
                ) : (
                  <span className="tag-title"></span>
                )}{" "}
              </ul>
              <input
                className="input_cls"
                type="text"
                onKeyUp={(event) =>
                  event.key === "Enter" ? addTags(event) : null
                }
                placeholder="Press enter to add tags"
              />
              
            </div>
            {hasError?<span style={{color:'red'}}>{"* "+hasError}</span>:""}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="error"
            style={{ margin: "10px", marginRight: "30px" }}
            onClick={() => {
              setDialogOpen(false);
              setAddOn(false);
              setTags("");
              setFoodName("");
              setImageURL("");
              setCatId("");
            }}
          >
            Close
          </Button>

          <Button
            variant="contained"
            color="success"
            className="btnDialog-Fill"
            style={{ margin: "10px" }}
            onClick={(e) => handleSubmit(e)}
          >
            Save
          </Button>
        </DialogActions>
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
            }}
          >
            <div
              className="search"
              style={{ display: "flex", alignItems: "center" }}
            >
              <SearchIcon />
              <input
                type="text"
                placeholder="Search Images"
                style={{
                  border: "none",
                  outline: "none",
                  width: "100%",
                  backgroundColor: "transparent",
                  marginLeft: "8px",
                }}
                onChange={handleSearch1}
                value={foodName || searchQuery}
              />
            </div>
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
              style={{ background: "red" }}
              variant="contained"
              onClick={() => setShowGallery(false)}
            >
              Cancel
            </Button>
            <Button
              style={{ background: "#f7c919" }}
              variant="contained"
              onClick={handleSubmitImage}
            >
              Submit
            </Button>
          </div>
        </div>
      </Dialog>
      <div className="header">
        <h4>Categories</h4>
        <div className="search">
          <SearchIcon />
          <input
            type="text"
            className="search_input"
            placeholder="Search"
            onChange={handleSearch}
          />
        </div>
        {merchCode && !merchCode.activeProviderId ? (
          <button className="add_btn" onClick={() => setDialogOpen(true)}>
            <AddIcon /> Add New
          </button>
        ) : (
          <span></span>
        )}
      </div>
      <div className="category-list" style={{ padding: "20px" }}>
        <DragDropContext onDragEnd={(results) => handleDragEnd(results)}>
          <Table style={{ width: "100%" }}>
            <Thead>
              <Tr>
                <Th style={{ width: "25%" }}>Categories</Th>
                <Th style={{ width: "25%" }}>Images</Th>
                <Th style={{ width: "25%" }}>Tags</Th>
                <Th>
                  {" "}
                  {userInfo.length && userInfo[0].activeProviderId === "" ? (
                    <span>Action</span>
                  ) : (
                    ""
                  )}
                </Th>
              </Tr>
            </Thead>
            <Droppable droppableId="tbody">
              {(provided) => (
                <tbody ref={provided.innerRef} {...provided.droppableProps}>
                  {categorieItems && categorieItems.length
                    ? categorieItems.map((category, k) => (
                        <Draggable
                          draggableId={category.id}
                          index={k}
                          key={category.id}
                        >
                          {(provided) => (
                            <tr
                              key={category.id}
                              style={{ borderBottom: "1px solid #f0eeee" }}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                            >
                              <td style={{ fontWeight: "bold" }} align="start">
                                {category.name}
                                {category.isAddOn ? (
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
                              </td>
                              <Td>
                                <img
                                  alt="cat"
                                  src={
                                    category.image === ""
                                      ? "./images/blank.jpeg"
                                      : baseURL + "/" + category.image
                                  }
                                  onError={imageOnErrorHandler}
                                  style={{
                                    width: "100px",
                                    height: "60px",
                                    borderRadius: "5px",
                                  }}
                                />
                              </Td>

                              <Td style={{ width: "25%" }}>{category.tags}</Td>
                              {!merchCode.activeProviderId ? (
                                <Td>
                                  <IconButton
                                    aria-label="edit"
                                    size="large"
                                    color="info"
                                    onClick={() => handleEdit(category)}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton
                                    aria-label="delete"
                                    size="large"
                                    color="error"
                                    onClick={() => handleDelete(category.id)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Td>
                              ) : (
                                ""
                              )}
                              {/* Add new td by Mojahid */}
                              <td {...provided.dragHandleProps}>
                                <DragHandleIcon />
                              </td>
                            </tr>
                          )}
                        </Draggable>
                      ))
                    : ""}
                  {provided.placeholder}
                </tbody>
              )}
            </Droppable>
          </Table>
        </DragDropContext>
      </div>
    </div>
  );
}

export default Category;
