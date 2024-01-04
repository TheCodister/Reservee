import "./Home.css";
import { useEffect, useState } from "react";
import { Menu } from "../../Components";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import axios from "axios";
const Home = () => {
  const [response, setResponse] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [menuurl, setMenuurl] = useState([]);
  useEffect(() => {
    const getData = () => {
      axios
        .get("http://localhost:3000/restaurants")
        .then((res) => {
          setSearchResult(res.data);
          setResponse(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getData();
  }, []);
  const getMenubyID = (restaurant_id) => {
    axios
      .get(`http://localhost:3000/restaurants/menus/${restaurant_id}`)
      .then((res) => {
        setMenuurl(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleChange = (e) => {
    var lowerCase = e.target.value.toLowerCase();
    e.preventDefault();
    setSearchInput(lowerCase);
    const result = response.filter((data) => {
      if (searchInput.length > 0) {
        return data && data.name && data.name.toLowerCase().includes(lowerCase);
      } else {
        return data;
      }
    });
    setSearchResult(result);
  };
  const convertToString = (price) => {
    switch (price) {
      case 1:
        return "$";
        break;
      case 2:
        return "$$";
        break;
      case 3:
        return "$$$";
        break;
    }
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
          <div className="home-item-profile" key={result.id}>
            <Menu
              trigger={buttonPopup}
              setTrigger={setButtonPopup}
              src={menuurl}
            ></Menu>
            <Link to={`/Schedule/${result.id}`} key={result.id}>
              <div className="home-menu-item">
                <div className="home-menu-item-img">
                  <img
                    src={"http://localhost:3000/static/" + result.photo_url}
                    alt="food"
                  />
                </div>
                <div className="home-menu-item-des">
                  <h2>
                    {result.name} - {convertToString(result.price_range)}
                  </h2>
                  <h3>Cuisine: {result.cuisine}</h3>
                  <p>{result.description}</p>
                </div>
                <div className="home-menu-item-table">
                  <div className="home-menu-item-table-att">
                    <h2>Max capacity: </h2>
                    <p>{result.seat_capacity}</p>
                  </div>
                  <div className="home-menu-item-table-att">
                    <h2>Phone number: </h2>
                    <p>{result.phone_number}</p>
                  </div>
                  <div className="home-menu-item-table-att">
                    <h2>Address: </h2>
                    <p>{result.address}</p>
                  </div>
                </div>
              </div>
            </Link>
            <div className="home-menu-item-menu">
              <h4
                onClick={() => {
                  setTimeout(() => {
                    setButtonPopup(true);
                  }, 100);
                  getMenubyID(result.id);
                }}
              >
                View Menu
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
