const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb+srv://aroraf:S%40mmy22321@techtipsdata.kgv0wyd.mongodb.net/?retryWrites=true&w=majority&appName=TechTipsData', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define the port variable
const port = process.env.PORT || 8080;

// Set Pug as the view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

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
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

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

// Middleware to make user object available in all templates
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
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
  const newBuild = new Build({ user: req.user._id, components: req.body });
  await newBuild.save();
  req.user.builds.push(newBuild._id);
  await req.user.save();
  res.redirect('/saved-builds');
});

// Assuming each component of the build has a 'price' field
app.get('/saved-builds', async (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/login');

  try {
    const userWithBuilds = await User.findById(req.user._id).populate({
      path: 'builds',
      populate: { path: 'components' } // Assuming 'components' is a reference to another schema
    });

    const builds = userWithBuilds.builds.map(build => {
      // Calculate the total price of the build
      const totalAmount = build.components.reduce((sum, component) => sum + component.price, 0);
      return {
        ...build.toObject(), // Convert mongoose document to a plain JavaScript object
        amount: totalAmount // Add the calculated amount here
      };
    });

    res.render('saved-builds', { builds: builds });
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
