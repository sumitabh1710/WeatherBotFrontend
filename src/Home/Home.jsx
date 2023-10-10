import React from "react";

const Home = ({login}) => {
  return (
    <div
      style={{
        margin: "5%",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <button
        onClick={() => {
          login();
        }}
      >
        Sign in{" "}
      </button>
      <p style={{ fontSize: "12px", marginBottom: "0px" }}>with Google</p>
    </div>
  );
};

export default Home;
