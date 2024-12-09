let express = require("express");

let app = express();

let router = express.Router();

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

app.get("/aboutus", (req,res) => {
    res.render("aboutus")
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

app.get("/addproduct",  async (req,res) =>{
    try {
    const products = await knex('products')
    .select(
        'productid', 
        'productname', 
        'productprice', 
        'productcost', 
    );
   
    const producttype = await knex('producttype')
    .select(
        'producttypeid', 
        'producttypename'
    );

    res.render("addproduct", {
        products: products,
        producttype: producttype
        })

    } catch (err) {
      console.error('Error fetching data from the database:', err);
      res.status(500).send('Error fetching data from the database');
    }
})

app.post("/addproduct", (req,res) =>{

    const { 
        productname, 
        producttype, 
        price, 
        cost
      } = req.body;
      console.log('Form submitted');

    // Insert the new Character into the database
    knex("products")
    .insert({
      productname: productname,
      producttype: producttype,
      price: price,
      cost: cost
    })
    .then(() => {
        res.redirect('/preferences'); // Redirect to the volunteer list page after adding
      })
      .catch(error => {
        console.error('Error adding product:', error);
        res.status(500).send('Internal Server Error');
      })
})

app.get("/editproduct/:productid", async (req,res) =>{
    try {
    knex('products')
    .select(
        'productid', 
        'productname', 
        'productprice', 
        'productcost', 
    )
    .then(products => {knex('producttype').select('producttypeid', 'producttypename')
        .then(producttype => 
            { res.render("editproduct", {products, producttype}
                )
            }
            )
        }
    );
   
    const producttype = await knex('producttype')
    .select(
        'producttypeid', 
        'producttypename'
    );

    res.render("editproduct", {
        products: products,
        producttype: producttype
        })

    } catch (err) {
      console.error('Error fetching data from the database:', err);
      res.status(500).send('Error fetching data from the database');
    }

    let id = req.params.id
    knex("volunteer").join("heardabout", "heardabout.heardaboutid", "=", "volunteer.heardaboutid")
    .join("sewinglevel", "sewinglevel.sewinglevelid", '=', 'volunteer.sewinglevelid')
    .join("sewingpreference", "sewingpreference.sewingpreferenceid", "=", "volunteer.sewingpreferenceid")
    .join("address", "address.addressid", "=", "volunteer.addressid")
    .select('volunteerid', 
      'volunteer.heardaboutid', 
      'address.city as volunteercity',
      'address.state as volunteerstate',
      'sewingpreference.description as sewingpreferencedescription',
      'sewinglevel.description as sewingleveldescription',
      'heardabout.description as heardaboutdescription', 
      'volunteer.first_name', 
      'volunteer.last_name', 
      'volunteer.email',
      'volunteer.phone_number',
      'volunteer.hourspermonth',
      'volunteer.sewinglevelid',
      'volunteer.sewingpreferenceid',
      'volunteer.addressid'
    )
    .where("volunteerid", id).first().then(volunteer => {
      knex("heardabout").select("heardaboutid", "description").then(heardAboutOptions => {
      knex("sewinglevel").select("sewinglevelid", "description").then(sewingLevelOptions => {
        knex("sewingpreference").select("sewingpreferenceid", "description").then(sewingPreferenceOptions => {
          res.render('editVolunteer', {volunteer, heardAboutOptions, sewingLevelOptions, sewingPreferenceOptions})
        })
      })
      })
    })
    .catch(error => {
      console.error('Error fetching Data:', error);
      res.status(500).send('Internal Server Error');
    });
})

app.post("/editproduct", (req,res) =>{
    const {
        productid,
        productname,
        producttypeid,
        productprice,
        productcost
      } = req.body;
      console.log('Form submitted');
  // Update the Volunteer in the database
  knex('product')
    .where('productid', productid)
    .update({
        productname: productname,
        producttypeid: producttypeid,
        productprice: productprice,
        productcost: productcost
    })
  .then(() => {
    // Redirect after both updates succeed
    res.redirect("/preferences");
  })
  .catch(error => {
    console.error('Error updating volunteer or address:', error);
    res.status(500).send('Internal Server Error');
  });
})

app.get("/addproducttype",  async (req,res) =>{
    try { 
    const producttype = await knex('producttype')
    .select(
        'producttypeid', 
        'producttypename'
    );

    res.render("addproducttype", {
        producttype: producttype
        })

    } catch (err) {
      console.error('Error fetching data from the database:', err);
      res.status(500).send('Error fetching data from the database');
    }
})

app.get("/editproducttype/:producttypeid",  async (req,res) =>{
    try { 
    const producttype = await knex('producttype')
    .select(
        'producttypeid', 
        'producttypename'
    );

    res.render("/editproducttype", {
        producttype: producttype
        })

    } catch (err) {
      console.error('Error fetching data from the database:', err);
      res.status(500).send('Error fetching data from the database');
    }
})

app.post("/addproducttype", (req,res) =>{

    const { 
        producttypename, 
      } = req.body;
      console.log('Form submitted');

    // Insert the new Character into the database
    knex("producttypename")
    .insert({
      producttypename: producttypename
    })
    .then(() => {
        res.redirect('/preferences'); // Redirect to the volunteer list page after adding
      })
      .catch(error => {
        console.error('Error adding product:', error);
        res.status(500).send('Internal Server Error');
      })
})

app.post("/editproducttype/:producttypeid", (req,res) =>{
    const { 
        producttypeid,
        producttypename
      } = req.body;
      console.log('Form submitted');
  
  // Update the Volunteer in the database
  knex('producttype')
    .where('producttypeid', producttypeid)
    .update({
      producttypename: producttypename
    })
  .then(() => {
    // Redirect after both updates succeed
    res.redirect("/preferences");
  })
  .catch(error => {
    console.error('Error updating volunteer or address:', error);
    res.status(500).send('Internal Server Error');
  });
})

app.get("/addcombo", (req,res) =>{

    const { 
        productid,
        comboname,
        combodescription 
      } = req.body;
      console.log('Form submitted');

    // Insert the new Character into the database
    knex("combos")
    .insert({
        productid: productid,
        comboname: comboname,
        combodescription: combodescription
    })
    .then(() => {
        res.redirect('/preferences'); // Redirect to the volunteer list page after adding
      })
      .catch(error => {
        console.error('Error adding product:', error);
        res.status(500).send('Internal Server Error');
      })
})

app.get("/editcombo/:comboid",  async (req,res) =>{
    try { 
    const combo = await 
    knex('combos')
    .select(
        'comboid', 
        'productid',
        'comboname',
        'combodescription'
    );

    res.render("/editproducttype", {
        combo: combo
        })

    } catch (err) {
      console.error('Error fetching data from the database:', err);
      res.status(500).send('Error fetching data from the database');
    }
})

app.post("/addcombo", (req,res) =>{

    const { 
        productid,
        comboname,
        combodescription 
      } = req.body;
      console.log('Form submitted');

    // Insert the new Character into the database
    knex("combos")
    .insert({
        productid: productid,
        comboname: comboname,
        combodescription: combodescription
    })
    .then(() => {
        res.redirect('/preferences'); // Redirect to the volunteer list page after adding
      })
      .catch(error => {
        console.error('Error adding product:', error);
        res.status(500).send('Internal Server Error');
      })
})

app.post("/editcombo/:comboid", (req,res) =>{
    const { 
        comboid,
        productid,
        comboname,
        combodescription
      } = req.body;
      console.log('Form submitted');
  
  // Update the Volunteer in the database
  knex('combos')
    .where('comboid', comboid)
    .update({
        productid: productid,
        comboname: comboname,
        combodescription: combodescription
    })
  .then(() => {
    // Redirect after both updates succeed
    res.redirect("/preferences");
  })
  .catch(error => {
    console.error('Error updating volunteer or address:', error);
    res.status(500).send('Internal Server Error');
  });
})

// GET route to render the form for adding a topping
app.get("/addtopping", async (req, res) => {
  try {
    // Fetch all topping types from the correct 'toppingtypes' table
    const toppingTypes = await knex('toppingtypes')  // Use 'toppingtypes' instead of 'toppingtype'
      .select('toppingtypeid', 'toppingtypename');

    // Get the next topping ID (one more than the max toppingid)
    const maxToppingId = await knex('toppings')
      .max('toppingid as maxToppingId')
      .first();

    const newToppingId = maxToppingId.maxToppingId + 1; // Next topping ID

    res.render('addtoppings', {
      toppingTypes: toppingTypes, // Pass the topping types to the view
      newToppingId: newToppingId  // Pass the next topping ID
    });
  } catch (err) {
    console.error('Error fetching data for form:', err);
    res.status(500).send('Error fetching data for form');
  }
});


// POST route to handle form submission and insert the new topping into the database
app.post("/addtopping", (req, res) => {
  const { 
    toppingid,    // New topping ID
    toppingname,  // Topping name from the form
    toppingtypeid // Selected topping type ID
  } = req.body;

  console.log('Form submitted');

  // Insert the new Topping into the database
  knex("toppings")
    .insert({
      toppingid: toppingid,       // Use the calculated next topping ID
      toppingname: toppingname,   // Insert topping name
      toppingtypeid: toppingtypeid // Insert topping type ID
    })
    .then(() => {
      res.redirect('/preferences'); // Redirect to the preferences page after adding
    })
    .catch(error => {
      console.error('Error adding topping:', error);
      res.status(500).send('Internal Server Error');
    });
});

// GET route to render the edit topping page
app.get('/edittopping/:id', (req, res) => {
  const toppingId = req.params.id;

  // Query the database to fetch the topping by its id
  knex('toppings')
    .where('toppingid', toppingId)
    .first()
    .then((topping) => {
      if (!topping) {
        return res.status(404).send('Topping not found');
      }

      // Fetch all topping types
      knex('toppingtypes')
        .then((toppingTypes) => {
          res.render('edittopping', { topping, toppingTypes });
        })
        .catch((error) => {
          console.error('Error fetching topping types', error);
          res.status(500).send('Error fetching topping types');
        });
    })
    .catch((error) => {
      console.error('Error fetching topping data', error);
      res.status(500).send('Error fetching data');
    });
});

// POST route to update the topping
app.post('/edittopping/:id', (req, res) => {
  const toppingId = req.params.id;
  const { toppingname, toppingtypeid } = req.body;

  // Update the topping in the database
  knex('toppings')
    .where('toppingid', toppingId)
    .update({
      toppingname,
      toppingtypeid
    })
    .then(() => {
      // Redirect to the topping list or another page
      res.redirect('/preferences'); // Or change this to another appropriate page
    })
    .catch((error) => {
      console.error('Error updating topping', error);
      res.status(500).send('Error updating topping');
    });
});


// Route to render the add/edit topping type form
app.get('/addtoppingtype/:id?', async (req, res) => {
  const toppingtypeid = req.params.id;
  try {
    if (toppingtypeid) {
      // Edit existing topping type, fetch it from the database
      const toppingtype = await knex('toppingtypes').where({ toppingtypeid }).first();
      if (toppingtype) {
        res.render('addtoppingtype', { toppingtype }); // Pass toppingtype data to the EJS template
      } else {
        res.status(404).send('Topping type not found');
      }
    } else {
      // New topping type, render empty form
      res.render('addtoppingtype', { toppingtype: { toppingtypename: '', toppingtypeid: '' } });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong');
  }
});

app.post('/toppingtypes/:id?', async (req, res) => {
  try {
    const { toppingtypename } = req.body;  // Get topping name from the form input
    const toppingtypeid = req.params.id;   // Get topping type ID from URL parameters

    if (toppingtypeid) {
      // If `toppingtypeid` exists, we are updating an existing topping type
      const updatedRows = await knex('toppingtypes')
        .where({ toppingtypeid })
        .update({ toppingtypename });

      if (updatedRows > 0) {
        // Redirect to a list of topping types or another appropriate page after update
        res.redirect('/preferences');
      } else {
        // If no rows were updated, send a 404 error
        res.status(404).send('Topping type not found');
      }
    } else {
      // If no `toppingtypeid`, we are adding a new topping type
      await knex('toppingtypes').insert({ toppingtypename });
      // After adding, redirect to a list page or another appropriate page
      res.redirect('/preferences');
    }
  } catch (error) {
    // Log the error to the console for better debugging
    console.error('Error occurred in POST /toppingtypes:', error);
    res.status(500).send('Something went wrong');
  }
});

// Route to render the edit form
app.get('/edittoppingtype/:id', async (req, res) => {
  const toppingtypeid = req.params.id;
  try {
    const toppingtype = await knex('toppingtypes').where({ toppingtypeid }).first();
    if (toppingtype) {
      res.render('edittoppingtypes', { toppingtype }); // Render the form with current topping type data
    } else {
      res.status(404).send('Topping type not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong');
  }
});

// POST route to handle the update
app.post('/edittoppingtype/:id', async (req, res) => {
  const toppingtypeid = req.params.id;
  const { toppingtypename } = req.body;  // Get the updated name from the form
  try {
    const updatedRows = await knex('toppingtypes')
      .where({ toppingtypeid })
      .update({ toppingtypename });

    if (updatedRows > 0) {
      res.redirect('/preferences'); // Redirect to a preferences or list page after update
    } else {
      res.status(404).send('Topping type not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong');
  }
});



app.get('/login', (req,res) => {
  let security = false;
  let message = " "
  res.render("login", {security, message})
})

// Admin login post route
app.post('/login', (req, res) => {
const username = req.body.username;
const password = req.body.password;
  // Query the user table to find the record
  const user = knex('admin_login')
    .select('*')
    .where({ adminusername:username, adminpasswrd:password }) // Replace with hashed password comparison in production
    .first() // Returns the first matching record
    .then(user => {
      if (user) {
        security = true;
        message = "Welcome"
        res.render('login', {security, message})
    } else {
        security = false;
        message = "You entered the wrong username or password"
        res.render("login", {security, message})
    }
    // res.render('index', {security})
    })
    .catch(error => {
      console.error('Error adding Character:', error);
      res.status(500).send('Internal Server Error');
    })
});


app.post('/ordernowsubmit', async (req, res) => {
  try {
      // Your code for handling the order goes here
      console.log(req.body); // Debug: Check if the data is coming through
      res.send("Order submitted successfully!");
  } catch (err) {
      console.error(err);
      res.status(500).send("Something went wrong");
  }
});


router.post('/ordernowsubmit', async (req, res) => {
  const { name, email, phone, orderDetails } = req.body;

  // Split name into first and last name
  const [firstName, ...lastNameParts] = name.split(' ');
  const lastName = lastNameParts.join(' ');

  const parsedOrderDetails = JSON.parse(orderDetails); // Parse order details JSON
  const { cart, toppings } = parsedOrderDetails;

  try {
    // Start a transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Step 1: Insert customer if not exists
      const customerQuery = `
        INSERT INTO Customers (CustFirstName, CustLastName, CustEmail, CustUsername, CustPassword)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (CustEmail) DO UPDATE SET CustFirstName = $1, CustLastName = $2
        RETURNING CustID;
      `;
      const customerValues = [firstName, lastName, email, phone, 'default_password'];
      const customerResult = await client.query(customerQuery, customerValues);
      const customerID = customerResult.rows[0].custid;

      // Step 2: Insert order
      const orderQuery = `
        INSERT INTO Orders (CustomerID, OrderDate, TotalPrice)
        VALUES ($1, CURRENT_DATE, $2)
        RETURNING OrderID;
      `;
      const totalPrice = cart.reduce((sum, item) => sum + item.price, 0) + toppings.length * 0.5;
      const orderResult = await client.query(orderQuery, [customerID, totalPrice]);
      const orderID = orderResult.rows[0].orderid;

      // Step 3: Insert products into Order_Products
      const productQuery = `
        INSERT INTO Order_Products (OrderID, ProductID, Quantity)
        VALUES ($1, $2, $3);
      `;
      for (const product of cart) {
        await client.query(productQuery, [orderID, product.id, 1]);
      }

      // Step 4: Insert toppings into a hypothetical Order_Toppings table
      const toppingQuery = `
        INSERT INTO Order_Products (OrderID, ProductID, Quantity)
        VALUES ($1, $2, $3);
      `;
      for (const topping of toppings) {
        await client.query(toppingQuery, [orderID, 1 /* Placeholder ProductID for topping */, 1]);
      }

      // Commit the transaction
      await client.query('COMMIT');

      res.status(200).send({ message: 'Order placed successfully!', orderID });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Transaction error:', error);
      res.status(500).send({ error: 'Failed to place the order. Please try again.' });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).send({ error: 'Database connection failed. Please try again.' });
  }
});

module.exports = router;

app.listen(port, console.log('Server listening'))