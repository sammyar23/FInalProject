const express = require('express');
const path = require('path');
const app = express();

// Define the port variable
const port = process.env.PORT || 3000; // Use the provided port or default to 3000

// Set Pug as the view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define a route for the homepage
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/build', (req, res) => {
  res.render('build-pc');
})

// Start the server on the defined port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
