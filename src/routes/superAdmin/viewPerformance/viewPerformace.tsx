import { useQuery } from "@tanstack/react-query";
import { useContext, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import userDetailsContext from "../../../contexts/userDeatailsContext/userDetailsContext";
import axios from "axios";
import { CompactTable } from "@table-library/react-table-library/compact";
import Layout from "../../../components/layout/layout";
import "./viewPerformance.scss";
import { Button } from "@mui/material";
import { CSVLink } from "react-csv";

export default function ViewSellerPerformance() {
  const { sellerId } = useParams();
  const { userData } = useContext(userDetailsContext);
  const tableRef = useRef(null);

  const { isFetching, data, error } = useQuery({
    queryKey: ["getSellerPerformance"],
    queryFn: async () => {
      const backendUrl = import.meta.env.VITE_BACKEND_URL as string;
      const response = await axios.post(
        `${backendUrl}/super-admin/performance-of-seller`,
        {
          sellerId: sellerId,
        },
        {
          headers: {
            Authorization: `Bearer ${userData?.token}`,
          },
        }
      );
      return response.data;
    },
  });

  const columns = [
    {
      label: "Sl No",
      renderCell: (listing: any) => {
        return listing.index + 1;
      },
    },
    {
      label: "Business ID",
      renderCell: (listing: any) => {
        return (
          <Link to={`/business/${listing.businessId}`}>
            {listing.businessId}
          </Link>
        );
      },
    },
    {
      label: "Business Name",
      renderCell: (listing: any) => {
        return listing.businessName || "N/A";
      },
    },
    {
      label: "Business Register Date",
      renderCell: (listing: any) => {
        return new Date(listing.createdAt).toLocaleDateString();
      },
    },
  ];

  // add id and serial number

  const listingData = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.map((listing: any, index: number) => {
      return {
        ...listing,
        id: listing._id,
        index,
      };
    });
  }, [data]);

  const [CSVdata, setCSVdata] = useState<string[][]>([]);
  const csvLinkComponent = useRef< CSVLink & HTMLAnchorElement & { link: HTMLAnchorElement } | null>(null)

  function exportData() {
    // export data in csv format

    const data = [columns.map((e) => e.label)];

    listingData.forEach((val: any) => {
      const col = columns.map((e) => e.renderCell(val));
      col[1] = import.meta.env.VITE_WEBSITE_URL + col[1].props.to;
      data.push(col);
    });

    setCSVdata(data);
  }
  function downloadData (){
    csvLinkComponent.current?.link.click()
  } 

  return (
    <Layout>
      <div className="viewSellerPerformance">
        <div className="performance">
          <div className="header">
            <h1>Seller Performance</h1>
            <p>
              Performance of seller with id: <span>{sellerId}</span>
            </p>
          </div>
          <div className="performanceTable">
            {isFetching && <div>Loading...</div>}
            {error && <div>Error occurred</div>}
            {data && data.length === 0 && (
              <div className="noBusiness">
                Seller has not added any business till now
              </div>
            )}
            {data && data.length > 0 && (
              <>
                <div className="exportContainer">
                  {CSVdata.length > 0 ? (
                    <>
                    <Button
                      type="button"
                      color="primary"
                      variant="contained"
                      onClick={downloadData}
                    >
                      Export Data
                    </Button>
                    <CSVLink ref= {csvLinkComponent} data={data} target="_blank" style={{display:"none"}}>Download</CSVLink>
                    </>
                  ) : (
                    <Button
                      type="button"
                      color="primary"
                      variant="contained"
                      onClick={exportData}
                    >
                      Generate CSV data
                    </Button>
                  )}
                </div>
                <CompactTable
                  columns={columns}
                  data={{ nodes: listingData }}
                  ref={tableRef}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
