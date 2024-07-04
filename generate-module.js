const fs = require('fs');
const path = require('path');
const { program } = require('commander');

program
  .argument('<module>', 'module name')
  .option('-p, --public', 'generate a public module')
  .action((module, options) => {
    const moduleName = module.toLowerCase();
    const controllerContent = `
      exports.get${module} = (req, res) => {
        res.render('${module}/index');
      };
    `;

    const routeContent = options.public ? `
      const express = require('express');
      const { get${module} } = require('../controllers/${module}Controller');
      const router = express.Router();
      router.get('/', get${module});
      module.exports = router;
    ` : `
      const express = require('express');
      const { get${module} } = require('../controllers/${module}Controller');
      const { ensureAuthenticated } = require('../middlewares/authMiddleware');
      const router = express.Router();
      router.get('/', ensureAuthenticated, get${module});
      module.exports = router;
    `;

    const viewContent = options.public ? `<!-- views/${module}/index.ejs --> 
    <%- include('../layouts/header-guest', { pageTitle: '${module}' }) %>
    <div class="flex h-screen bg-slate-200">
        <div class="m-auto">
          <h1 class="font-bold text-slate-600">${module} Page</h1>
        </div>
    </div>
    <%- include('../layouts/footer-guest') %>
    ` : `<!-- views/${module}/index.ejs --> 
    <%- include('../layouts/header-main', { pageTitle: '${module}' }) %>
    <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-4">${module} Page</h1>
    </div>
    <%- include('../layouts/footer-main') %>`;

    fs.writeFileSync(`controllers/${module}Controller.js`, controllerContent);
    fs.writeFileSync(`routes/${module}.js`, routeContent);
    fs.mkdirSync(`views/${module}`, { recursive: true });
    fs.writeFileSync(`views/${module}/index.ejs`, viewContent);

    const appContent = fs.readFileSync('app.js', 'utf-8');
    const updatedAppContent = appContent.replace(
      '// module routes',
      `const ${moduleName}Routes = require('./routes/${moduleName}');\napp.use('/${moduleName}', ${moduleName}Routes);\n// module routes`
    );
    fs.writeFileSync('app.js', updatedAppContent);
  });

program.parse(process.argv);
