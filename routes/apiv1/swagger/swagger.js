var router = require('express').Router();
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express')

// TODO: SAVE IT IN THE FILE
const swaggeraOptions = {
    swaggerDefinition: { 
        info:{
            title: 'Quadx api',
            version: "1.0.1",
            description: "## Quadx server api\n\n#### Allowed HTTPs requests:\nPOST: Create/Update resource\nGET: Get a resource or list of resources\nPUT: Create/Update a resource\nDELETE: Delete a resource",
            contact:{
                name:"robokishan"
            },
            servers:["http://localhost:5000"]
        },
        consumes: [
            "application/json"
        ],
        produces: [
            "application/json"
        ]
        
    },
    apis:['./index.js',
        './routes/apiv1/login.routes.js',
        './routes/apiv1/*.routes.js',
        './routes/apiv1/Schedular/*.js',
        './routes/apiv2/*.routes.js',
        './routes/apiv1/asset/*.routes.js',
        './routes/apiv1/utils/utils.js'
    ]
};

var options = {
    customCssUrl: 'https://gateway.oizom.com/documentation/swagger-ui.css'
    
  };

  var options2 = {
    customCss: '.swagger-ui .topbar { display: none }'
  };

const swaggerDocs = swaggerJSDoc(swaggeraOptions)
// swagger documentation
router.get('/documentation', swaggerUi.setup(swaggerDocs,options2));
router.use('/documentation/', swaggerUi.serve)
router.get('/swagger.json', (req, res) => {
    try {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerDocs);
    } catch (error) {
      console.log('[SWAGGER]', error);
      res.setHeader('Content-Type', 'application/json');
      res.send({});
    }
  });

module.exports = router;