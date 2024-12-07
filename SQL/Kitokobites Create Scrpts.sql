-- Customers Table
CREATE TABLE Customers (
    CustID SERIAL PRIMARY KEY,
    CustFirstName VARCHAR(25) NOT NULL,
    CustLastName VARCHAR(50) NOT NULL,
    CustEmail VARCHAR(50),
    CustUsername VARCHAR(50),
    CustPassword VARCHAR(25)
);

-- Orders Table
CREATE TABLE Orders (
    OrderID SERIAL PRIMARY KEY,
    CustomerID INT REFERENCES Customers(CustID),
    OrderDate DATE NOT NULL,
    ShippingDate DATE,
    TotalPrice NUMERIC(10, 2)
);

-- ProductType Table
CREATE TABLE ProductType (
    ProductTypeID SERIAL PRIMARY KEY,
    ProductTypeName VARCHAR(25) NOT NULL
);

-- Products Table
CREATE TABLE Products (
    ProductID SERIAL PRIMARY KEY,
    ProductName VARCHAR(50) NOT NULL,
    ProductType INT REFERENCES ProductType(ProductTypeID),
    ProductPrice NUMERIC(10, 2),
    ProductCost NUMERIC(10, 2)
);

-- Combos Table
CREATE TABLE Combos (
    ComboID SERIAL PRIMARY KEY,
    ProductID INT REFERENCES Products(ProductID),
    ComboName VARCHAR(50) NOT NULL,
    ComboDescription VARCHAR(255)
);

-- Toppings Table
CREATE TABLE Toppings (
    ToppingID SERIAL PRIMARY KEY,
    ToppingName VARCHAR(50) NOT NULL,
    ProductID INT REFERENCES Products(ProductID)
);

-- Combo_Toppings Table
CREATE TABLE Combo_toppings (
    ComboID INT REFERENCES Combos(ComboID),
    ToppingID INT REFERENCES Toppings(ToppingID),
    PRIMARY KEY (ComboID, ToppingID)
);

-- Table for orders with combos
CREATE TABLE Order_Combos (
    OrderID INT REFERENCES Orders(OrderID) ON DELETE CASCADE,
    ComboID INT REFERENCES Combos(ComboID) ON DELETE CASCADE,
    Quantity INT NOT NULL,
    PRIMARY KEY (OrderID, ComboID)
);

-- Table for orders with individual products
CREATE TABLE Order_Products (
    OrderID INT REFERENCES Orders(OrderID) ON DELETE CASCADE,
    ProductID INT REFERENCES Products(ProductID) ON DELETE CASCADE,
    Quantity INT NOT NULL,
    PRIMARY KEY (OrderID, ProductID)
);


CREATE TABLE admin_login (
	adminid SERIAL PRIMARY KEY,
	adminusername VARCHAR(25) NOT NULL,
	adminemail VARCHAR(50),
	adminpasswrd VARCHAR(25) NOT NULL
);