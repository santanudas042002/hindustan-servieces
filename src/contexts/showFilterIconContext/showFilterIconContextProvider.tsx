import { useState } from "react";
import showFilterIconContext from "./showFilterIconContext";

export default function ShowFilterIconContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [show, updateShow] = useState<boolean>(true);

  return (
    <showFilterIconContext.Provider
      value={{
        show,
        updateShow,
      }}
    >
      {children}
    </showFilterIconContext.Provider>
  );
}
