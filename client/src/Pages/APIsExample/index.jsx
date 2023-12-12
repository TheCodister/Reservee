import React, { useState, useEffect } from 'react';

const APIsExample = (props) => {
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantName, setRestaurantName] = useState('');

  useEffect(() => {
    // Fetch restaurants from the server when the component mounts
    fetch('http://localhost:3000/restaurants')
      .then((response) => response.json())
      .then((data) => setRestaurants(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []); // Empty dependency array to run the effect only once

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to add a new restaurant
      const response = await fetch('http://localhost:3000/restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: restaurantName }),
      });

      if (response.ok) {
        console.log('Restaurant added successfully!');
        // Fetch updated restaurant list after adding a new restaurant
        const updatedRestaurants = await fetch('http://localhost:3000/restaurants')
          .then((res) => res.json())
          .catch((err) => console.error('Error fetching updated data:', err));

        setRestaurants(updatedRestaurants);
        // Reset the form or update state as needed
        setRestaurantName('');
      } else {
        console.error('Failed to add restaurant:', response.status);
      }
    } catch (error) {
      console.error('Error adding restaurant:', error.message);
    }
  };

  return (
    <div>
      <h1>List of Restaurants</h1>
      <ul>
        {restaurants.map((restaurant) => (
          <li key={restaurant.id}>{restaurant.name}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <label>
          Restaurant Name:
          <input
            type="text"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
          />
        </label>
        <button type="submit">Add Restaurant</button>
      </form>
    </div>
  );
}

export default APIsExample;
