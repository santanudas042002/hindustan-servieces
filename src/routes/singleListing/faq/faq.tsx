import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import "./faq.scss";
import React from "react";

export default function Faq() {
  const { businessId } = useParams();

  const { data } = useQuery({
    queryKey: ["faqData", businessId],
    queryFn: async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/business/get-faq",
          {
            params: {
              BusinessId: businessId,
            },
          }
        );

        return res.data.faq;
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response && error.response.data.error) {
            throw new Error(error.response.data.error);
          }
        }
        throw new Error("An Error occurred");
      }
    },
  });

  if (!data || data === null || data === undefined) {
    return null;
  }

  return (
    <div className="faqContainer">
      <h1>Frequently Asked Questions (FAQs)</h1>
      <div className="container">
        {data.map((faq: any) => {
          return (
            <React.Fragment key={faq._id}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  {faq.question}
                </AccordionSummary>
                <AccordionDetails>{faq.answer}</AccordionDetails>
              </Accordion>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
