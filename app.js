const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const app = express();

mongoose.connect('mongodb+srv://aroraf:S%40mmy22321@techtipsdata.kgv0wyd.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Rest of the code...

const BuildSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  components: [{
    component: { type: mongoose.Schema.Types.ObjectId, ref: 'Component' },
    quantity: Number
  }],
  name: String,
  price: Number
});
const Build = mongoose.model('Build', BuildSchema);

// Rest of the code...

app.get('/saved-builds', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }

  try {
    const userWithBuilds = await User.findById(req.user._id).populate({
      path: 'builds',
      populate: { path: 'components.component' }
    });

    // Assume each component in the build has a price property
    const builds = userWithBuilds.builds.map(build => {
      const totalAmount = build.components.reduce((sum, item) => {
        return sum + (item.component.price * item.quantity);
      }, 0);
      return { ...build.toObject(), amount: totalAmount };
    });

    res.render('saved-builds', { builds });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching builds.');
  }
});

// Routes
app.get('/', (req, res) => res.render('home'));

app.get('/register', (req, res) => res.render('register'));
app.post('/register', async (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.body.password, 12);
  const newUser = new User({ username: req.body.username, password: hashedPassword });
  await newUser.save();
  res.redirect('/login');
});

app.get('/login', (req, res) => res.render('login'));
app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }),
  (req, res) => res.redirect('/'));

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});


app.post('/save-build', async (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/login');

  const newBuild = new Build({ 
    user: req.user._id, 
    components: req.body.components.map(c => ({ component: c.id, quantity: c.quantity })), 
    name: req.body.buildName, 
    price: req.body.totalPrice 
  });

  try {
    await newBuild.save();
    req.user.builds.push(newBuild._id);
    await req.user.save();
    res.redirect('/saved-builds');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving build.');
  }
});

app.get('/saved-builds', async (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/login');

  try {
    const userWithBuilds = await User.findById(req.user._id).populate('builds');
    // Assuming each build has a 'components' array with prices
    const builds = userWithBuilds.builds.map(build => {
      const totalAmount = build.components.reduce((sum, component) => sum + component.price, 0);
      return {
        ...build.toObject(),
        amount: totalAmount // Add a new property 'amount' with the total price
      };
    });
    res.render('saved-builds', { builds });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching builds.');
  }
});



// Logout route
app.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

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
      // Read the data for CPUs and Motherboards (existing code)
      const cpuData = await fs.readFile('./data/json/updated-cpu.json', 'utf8');
      const cpus = JSON.parse(cpuData);
      const motherboardData = await fs.readFile('./data/json/updated-motherboard.json', 'utf8');
      const motherboards = JSON.parse(motherboardData);
      const gpuData = await fs.readFile('./data/json/video-card.json', 'utf8');
      const gpus = JSON.parse(gpuData);
      const memoryData = await fs.readFile('./data/json/memory.json', 'utf8');
      const memory = JSON.parse(memoryData);
  
      // Add new components here
      const caseData = await fs.readFile('./data/json/case.json', 'utf8');
      const cases = JSON.parse(caseData);
      const caseFanData = await fs.readFile('./data/json/case-fan.json', 'utf8');
      const case_fans = JSON.parse(caseFanData);
      const cpuCoolerData = await fs.readFile('./data/json/cpu-cooler.json', 'utf8');
      const cpu_coolers = JSON.parse(cpuCoolerData);
      const internalHardDriveData = await fs.readFile('./data/json/internal-hard-drive.json', 'utf8');
      const internal_hard_drives = JSON.parse(internalHardDriveData);
      const powerSupplyData = await fs.readFile('./data/json/power-supply.json', 'utf8');
      const power_supplies = JSON.parse(powerSupplyData);
      const soundCardData = await fs.readFile('./data/json/sound-card.json', 'utf8');
      const sound_cards = JSON.parse(soundCardData);
  
      // Pass all the components to the Pug template
      res.render('build-pc', {
        cpus, 
        motherboards, 
        gpus, 
        memory,
        cases,
        case_fans,
        cpu_coolers,
        internal_hard_drives,
        power_supplies,
        sound_cards
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
// Start the server on the defined port
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
