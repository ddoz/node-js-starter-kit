const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const path = require('path');
require('dotenv').config();
const fs = require('fs');
const { ensureAuthenticated } = require('./middlewares/authMiddleware');

const APP_PORT = process.env.APP_PORT
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', authRoutes);

const homeRoutes = require('./routes/home');
app.use('/home', homeRoutes);
const newsRoutes = require('./routes/news');
app.use('/news', newsRoutes);
// module routes
fs.readdirSync(path.join(__dirname, 'routes')).forEach((file) => {
  if (file !== 'auth.js' && file !== 'index.js') {
    const route = file.split('.')[0];
    const routeModule = require(`./routes/${route}`);
    const isPublic = fs.readFileSync(`routes/${file}`, 'utf-8').includes('ensureAuthenticated');
    app.use(`/${route}`, isPublic ? routeModule : [ensureAuthenticated, routeModule]);
  }
});

sequelize.sync().then(() => {
  app.listen(APP_PORT, () => console.log(`Server running on PORT ${APP_PORT}`));
}).catch(err => console.log(err));
