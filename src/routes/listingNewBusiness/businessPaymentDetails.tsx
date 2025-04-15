import axios from "axios";
import { Link, useParams } from "react-router-dom";
import userDetailsContext from "../../contexts/userDeatailsContext/userDetailsContext";
import { useContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@mui/material";
import Nav from "../../components/layout/nav/nav";
import Footer from "../../components/layout/footer/footer";
import "./businessPaymentDetails.scss";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";

export default function BusinessPaymentDetails() {
  const { businessId } = useParams();
  const { userData } = useContext(userDetailsContext);

  const { isLoading, error, data } = useQuery({
    queryKey: ["business-admin", "getBusinessPaymentDetails", businessId],
    queryFn: async () => {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const res = await axios.post(
        `${backendUrl}/business-listing/get-payment-details`,
        {
          businessId,
        },
        {
          headers: {
            Authorization: `Bearer ${userData?.token}`,
          },
        }
      );
      return res.data;
    },
  });


  const listingData = useMemo(() => {
    if (!data || !data.paymentDetails) {
      return [];
    }

    return data.paymentDetails.map((listing: any) => {
      return {
        ...listing,
        listingId: listing._id,
      };
    });
  }, [data]);

  const columns = [
    {
      label: "Payment ID",
      renderCell: (payment: any) => {
        return payment.payment_id || payment.id || "N/A";
      },
    },
    {
      label: "Payment Date",
      renderCell: (payment: any) => {
        return new Date((payment.paid_at || payment.created_at) * 1000).toLocaleDateString();
      },
    },
    {
      label: "Payment Amount",
      renderCell: (payment: any) =>
        (payment.amount_paid || payment.amount )/ 100 + " " + payment.currency,
    },
    {
      label: "Payment Status",
      renderCell: (payment: any) => payment.status,
    },
  ];

  const theme = useTheme([
    getTheme(),
    {
      HeaderRow: `
        background-color: #eaf5fd;
      `,
      Row: `
        &:nth-of-type(odd) {
          background-color: #d2e9fb;
        }

        &:nth-of-type(even) {
          background-color: #eaf5fd;
        }
      `,
    },
  ]);

  return (
    <div className="businessPaymentDetails">
      <Nav />
      <div className="paymentDetails">
        <div className="header">
          <h1>Payment details</h1>
          <p>
            Here you can see your payment details, if you have any issues please
            contact us
          </p>
        </div>
        <div className="noticeContainer"></div>

        {isLoading && <p>Loading...</p>}
        {error && (
          <p>
            {error instanceof Error ? error.message : "Something went wrong"}
          </p>
        )}
        {
          //if the payment is halted
          data && data.halted && (
            <div className="payment-error">
              <p>
                Due to some reason we can't process your payment, please try to
                do payment by clicking the button below and if you still face
                any issue please contact us
              </p>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to={`/business-admin/${businessId}/payment-options`}
              >
                Pay now
              </Button>
            </div>
          )
        }
        {data && data.paymentDetails && data.paymentDetails.length === 0 && (
          <div className="doPayment">
            <p>
              You haven't made any payment yet for this business and due to this
              your business is may not be listed on the website. Please make a
              payment to list your business.
            </p>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to={`/business-admin/${businessId}/payment-options`}
            >
              Pay now
            </Button>
          </div>
        )}
        {data && data.paymentDetails && data.paymentDetails.length > 0 && (
          <CompactTable
            columns={columns}
            data={{ nodes: listingData }}
            theme={theme}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}
