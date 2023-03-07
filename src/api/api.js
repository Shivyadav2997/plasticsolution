import axios from "axios";
import React from "react";

const baseUrl = "https://jsonplaceholder.typicode.com/";

const getData = async (type) => {
  try {
    const resp = await axios.get(baseUrl + type);
    return {
      data: resp.data,
      message: "Data found success",
    };
  } catch (error) {
    return {
      data: [],
      message: "Data not found",
    };
  }
};

export { getData };
