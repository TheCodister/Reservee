import "./Home.css";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import { set } from "date-fns";
const Home = (props) => {
  const resData = props.data;
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState(resData); // eslint-disable-line no-unused-vars
  const handleChange = (e) => {
    var lowerCase = e.target.value.toLowerCase();
    e.preventDefault();
    setSearchInput(lowerCase);
    const result = resData.filter((data) => {
      if (searchInput.length > 0) {
        return data && data.name && data.name.toLowerCase().includes(lowerCase);
      } else {
        return data;
      }
    });
    setSearchResult(result);
  };
  return (
    <div className="home">
      <div className="home-title">
        <h1>Home</h1>
        <div className="home-search">
          <SearchIcon className="home-search-icon" />
          <input
            className="home-searchbar"
            type="text"
            placeholder="Search for your favorite restaurant"
            onChange={handleChange}
            value={searchInput}
          />
        </div>
      </div>
      <div className="home-menu">
        {searchResult.map((result) => (
          <div className="home-menu-item" key={result.id}>
            <div className="home-menu-item-img">
              <img src="./Images/Food.png" alt="food" />
            </div>
            <div className="home-menu-item-des">
              <h2>{result.name}</h2>
              <p>{result.des}</p>
            </div>
            <div className="home-menu-item-table">
              <h2>Total table: {result.totalTable}</h2>
              <h2>Table remain: {result.totalRemain}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
