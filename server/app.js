const express = require('express');
const cors = require('cors');
const models = require('./models');
const routes = require('./routes/api');
const path = require('path')
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// Use the restaurant and customer models
const { restaurantModel } = models;

// Serve static files from the 'public' folder
app.use('/static', express.static(path.join(__dirname, 'public')));

// Use the API routes
app.use('/', routes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
