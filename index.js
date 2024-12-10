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
      const message = " "
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
        message
      });
    } catch (err) {
      console.error('Error fetching data from the database:', err);
      res.status(500).send('Error fetching data from the database');
    }
});

app.post("/catering/book", (req,res) => {
  message = "order submitted successfully!"
  res.render("catering", {message})
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

app.get("/editproduct/:productid", async (req, res) => {
    const productid = req.params.productid;
    try {
      const product = await knex('products')
        .where('productid', productid)
        .select('productid', 'productname', 'productprice', 'productcost', 'producttype')
        .first(); // Fetches the first record as an object
  
      const producttypes = await knex('producttype').select('producttypeid', 'producttypename');
  
      res.render("editproduct", { product, producttypes });
    } catch (err) {
      console.error("Error fetching data from the database:", err);
      res.status(500).send("Error fetching data from the database");
    }
  });
  
  app.post("/editproduct/:productid", async (req, res) => {
    const productid = req.params.productid;
    const { productname, producttype, productprice, productcost } = req.body;
  
    try {
      await knex('products')
        .where('productid', productid)
        .update({
          productname,
          producttype, // Use correct field name
          productprice,
          productcost,
        });
  
      res.redirect("/preferences"); // Redirect to preferences after successful update
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  app.post("/deleteproduct/:productid", async (req, res) => {
    const { productid } = req.params;
  
    try {
      // Delete the product from the database
      await knex('products')
        .where('productid', productid)
        .del();
  
        res.redirect("/preferences"); // Redirect to preferences after successful update
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).send("Internal Server Error");
    }
  });
  

  app.get("/addproducttype", async (req, res) => {
    try {
      res.render("addproducttype"); // Render the form directly
    } catch (err) {
      console.error("Error rendering addproducttype form:", err);
      res.status(500).send("Internal Server Error");
    }
  });
  

  app.get("/editproducttype/:producttypeid", async (req, res) => {
    const { producttypeid } = req.params;
    try {
      const producttype = await knex('producttype')
        .where('producttypeid', producttypeid)
        .select('producttypeid', 'producttypename')
        .first(); // Fetch a single record
  
      if (!producttype) {
        return res.status(404).send("Product type not found");
      }
  
      res.render("editproducttype", { producttype });
    } catch (err) {
      console.error("Error fetching product type:", err);
      res.status(500).send("Internal Server Error");
    }
  });
  

  app.post("/addproducttype", async (req, res) => {
    const { producttypename } = req.body;
  
    try {
      await knex("producttype").insert({
        producttypename,
      });
  
      res.redirect("/preferences"); // Redirect after successful insert
    } catch (error) {
      console.error("Error adding product type:", error);
      res.status(500).send("Internal Server Error");
    }
  });
  

  app.post("/editproducttype/:producttypeid", async (req, res) => {
    const { producttypeid } = req.params; // Get from params
    const { producttypename } = req.body;
  
    try {
      const updatedRows = await knex('producttype')
        .where('producttypeid', producttypeid)
        .update({
          producttypename,
        });
  
      if (updatedRows === 0) {
        return res.status(404).send("Product type not found or not updated");
      }
  
      res.redirect("/preferences"); // Redirect after successful update
    } catch (error) {
      console.error("Error updating product type:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  app.post("/deleteproducttype/:producttypeid", async (req, res) => {
    const { producttypeid } = req.params;
  
    try {
      // Delete the product from the database
      await knex('producttype')
        .where('producttypeid', producttypeid)
        .del();
  
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  

// Render Add Combo Form
app.get("/addcombo", async (req, res) => {
    try {
      // Fetch product list (or other required data for the form, if needed)
      const products = await knex('products').select('productid', 'productname');
      res.render("addcombo", { products }); // Render the form with products for selection
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).send("Error rendering add combo form");
    }
  });
  
  // Add Combo - Form Submission
  app.post("/addcombo", async (req, res) => {
    const { productid, comboname, combodescription } = req.body;
  
    try {
      await knex("combos").insert({
        productid: productid,
        comboname: comboname,
        combodescription: combodescription,
      });
      res.redirect("/preferences"); // Redirect after successful addition
    } catch (error) {
      console.error("Error adding combo:", error);
      res.status(500).send("Internal Server Error");
    }
  });

// Render Edit Combo Form
app.get("/editcombo/:comboid", async (req, res) => {
  const { comboid } = req.params;

  try {
    // Fetch the specific combo to edit
    const combo = await knex('combos')
      .where('comboid', comboid)
      .first();

    // Fetch the product list for dropdown selection
    const products = await knex('products').select('productid', 'productname');

    if (!combo) {
      return res.status(404).send("Combo not found");
    }

    res.render("editcombo", { combo, products });
  } catch (error) {
    console.error("Error fetching combo:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Edit Combo - Form Submission
app.post("/editcombo/:comboid", async (req, res) => {
  const { comboid } = req.params;
  const { productid, comboname, combodescription } = req.body;

  try {
    await knex('combos')
      .where('comboid', comboid)
      .update({
        productid: productid,
        comboname: comboname,
        combodescription: combodescription,
      });

    res.redirect("/preferences"); // Redirect after successful update
  } catch (error) {
    console.error("Error updating combo:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Delete Combo
app.post("/deletecombo/:comboid", async (req, res) => {
    const { comboid } = req.params;
  
    try {
      const deletedRows = await knex('combos')
        .where('comboid', comboid)
        .del();
  
      if (deletedRows === 0) {
        return res.status(404).json({ message: "Combo not found" });
      }
  
      res.status(200).json({ message: "Combo deleted successfully" });
    } catch (error) {
      console.error("Error deleting combo:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
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

app.post("/deletetopping/:id", (req, res) => {
  let toppingid  = req.params.id;

  
    // Delete the product from the database
      knex('toppings')
      .where('toppingid', toppingid)
      .del()
      .then(() => {
        res.redirect("/preferences")
      })
    .catch(error => {
      console.error('Error deleting volunteer:', error);
      res.status(500).send('Internal Server Error');
    });
  });


app.post("/deletetoppingtype/:toppingtypeid", async (req, res) => {
  const { toppingtypeid } = req.params;
  console.log("Topping Type ID to delete:", toppingtypeid);  // Log the toppingtypeid received in the URL

  try {
    // Find the toppingtype based on the toppingtypeid
    const toppingType = await knex('toppingtypes')
      .where('toppingtypeid', toppingtypeid)
      .first();

    if (!toppingType) {
      console.log("Topping type not found for ID:", toppingtypeid);  // Log if the topping type is not found
      return res.status(404).send("Topping type not found");
    }

    console.log("Topping type found:", toppingType);  // Log the found topping type

    // Delete all toppings that reference this toppingtypeid
    await knex('toppings')
      .where('toppingtypeid', toppingtypeid)
      .del();

      // Delete all combo toppings that reference this toppingtypeid
      await knex('combo_toppings')
      .where('toppingid', toppingtypeid)
      .del();

    // Now delete the toppingtype record
    await knex('toppingtypes')
      .where('toppingtypeid', toppingtypeid)
      .del();

    res.redirect("/preferences"); // Redirect after successful delete
  } catch (error) {
    console.error("Error deleting topping type:", error);
    res.status(500).send("Internal Server Error");
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

app.listen(port, console.log('Server listening'))