import {   useNavigate, useParams } from "react-router-dom";
import MiddleSectionContainer from "../../components/middleSectionContainer/middleSectionContainer";
import { useContext, useEffect, useState } from "react";
// import { useCallback, useEffect } from "react";
// import useRazorpay, { RazorpayOptions } from "react-razorpay";
import paymentOptions from "../../data/businessListingPayment";
import userDetailsContext from "../../contexts/userDeatailsContext/userDetailsContext";
import FullLoadingComponent from "../../components/loadingContainer/fullLoadingScreen";

export default function BusinessPayment() {
  const { paymentId, paymentOption,listingId } = useParams();
  const navigate = useNavigate();
  const { userData } = useContext(userDetailsContext);
  function loadScript(src: string) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  const [rzp1Inst, setRzp1] = useState<any>(null);


  const displayRazorpay = async (options: any) => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    // Rest of the code...
    const rzp1 = new (window as any).Razorpay(options);

    // To get payment id in case of failed transaction.
    rzp1.on("payment.failed", () => {
      alert("Payment Failed");
    });

    // close preveious instance
    if (rzp1Inst) {
      rzp1Inst.close();
    }

    rzp1.open();
    setRzp1(rzp1);
  };

  useEffect(() => {
    const paymentOptionDetails = paymentOptions.find(
      (option) => option.id === paymentOption
    );
    if (!paymentOptionDetails) {
      alert("Not valid");
      return;
    }


    const options = {
      key: import.meta.env.VITE_RAZOR_PAY_KEY_ID,
      name: "Bharatbazzar",
      description: paymentOptionDetails.description,
      image: import.meta.env.VITE_BUSINESS_LOGO,
      subscription_id: paymentId,
     modal:{
      escape:false,
      ondismiss:function () {
        
        navigate(`/business-admin/` + listingId + `/payment-details`);
      }
     },
      // show subscription next due
      

      handler: function () {

        window.location.href = `/business-admin/`;

        navigate(`/business-admin/`);
      },


      prefill: {
        name: userData?.name,
        email: userData?.email,
        contact: userData?.phone,
        address: userData?.address,
      },
      notes: {
        name: userData?.name,
        email: userData?.email,
        contact: userData?.phone,
        address: userData?.address,
      },
      theme: {
        color: "#3399cc",
      },
    };
    console.log("Rendered")
    displayRazorpay(options);

  }, []);

  return (
    <MiddleSectionContainer>
      <FullLoadingComponent />
    </MiddleSectionContainer>
  );
}
