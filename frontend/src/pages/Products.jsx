import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import Pagination from "@mui/material/Pagination";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios"

const Products = () => {
  const sortArray = ["Top Rated", "Low Rated", "for sample"];
  const [machines, setMachines] = useState([]);
  const [machinesByCategory, setMachinesByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const BASE_URL = import.meta.env.VITE_BASE_URL;


  const [displayedCategories, setDisplayedCategories] = useState(4); // Number of categories to display initially
  const [allCategoriesLoaded, setAllCategoriesLoaded] = useState(false);

  const handleLoadMoreCategories = () => {
    // Display all available categories
    setDisplayedCategories(displayedCategories + 4);
    // setAllCategoriesLoaded(true);
  };

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const response = await axios.get(`${BASE_URL}/api/machine/all`);

        console.log("response data is ", response.data);
        const machinesData = response.data;
        const sortedMachines = machinesData.reduce((acc, machine) => {
          if (!acc[machine.category]) {
            acc[machine.category] = [];
          }
          // Push the current machine to the corresponding category array
          acc[machine.category].push(machine);
          return acc;
        }, {});

        //getting  category wise sorted machine data
        console.log("machine by categories ", sortedMachines);
        setMachinesByCategory(sortedMachines);

        setMachines(response.data);
        setLoading(false);

      } catch (error) {
        console.error('Error fetching machines:', error.message);
      }
    };

    fetchMachines();
  }, []);


  return (
    <div>
      <div className="mb-24">
        <Navbar />
      </div>

      {/* Search bar */}
      <div className="flex justify-between bg-slate-50 px-10">
        {/* Location search input , yet to add */}
        <input
          type="text"
          placeholder="search by location"
          className="p-2 w-[25rem] border border-gray-500"
        />
        {/* Tool search input   ,yet to add*/}
        <div className="space-x-5 flex">
          <input
            type="text"
            placeholder="search by Tools"
            className="p-2 w-[50rem] border border-gray-500"
          />
          <button className="p-2 bg-green-900 text-white w-[10rem]">
            search
          </button>
        </div>
      </div>

      {/* Sort dropdown */}
      <div className="px-10 mt-7 float-end">
        <select
      // yet to add sort feature
          onChange={() => { }}
          value=""
          className="w-[8rem] text-gray-800 p-3 text-sm outline-none border border-gray-300 rounded-md focus:outline-none"
        >
          {sortArray.map((item) => (
            <option
              style={{ padding: "0.5rem" }}
              className="py-2 px-4 text-sm text-gray-800 bg-gray-200 hover:bg-gray-300"
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* Category-wise machines */}
      <div className="p-10">
        {Object.entries(machinesByCategory).slice(0, displayedCategories).map(([category, machines]) => (
          <div key={category} className="mt-10">
            <p className="text-3xl font-bold my-5">{category}</p>
            <div className="w-full grid grid-cols-4 gap-10">
              {machines.slice(0, 4).map((machine) => (
                <div key={machine._id} className="flex justify-center">
                  {/* Render ProductCard with machine data */}
                  <ProductCard machine={machine} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Load more categories */}
      {!allCategoriesLoaded && (
        <div className="text-xl font-semibold text-center cursor-pointer text-gray-400 hover:text-gray-900 mb-5" onClick={handleLoadMoreCategories}>
          Load More Categories
        </div>
      )}

      {/* Pagination */}
      {/* <div className="float-end px-10 my-10">
        <Pagination count={10} variant="outlined" shape="rounded" />
      </div> */}

      {/* Footer */}
      <Footer />
    </div>
  );


};

export default Products;
