import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./routes/home/home";
import Listing from "./routes/listing/listing";
import ListingHome from "./routes/listingHome/listingHome";
import About from "./routes/about/about";
import Contact from "./routes/contact/contact";
import Register from "./routes/auth/register/register";
import Login from "./routes/auth/login/login";
import ProtectedRoute from "./components/protected/protectedRoute";
import Profile from "./routes/auth/profile/profile";
import UserDetailsContextProvider from "./contexts/userDeatailsContext/userDetailsContextProvider";
import VerifyEmail from "./routes/auth/register/verifyEmail";
import ForgetPassword from "./routes/auth/forgotPassword/forgetPassword";
import EditPersonalDetails from "./routes/auth/login/editPersonalDetails";
import SingleListing from "./routes/singleListing/singleListing";
import ChangePassword from "./routes/auth/login/changePassword";
import AllListing from "./routes/admin-listing/AllListing";
import Listings from "./routes/admin-listing/Listing";
import PrivacyPolicy from "./routes/static-pages/PrivacyPolicy";
import TermsAndCondition from "./routes/static-pages/TermsAndCondition";
import UpdateEmail from "./routes/auth/login/updateEmail";
import ListingNewBusiness from "./routes/listingNewBusiness/listingNewBusiness";
import AddSellers from "./routes/superAdmin/addSeller/addSellers";
import SuperAdminProtectedRoute from "./components/protected/superAdminProtectedRoute";
import GetSellers from "./routes/superAdmin/getSellers/getSellers";
import EditSeller from "./routes/superAdmin/editSeller/editSeller";
import PaymentOptions from "./routes/listingNewBusiness/paymentOptions";
import BusinessPayment from "./routes/listingNewBusiness/businessPayment";
import GetAllBusinessListing from "./routes/listingNewBusiness/getAllBisinessListing";
import BusinessPaymentDetails from "./routes/listingNewBusiness/businessPaymentDetails";
import SuperAdminBusinessSearch from "./routes/superAdmin/businessSearch/businessSearch";
import ViewSellerPerformance from "./routes/superAdmin/viewPerformance/viewPerformace";
import Refund from "./routes/static-pages/refundPolicy";
import ShippingPolicy from "./routes/static-pages/shippingPolicy";
import UpdateSiteStaticData from "./routes/superAdmin/updateSiteStaticData/updateSiteStatcData";
import EditListedBusiness from "./routes/listingNewBusiness/editListedBusiness";

function App() {
  return (
    <>
      <UserDetailsContextProvider>
        <Routes>
          <Route path="/home" errorElement={<Home />} />
          <Route path="/" element={<ListingHome />} />
          <Route path="/listing/:city?/:category?" element={<Listing />} />
          <Route path="/business/:businessId" element={<SingleListing />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/contact-us" element={<Contact />} />
          {/* Authentication /auth */}
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/forgot-password" element={<ForgetPassword />} />
          <Route
            path="/auth"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/auth/verify-email"
            element={
              <ProtectedRoute>
                <VerifyEmail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/auth/edit-personal-details"
            element={
              <ProtectedRoute>
                <EditPersonalDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/auth/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="/auth/change-email"
            element={
              <ProtectedRoute>
                <UpdateEmail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/allListings"
            element={
              <ProtectedRoute>
                <AllListing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/Listings"
            element={
              <ProtectedRoute>
                <Listings />
              </ProtectedRoute>
            }
          />
          \
          <Route
            path="/new-business-listing"
            element={
              <ProtectedRoute>
                <ListingNewBusiness />
              </ProtectedRoute>
            }
          />
          <Route
            path="/business-admin/:businessId/edit-details"
            element={
              <ProtectedRoute>
                <EditListedBusiness />
              </ProtectedRoute>
            }
          />
          <Route
            path="/business-admin/:listingId/payment-options"
            element={
              <ProtectedRoute>
                <PaymentOptions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/business-admin/:businessId/payment-details"
            element={
              <ProtectedRoute>
                <BusinessPaymentDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/business-admin/"
            element={
              <ProtectedRoute>
                <GetAllBusinessListing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/business-admin/:listingId/payment-options/:paymentOption/:paymentId/:changePayment?"
            element={
              <ProtectedRoute>
                <BusinessPayment />
              </ProtectedRoute>
            }
          />
          {/* super admin */}
          <Route
            path="/super-admin/add-sellers"
            element={
              <ProtectedRoute>
                <SuperAdminProtectedRoute>
                  <AddSellers />
                </SuperAdminProtectedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin/get-Sellers"
            element={
              <ProtectedRoute>
                <SuperAdminProtectedRoute>
                  <GetSellers />
                </SuperAdminProtectedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin/get-Seller/:sellerId"
            element={
              <ProtectedRoute>
                <SuperAdminProtectedRoute>
                  <EditSeller />
                </SuperAdminProtectedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin/search-business"
            element={
              <ProtectedRoute>
                <SuperAdminProtectedRoute>
                  <SuperAdminBusinessSearch />
                </SuperAdminProtectedRoute>
              </ProtectedRoute>
            }
          />
          {/* super-admin/seller-performance/663cb15727189d865480c0b9 */}
          <Route
            path="/super-admin/seller-performance/:sellerId"
            element={
              <ProtectedRoute>
                <SuperAdminProtectedRoute>
                  <ViewSellerPerformance />
                </SuperAdminProtectedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin/update-site-data"
            element={
              <ProtectedRoute>
                <SuperAdminProtectedRoute>
                  <UpdateSiteStaticData />
                </SuperAdminProtectedRoute>
              </ProtectedRoute>
            }
          />
          {/* static pages */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndCondition />} />
          <Route path="/refund-policy" element={<Refund />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </UserDetailsContextProvider>
    </>
  );
}

export default App;
