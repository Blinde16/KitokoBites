let express = require("express");

let app = express();

let path = require("path");

const port = 5500;
// This is an edit by BLAKE, JASON, PORTER, and HUDDY

// means we are working with ejs files so we dont make html files but we write in html with embedded javascript or ejs files
app.set("view engine", "ejs");

// refers to the views folder
app.set("views", path.join(__dirname, "views"));

// makes it so you can pull stuff from the req.body
app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));

//  Static middleware 
app.use(express.static(path.join(__dirname, 'public')));

//connects us to our server in postgres
const knex = require("knex") ({
    client : "pg",
    connection : {
        host : "localhost",
        user : "postgres",
        password : "9174",
        database : "kitokobites",
        port : 5432
    }
})


app.get("/", (req,res) => {
    res.render("index")
})

app.post("/login", (req,res) => {
    const { username, password } = req.body;
    
})

app.get("/login", (req,res) => {
    res.render("login")
})
app.get("/signup", (req,res) =>{
    res.render("signup")
})

app.post('/storeLogin', (req, res) => {
    const { username, email, password } = req.body;
    console.log(username + ' ' + email + ' ' + password)
    // Logic to store account info (e.g., saving to a database)
    res.render(`createdAccount`, {user: username});
  });

  // Define the route that renders the menu page
app.get('/menu', async (req, res) => {
    try {
      // Fetch products from the database
      const products = await 
        knex('products')
        .join('producttype', 'producttype', '=', 'producttypeid')
        .select('products.productname', 'producttype.producttypename', 'products.productprice', 'products.productcost');
        
      // Fetch toppings from the database
      const toppings = await 
      knex('toppings')
      .join('toppingtypes', 'toppings.toppingtypeid', '=', 'toppingtypes.toppingtypeid')
      .select('toppingname', 'toppings.toppingtypeid', 'toppingtypename', 'productid');
  
      // Render the EJS template with the products and toppings data
      res.render('menu', {
        products: products,
        toppings: toppings,
      });
    } catch (err) {
      console.error('Error fetching data from the database:', err);
      res.status(500).send('Error fetching data from the database');
    }
  });

app.get('/catering', async (req, res) => {
    try {
      // Fetch products from the database
      const products = await 
        knex('products')
        .join('producttype', 'producttype', '=', 'producttypeid')
        .select('products.productname', 'producttype.producttypename', 'products.productprice', 'products.productcost');
        
      // Fetch toppings from the database
      const toppings = await 
      knex('toppings')
      .join('toppingtypes', 'toppings.toppingtypeid', '=', 'toppingtypes.toppingtypeid')
      .select('toppingname', 'toppings.toppingtypeid', 'toppingtypename', 'productid');
  
      // Render the EJS template with the products and toppings data
      res.render('catering', {
        products: products,
        toppings: toppings,
      });
    } catch (err) {
      console.error('Error fetching data from the database:', err);
      res.status(500).send('Error fetching data from the database');
    }
});

app.get('/ordernow', async (req, res) => {
    try {
      // Fetch products from the database
      const products = await 
        knex('products')
        .join('producttype', 'producttype', '=', 'producttypeid')
        .select('products.productname', 'producttype.producttypename', 'products.productprice', 'products.productcost');
        
      // Fetch toppings from the database
      const toppings = await 
      knex('toppings')
      .join('toppingtypes', 'toppings.toppingtypeid', '=', 'toppingtypes.toppingtypeid')
      .select('toppingname', 'toppings.toppingtypeid', 'toppingtypename', 'productid');
  
      // Render the EJS template with the products and toppings data
      res.render('ordernow', {
        products: products,
        toppings: toppings,
      });
    } catch (err) {
      console.error('Error fetching data from the database:', err);
      res.status(500).send('Error fetching data from the database');
    }
});

app.get('/preferences', async (req, res) => {
    try {
      // Fetch products from the database
      const products = await knex('products')
        .select('productid', 'productname', 'productprice', 'productcost', 'producttype');
  
      // Fetch product types from the database
      const productTypes = await knex('producttype')
        .select('producttypename', 'producttypeid');
  
      // Fetch combos from the database
      const combos = await knex('combos')
        .join('products', 'combos.productid', '=', 'products.productid')
        .select('comboid', 'comboname', 'combodescription', 'products.productname');
  
      // Fetch toppings from the database
      const toppings = await knex('toppings')
        .join('toppingtypes', 'toppings.toppingtypeid', '=', 'toppingtypes.toppingtypeid')
        .select('toppingid', 'toppingname', 'toppings.productid', 'toppingtypes.toppingtypename');
  
      // Fetch topping types from the database
      const toppingTypes = await knex('toppingtypes')
        .select('toppingtypename', 'toppingtypeid');
  
      // Render the preferences page with all fetched data
      res.render('preferences', {
        products: products,
        productTypes: productTypes,
        combos: combos,
        toppings: toppings,
        toppingTypes: toppingTypes
      });
    } catch (err) {
      console.error('Error fetching data from the database:', err);
      res.status(500).send('Error fetching data from the database');
    }
  });
  

app.listen(port, console.log('Server listening'))