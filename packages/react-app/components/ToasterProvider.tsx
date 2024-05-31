import React from "react";
import { Toaster } from "react-hot-toast";

const ToasterProvider = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        className: "",
        duration: 5000,
        style: {
          background: "#ffffff",
          color: "#363636",
          minWidth: "96%",
        },
        success: { duration: 3000 },
      }}
    />
  );
};

export default ToasterProvider;
