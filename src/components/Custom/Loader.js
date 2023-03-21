import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "blue",
};
const Loader = ({ loading }) => {
  return (
    <div
      className="sweet-loading d-flex"
      style={{ height: "20rem", alignItems: "center" }}
    >
      <ClipLoader
        color={"#3399ff"}
        loading={loading}
        cssOverride={override}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Loader;
