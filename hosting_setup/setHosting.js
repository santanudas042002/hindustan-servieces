import axios from "axios";
import fs from "fs";

import { configDotenv } from "dotenv";

configDotenv({
  path: "./.env.production",
});
try {
  const data = await axios.get(
    `${process.env.VITE_BACKEND_URL}/hosting/get-site-static-data`
  );
  //changed into recent update
  const siteData = data.data.siteStaticData[0];
  console.log( JSON.stringify(siteData))

  fs.writeFileSync("./staticData.json", JSON.stringify(siteData));
  console.log("Data written to staticData.json");
} catch (error) {
  console.log(error);
}
