import React, { useState, useEffect } from "react";

const APIsExample = (props) => {
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantPhoto, setRestaurantPhoto] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantCuisine, setRestaurantCuisine] = useState("");
  const [restaurantAddress, setRestaurantAddress] = useState("");
  const [restaurantPhone, setRestaurantPhone] = useState("");
  const [restaurantSeat, setRestaurantSeat] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to add a new restaurant
      const response = await fetch("http://localhost:3000/restaurants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          photo_url: restaurantPhoto,
          name: restaurantName,
          cuisine: restaurantCuisine,
          address: restaurantAddress,
          phone_number: restaurantPhone,
          seat_capacity: restaurantSeat,
        }),
      });

      if (response.ok) {
        console.log("Restaurant added successfully!");
        // Fetch updated restaurant list after adding a new restaurant
        const updatedRestaurants = await fetch(
          "http://localhost:3000/restaurants"
        )
          .then((res) => res.json())
          .catch((err) => console.error("Error fetching updated data:", err));

        setRestaurants(updatedRestaurants);
        // Reset the form or update state as needed
        setRestaurantName("");
      } else {
        console.error("Failed to add restaurant:", response.status);
      }
    } catch (error) {
      console.error("Error adding restaurant:", error.message);
    }
  };

  const fetchRestaurants = async (keyword) => {
    const url = keyword
      ? `http://localhost:3000/restaurants/search?keyword=${encodeURIComponent(
          keyword
        )}`
      : "http://localhost:3000/restaurants";

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setRestaurants(data);
      } else {
        console.error("Failed to fetch restaurants:", response.status);
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error.message);
    }
  };

  useEffect(() => {
    // Fetch all restaurants initially
    fetchRestaurants();
  }, []);

  const handleSearch = () => {
    // Fetch restaurants based on the search keyword
    fetchRestaurants(searchKeyword);
  };


  return (
    <div>
      <h1>List of Restaurants</h1>
      <input
        type="text"
        placeholder="Search by name, address, or cuisine"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
      />

      {/* Search button */}
      <button onClick={handleSearch}>Search</button>

      <ul>
        {restaurants.map((restaurant) => (
          <li key={restaurant.id}>
            <img
              src={`http://localhost:3000/static/${restaurant.photo_url}`}
              alt={restaurant.name}
            />
            <p>{restaurant.name}</p>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <label>
          Restaurant Photo URL:
          <input
            type="text"
            value={restaurantPhoto}
            onChange={(e) => setRestaurantPhoto(e.target.value)}
          />
        </label>
        <label>
          Photo:
          <input
            type="text"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
          />
        </label>
        <label>
          Cuisine:
          <input
            type="text"
            value={restaurantCuisine}
            onChange={(e) => setRestaurantCuisine(e.target.value)}
          />
        </label>
        <label>
          Address:
          <input
            type="text"
            value={restaurantAddress}
            onChange={(e) => setRestaurantAddress(e.target.value)}
          />
        </label>
        <label>
          Phone number:
          <input
            type="text"
            value={restaurantPhone}
            onChange={(e) => setRestaurantPhone(e.target.value)}
          />
        </label>
        <label>
          Seat Capacity:
          <input
            type="text"
            value={restaurantSeat}
            onChange={(e) => setRestaurantSeat(e.target.value)}
          />
        </label>
        <button type="submit">Add Restaurant</button>
      </form>
    </div>
  );
};

export default APIsExample;
