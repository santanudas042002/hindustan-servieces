import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./paymentOption.scss";
// import paymentOptions from "../../data/businessListingPayment";
import axios, { AxiosError } from "axios";
import userDetailsContext from "../../contexts/userDeatailsContext/userDetailsContext";
import LoadingComponent from "../../components/loadingContainer/loadingContainer";
import Nav from "../../components/layout/nav/nav";
import Footer from "../../components/layout/footer/footer";
import useRazorpay, { RazorpayOptions } from "react-razorpay";

export default function PaymentOptions() {
  const [Razorpay] = useRazorpay();
  const { listingId = "" } = useParams();
  const { userData } = useContext(userDetailsContext);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState<any>(null);
  const [tradeName, setTradeName] = useState("");
  const [gstin, setGstin] = useState("");
  const [isSinglePayment, setIsSinglePayment] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();

  const openModal = (paymentOption: any) => {
    setSelectedPaymentOption(paymentOption);
    setModalIsOpen(true);
  };

  function validateGstin(gstin: string) {
    const gstinRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/;
    return gstinRegex.test(gstin);
  }

  const handleSubmitWithDetails = async () => {
    // Check if the trade name is valid
    if (!selectedPaymentOption || tradeName.length < 4) {
      alert("Please fill valid trade name!");
      return;
    }

    // Check if the GSTIN is provided and validate it
    if (gstin && !validateGstin(gstin)) {
      alert("Please enter a valid GSTIN");
      return;
    }

    if (isSinglePayment) {
      openSinglePaymentModal();
      return;
    }

    // If the above conditions are satisfied, proceed with submission
    handleSubmit(selectedPaymentOption.id, listingId);
  };

  const handleSubmit = async (paymentId: string, listingId: string) => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${backendUrl}/business-listing/create-order`,
        {
          paymentOptionId: paymentId,
          businessId: listingId,
          tradeName,
          gstin,
        },
        {
          headers: {
            Authorization: `Bearer ${userData?.token}`,
          },
        }
      );
      navigate(
        `/business-admin/${listingId}/payment-options/${paymentId}/${res.data.order.id}`
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data?.message) {
          setErrorMessage(error.response?.data?.message);
          return;
        }
      }
      setErrorMessage("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  async function openSinglePaymentModal() {
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${backendUrl}/business-listing/create-single-payment-order`,
        {
          paymentId: selectedPaymentOption.period,
          listingId: listingId,
        },
        {
          headers: {
            Authorization: `Bearer ${userData?.token}`,
          },
        }
      );
      const option: RazorpayOptions = {
        key: import.meta.env.VITE_RAZOR_PAY_KEY_ID,
        amount: (res.data.order.amount / 100).toString(),
        currency: res.data.order.currency,
        order_id: res.data.order.id,
        name: "Business Listing",
        description: "Business Listing Payment For a Year",
        handler: async function (response: any) {
          const paymentId = response.razorpay_payment_id;
          const orderId = response.razorpay_order_id;
          const signature = response.razorpay_signature;

          const url = backendUrl + "/business-listing/single-payment-capture";
          setIsLoading(true);

          try {
            await axios.post(
              url,
              {
                paymentId,
                orderId,
                signature,
                BusinessTradeName: tradeName,
                BusinessGST: gstin,
              },
              {
                headers: {
                  Authorization: `Bearer ${userData?.token}`,
                },
              }
            );
            navigate(`/business-admin/`);
          } catch (error) {
            if (error instanceof AxiosError) {
              if (error.response?.data?.message) {
                setErrorMessage(error.response?.data?.message);
                return;
              }
            }
            setErrorMessage(
              "Something went wrong. If the payment is deducted, please contact us."
            );
          } finally {
            setIsLoading(false);
          }
        },
        prefill: {
          name: userData?.name,
          email: userData?.email,
          contact: userData?.phone,
        },
      };

      const paymentObject = new Razorpay(option);
      paymentObject.open();
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data?.message) {
          setErrorMessage(error.response?.data?.message);
          return;
        }
      }
      setErrorMessage("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  function singlePaymentModal(price: number, currency: String, period: String) {
    setIsSinglePayment(true);
    const paymentOptions = {
      price: price,
      currency,
      period,
    };
    openModal(paymentOptions);
  }

  if (!listingId) {
    return <h1>Not authorized to access it</h1>;
  }

  return (
    <div className="paymentOptionComponent">
      <Nav />
      <div className="header">
        <h1>Payment options</h1>
        <p>Choose a payment option to continue</p>
      </div>
      <div className="paymentOptionsContainer">
        {isLoading && <LoadingComponent />}
        {errorMessage && <h1>{errorMessage}</h1>}
        <div className="paymentOptions">
          {/* {paymentOptions.map((option) => (
            <div
              key={option.name}
              className="paymentOption"
              onClick={() => openModal(option)}
            >
              <h3>{option.name}</h3>
              <p className="description">{option.description}</p>
              <div className="priceContainer">
                <div className="price">
                  {option.price} {option.priceDetails.currency}
                </div>
                {option.originalPrice && (
                  <div className="originalPrice">
                    {option.originalPrice} {option.priceDetails.currency}
                  </div>
                )}
                {option.disCount > 0 && (
                  <div className="discount">{option.disCount}% off</div>
                )}
              </div>
            </div>
          ))} */}

          <div
            className="paymentOption"
            onClick={() => {
              singlePaymentModal(365, "INR", "1 Year");
            }}
          >
            <h3>One Year Payment</h3>
            <p className="description">
              Pay once and get access to the business listing for a year
            </p>
            <div className="priceContainer">
              <div className="price">365 INR</div>

              <div className="originalPrice">999 INR</div>

              <div className="discount">1RS/ Day</div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {modalIsOpen && (
        <div
          className="modal show"
          id="exampleModal"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden={!modalIsOpen}
          style={{ display: "block" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Enter Payment Details
                </h1>
              </div>
              <div className="modal-body">
                {" "}
                <form>
                  <div className="form-group mb-2">
                    <label htmlFor="tradeName">Trade Name:</label>
                    <input
                      type="text"
                      id="tradeName"
                      value={tradeName}
                      onChange={(e) => setTradeName(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group mb-2">
                    <label htmlFor="gstin">GSTIN:</label>
                    <input
                      type="text"
                      id="gstin"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <p>Taxable Value: INR 309</p>
                  <p>GST amount: INR 56</p>
                  <p>Total Amount: INR 365</p>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={handleSubmitWithDetails}
                  className="w-100 p-2 primary-button"
                >
                  PAY NOW
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
