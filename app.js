const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs').promises;

// Define the port variable
const port = process.env.PORT || 3000; // Use the provided port or default to 3000

// Set Pug as the view engine
app.set('view engine', 'pug');

// Note: When running on Azure, __dirname will be /home/site/wwwroot if app.js is in the root
app.set('views', path.join(__dirname, 'views'));

app.get('/api/components/cpu', async (req, res) => {
    try {
      const data = await fs.readFile('./data/json/updated-cpu.json', 'utf8'); // updated path
      const cpus = JSON.parse(data);
      res.json(cpus);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  app.get('/api/components/motherboard', async (req, res) => {
    try {
      const data = await fs.readFile('./data/json/updated-motherboard.json', 'utf8');
      const motherboards = JSON.parse(data);
      const socket = req.query.socket;
      const compatibleMotherboards = motherboards.filter(mb => mb.socket === socket);
      res.json(compatibleMotherboards);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  
  app.get('/build-pc', async (req, res) => {
    try {
      // Read the CPU data
      const cpuData = await fs.readFile('./data/json/updated-cpu.json', 'utf8');
      const cpus = JSON.parse(cpuData);
  
      // Read the Motherboard data
      const motherboardData = await fs.readFile('./data/json/updated-motherboard.json', 'utf8');
      const motherboards = JSON.parse(motherboardData);
  
      // Pass both CPU and Motherboard data to your Pug template
      res.render('build-pc', { cpus: cpus, motherboards: motherboards });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  


// Serve static files from the 'public' directory
// Ensure the 'public' directory is also within /home/site/wwwroot
app.use(express.static(path.join(__dirname, 'public')));

// Define routes for your application
app.get('/', (req, res) => res.render('home'));
app.get('/home', (req, res) => res.render('home'));
app.get('/build-pc', (req, res) => res.render('build-pc'));

// Start the server on the defined port
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
