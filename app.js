const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs').promises;
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect('mongodb+srv://aroraf:S%40mmy22321@techtipsdata.kgv0wyd.mongodb.net/?retryWrites=true&w=majority&appName=TechTipsData', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define the port variable
const port = process.env.PORT || 8080; // Use the provided port or default to 3000

// Set Pug as the view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Session configuration
app.use(session({ 
  secret: 'secret', 
  resave: false, 
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));

// Passport configuration
passport.use(new LocalStrategy(
  async (username, password, done) => {
    const user = await User.findOne({ username });
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  }
));
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// User schema
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  builds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Build' }]
});
const User = mongoose.model('User', UserSchema);

// Build schema
const BuildSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  components: Object
});
const Build = mongoose.model('Build', BuildSchema);

// Routes for homepage
app.get('/', (req, res) => res.render('home'));
app.get('/home', (req, res) => res.render('home'));


// Routes for user registration
app.get('/register', (req, res) => res.render('register'));
app.post('/register', async (req, res) => {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 12);
    const newUser = new User({ username: req.body.username, password: hashedPassword });
    await newUser.save();
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering new user.');
  }
});

// Routes for user login
app.get('/login', (req, res) => res.render('login'));

app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Authentication error:', err);
      return next(err);
    }
    if (!user) {
      console.error('Login failed, user:', user, 'info:', info);
      return res.render('login', { message: info.message });
    }
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.error('Error logging in:', loginErr);
        return next(loginErr);
      }
      return res.redirect('/');
    });
  })(req, res, next);
});


// Route for saving builds
app.post('/save-build', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const newBuild = new Build({ user: req.user._id, components: req.body });
      await newBuild.save();
      req.user.builds.push(newBuild);
      await req.user.save();
      res.send('Build saved successfully!');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error saving build.');
    }
  } else {
    res.redirect('/login');
  }
});

// Logout route
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
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
  

  app.post('/submit-build', (req, res) => {
    console.log(req.body); // Log the entire body to see if you're getting the form data.
    // ...handle the form submission...
    res.send('Build submitted successfully!');
  });
  
// Start the server on the defined port
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
