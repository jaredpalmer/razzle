import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <p>Welcome to Razzle.</p>
      <Link to="about">About</Link>
    </>
  );
};

export default Home;
