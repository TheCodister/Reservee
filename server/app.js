const express = require('express');
const cors = require('cors');
const models = require('./models');
const routes = require('./routes/api');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// Use the restaurant and customer models
const { restaurantModel } = models;

// Use the API routes
app.use('/', routes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
