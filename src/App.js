import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Category from "./Components/Category";
import FoodDescription from "./Components/FoodDescription";

import Nav from "./Components/Nav";
import OrderList from "./Components/OrderList";
import MerchantInfo from "./Components/MerchantInfo";
import Reports from "./Components/Reports";
import { useEffect, useState } from "react";
import axios from "axios";
import TableView from "./Components/TableView";
import ReactLoading from "react-loading";
import configs, { getParameterByName } from "./Constants";
import Setting from "./Components/Setting";
import Epos from "./Components/Epos";
import DashBoard from "./Components/Dashboard";
import Customers from "./Components/Customers";
import Members from "./Components/Members";
import Variety from "./Components/variety";
import QRCodes from "./Components/QRCodes";
import Help from "./Components/Help";
import MemberProducts from "./Components/MemberProducts";
import Cl_Dashboard from "./clover/Dashboard";
import Cl_Categories from "./clover/Category";
import Cl_Fooddescription from "./clover/FoodDescription";
import RolesLogin from "./Components/RolesLogin";
import BillPrint from "./Components/BillPrint";
import MemberTables from "./Components/MemberTables";
import AppPage from "./Components/AppPage";
import { db } from "./root/util";
import { onValue, ref } from "firebase/database";

function App() {
  const [notification, setNotification] = useState(false);
  const [refesh, setRefesh] = useState("");
  const [userSets, setUserSets] = useState(null);
  const [thirdParty, setThirdParty] = useState(null);
  const [isEpos, setIsEpos] = useState(true);
  const [openSetting, setOpenSetting] = useState(false);

  let userData = sessionStorage.getItem("userData")
    ? JSON.parse(sessionStorage.getItem("userData"))
    : "";

  let originURL =
    window.location.href.indexOf("localhost") > 0
      ? "https://menu.merchantnations.com"
      : window.location.origin;

  const url_token = getParameterByName("token");
  let userToken = url_token
    ? url_token
    : sessionStorage.getItem("token")
    ? sessionStorage.getItem("token")
    : "";
  const imuserDetails = null;
  let tokenUrl = configs.authapi + "/user/validate-token";
  //  let tokenUrl="http://15.204.58.171:6004/user/validate-token";
  console.log(userToken);
  let baseURL = configs.baseURL;
  if (url_token) {
    sessionStorage.setItem("token", userToken);
    window.location.href = window.location.origin + "/";
  }

  useEffect(() => {
    if (!userToken) return;

    axios({
      method: "post",
      url: tokenUrl,
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then((res) => {
        console.log("user token details", res.data.user);

        sessionStorage.setItem("userData", JSON.stringify(res.data.user));
        axios
          .get(`${configs.baseURL}/api/settings/${res.data.user.sub}`, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((resset) => {
            if (resset.status !== 200 || !resset.data.length) {
              setOpenSetting(true);
              return;
            }

            console.log(resset);
            sessionStorage.setItem(
              "merchantData",
              JSON.stringify(resset.data[0])
            );
            let merchantDtl = sessionStorage.getItem("merchantData");
            merchantDtl = JSON.parse(merchantDtl);
            setUserSets(merchantDtl);

            if (merchantDtl.activeProviderId) {
              axios
                .get(
                  baseURL + "/api/thp-source/" + merchantDtl.activeProviderId
                )
                .then((res) => {
                  setThirdParty(res.data);
                });
            }
          })
          .catch((err) => {
            console.error(err);
            setOpenSetting(true);
          });
      })
      .catch((err) => {
        console.error(err);
        setOpenSetting(true);
      });
  }, []);

  const handleNotification = () => {
    setNotification(true);
  };

  const handleRefresh = () => {
    refesh ? setRefesh("") : setRefesh("DATA REFRSHED");
  };
  console.log(sessionStorage.getItem("token"));
  let isBill = sessionStorage.getItem("billing");
  console.log(isBill)
  return (
    <div>
      <Router>
        {isBill === "true"? (
          <Routes>
            <Route exact path="/BillPrint" element={<BillPrint />} />
          </Routes>
        ) : (
          <Nav
            handleNotification={handleNotification}
            handleRefresh={handleRefresh}
            isEpos={isEpos}
            setIsEpos={setIsEpos}
          />
        )}
        {getParameterByName("merchantCode") && (
          <Routes>
            <Route exact path="/" element={<RolesLogin />} />
            <Route exact path="/dashboard" element={<DashBoard />} />
            <Route exact path="/categories" element={<Category />} />
            <Route exact path="/varieties" element={<Variety />} />
            <Route exact path="/productDetails" element={<FoodDescription />} />
            <Route exact path="/productDetailsmember" element={<MemberProducts />} />
            <Route exact path="/tableMember" element={<MemberTables />} />
            <Route
              exact
              path="/orderList"
              element={
                <OrderList
                  notification={notification}
                  setNotification={setNotification}
                  refesh={refesh}
                />
              }
            />
            <Route exact path="/merchantInfo" element={<MerchantInfo />} />
            <Route exact path="/reports" element={<Reports />} />
            <Route exact path="/table" element={<TableView />} />
            <Route exact path="/setting" element={<Setting />} />
            <Route
              exact
              path="/epos"
              element={<Epos setIsEpos={setIsEpos} />}
            />
            <Route exact path="/customers" element={<Customers />} />
            <Route exact path="/members" element={<Members />} />
            <Route exact path="/qrcodes" element={<QRCodes />} />
            <Route exact path="/help" element={<Help />} />
            <Route exact path="/app" element={<AppPage/>}/>
          </Routes>
        )}

        {userSets &&
          userSets.activeProviderId &&
          thirdParty &&
          !getParameterByName("merchantCode") && (
            <Routes>
              <Route exact path="/" element={<Cl_Dashboard />} />
              <Route exact path="/dashboard" element={<Cl_Dashboard />} />
              <Route exact path="/categories" element={<Cl_Categories />} />
              <Route
                exact
                path="/productDetails"
                element={<Cl_Fooddescription />}
              />
              <Route exact path="/setting" element={<Setting />} />
              <Route exact path="/table" element={<TableView />} />
              <Route exact path="/members" element={<Members />} />
              <Route exact path="/orderList" element={<OrderList />} />
              <Route
                exact
                path="/epos"
                element={<Epos setIsEpos={setIsEpos} />}
              />
              <Route exact path="/qrcodes" element={<QRCodes />} />
            </Routes>
          )}

        {userSets &&
          !userSets.activeProviderId &&
          !getParameterByName("merchantCode") && (
            <Routes>
              <Route exact path="/" element={<DashBoard />} />
              <Route exact path="/dashboard" element={<DashBoard />} />
              <Route exact path="/categories" element={<Category />} />
              <Route exact path="/varieties" element={<Variety />} />
              <Route
                exact
                path="/productDetails"
                element={<FoodDescription />}
              />
              <Route
                exact
                path="/orderList"
                element={
                  <OrderList
                    notification={notification}
                    setNotification={setNotification}
                    refesh={refesh}
                  />
                }
              />
              <Route exact path="/merchantInfo" element={<MerchantInfo />} />
              <Route exact path="/reports" element={<Reports />} />
              <Route exact path="/table" element={<TableView />} />
              <Route exact path="/setting" element={<Setting />} />
              <Route
                exact
                path="/epos"
                element={<Epos setIsEpos={setIsEpos} />}
              />
              <Route exact path="/customers" element={<Customers />} />
              <Route exact path="/members" element={<Members />} />
              <Route exact path="/qrcodes" element={<QRCodes />} />
              <Route exact path="/help" element={<Help />} />
              <Route exact path="/app" element={<AppPage/>}/>
            </Routes>
          )}
        {!userSets && openSetting && (
          <Routes>
            <Route exact path="/" element={<Setting />} />
          </Routes>
        )}
      </Router>
    </div>
  );
}

export default App;
