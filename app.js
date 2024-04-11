const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const app = express();

app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); 

// MongoDB Connection URL
const mongoDbUrl = 'mongodb+srv://aroraf:S%40mmy22321@techtipsdata.kgv0wyd.mongodb.net/?retryWrites=true&w=majority';

// Connect to MongoDB


mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
// Connect to MongoDB with options to handle deprecation warnings and set connection timeout
mongoose.connect(mongoDbUrl, {
  useNewUrlParser: true, // These options are deprecated and can be removed
  useUnifiedTopology: true, // These options are deprecated and can be removed
  serverSelectionTimeoutMS: 5000 // This will timeout the connection attempt after 5 seconds
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

mongoose.connection.on('error', err => console.error('MongoDB connection error:', err));

// Define the port variable
const port = process.env.PORT || 8080;

// Set Pug as the view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Session configuration with connect-mongo
app.use(session({
  secret: 'YourSecretStringHere', // Replace with your own secret, can be any string
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb+srv://aroraf:S%40mmy22321@techtipsdata.kgv0wyd.mongodb.net/?retryWrites=true&w=majority' }), // Make sure this matches the variable defined above
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));


// Passport initialization and session connection
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(new LocalStrategy(
  async (username, password, done) => {
    const user = await User.findOne({ username });
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (!await bcrypt.compare(password, user.password)) {
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

// User schema
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  builds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Build' }]
});
const User = mongoose.model('User', UserSchema);

// Build schema adjusted to include a name and price
const BuildSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  components: [{
    type: String,
    name: String,
    price: Number
  }],
  name: String,
  price: Number
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
  console.log(req.body); // For debugging

  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }

  // Transform the received object into an array of component objects
  // Inside your POST /save-build route handler
  const components = req.body.components.map(component => {
    let price = parseFloat(component.price);
    if (isNaN(price)) {
      // Log the error or handle it as needed
      price = 0; // Setting a default price if NaN
    }
    return {
      type: component.type,
      name: component.name,
      price: price
    };
  });

  // Check if any component has an invalid price
  if (components.some(component => isNaN(component.price))) {
    return res.status(400).send('Invalid component price.');
  }

  

  // Proceed with constructing the build object
  const newBuild = new Build({
    user: req.user._id,
    components: components,
    name: req.body.buildName,
    // Calculate the total price based on the components array
    price: components.reduce((total, component) => total + component.price, 0)
  });

  try {
    await newBuild.save();
    req.user.builds.push(newBuild._id);
    await req.user.save();
    res.redirect('/saved-builds'); // Redirect to the saved builds page
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving build.');
  }
});


function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

app.get('/builds/:buildId', isAuthenticated, async (req, res) => {
  try {
    const build = await Build.findById(req.params.buildId).populate('components.component');
    res.render('build-detail', { build });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching build details.');
  }
});

app.get('/saved-builds', isAuthenticated, async (req, res) => {
  try {
    const userWithBuilds = await User.findById(req.user._id).populate('builds');
    const builds = userWithBuilds.builds.map(build => {
      // Add check for build.components array
      const totalPrice = Array.isArray(build.components) ?
        build.components.reduce((sum, component) => sum + (component.price * component.quantity), 0) : 0;
      return {
        ...build.toObject(),
        totalPrice
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
