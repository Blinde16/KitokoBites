-- Reset sequence for ProductTypeID in ProductType table
ALTER SEQUENCE producttype_producttypeid_seq RESTART WITH 1;

-- Reset sequence for ProductID in Products table
ALTER SEQUENCE products_productid_seq RESTART WITH 1;

-- Reset sequence for ComboID in Combos table
ALTER SEQUENCE combos_comboid_seq RESTART WITH 1;

-- Reset sequence for ToppingID in Toppings table
ALTER SEQUENCE toppings_toppingid_seq RESTART WITH 1;

-- Reset sequence for OrderID in Orders table
ALTER SEQUENCE orders_orderid_seq RESTART WITH 1;

-- Reset sequence for CustID in Customers table
ALTER SEQUENCE customers_custid_seq RESTART WITH 1;

-- Reset sequence for AdminID in admin_login table
ALTER SEQUENCE admin_login_adminid_seq RESTART WITH 1;

INSERT INTO ProductType (ProductTypeName)
VALUES
    ('Gluten-Free'),
    ('GF & Sugar-Free'),
    ('Sugar-Free'),
    ('Vegan');

INSERT INTO Products (ProductName, ProductType, ProductPrice, ProductCost)
VALUES
    ('Dirty Snow', 1, 5.99, 2.50),
    ('Cinna Colatte', 2, 6.99, 3.00),
    ('Iced Coco', 3, 4.99, 2.00),
    ('Coco Nutty', 1, 7.49, 3.50),
    ('Tropical Delight', 4, 5.49, 2.25),
    ('Tropical Fever', 4, 5.99, 2.50),
    ('Tropical Sundae', 4, 6.49, 3.00),
    ('Tropical Sensation', 4, 7.49, 3.50),
    ('Salad', 4, 4.49, 1.75),
    ('Snow Colatte', 1, 6.99, 3.00),
    ('Sticky Nutty', 2, 6.49, 2.75),
    ('Nutty Nutty', 3, 7.49, 3.50),
    ('Yellow Snow', 1, 5.99, 2.50),
    ('Yin Yang', 2, 6.99, 3.00);
INSERT INTO ToppingTypes (ToppingTypeName)
VALUES
    ('Drizzle'),
    ('Sprinkle');
-- Customers
-- Sprinkle toppings
INSERT INTO Toppings (ToppingName, ProductID, ToppingTypeID)
VALUES
    ('Almond Crumbs', NULL, 2),
    ('Cashew Crumbs', NULL, 2),
    ('Coconut Flakes', NULL, 2),
    ('Macademia Crumbs', NULL, 2),
    ('Peanut Crumbs', NULL, 2),
    ('Pecans Crumbs', NULL, 2),
    ('Pistachios Crumbs', NULL, 2),
    ('Sparkle', NULL, 2),
    ('Walnut Crumbs', NULL, 2);
-- drizzle toppings
INSERT INTO Toppings (ToppingName, ProductID, ToppingTypeID)
VALUES
    ('Secret Sauce', NULL, 1),
    ('Chocolate (white)', NULL, 1),
    ('Honey', NULL, 1),
    ('Glaze', NULL, 1),
    ('Peanut Butter', NULL, 1),
    ('Almond Butter', NULL, 1),
    ('Apple Butter', NULL, 1);

INSERT INTO Customers (CustFirstName, CustLastName, CustEmail, CustUsername, CustPassword)
VALUES
    ('John', 'Doe', 'johndoe@example.com', 'johndoe', 'password123'),
    ('Jane', 'Smith', 'janesmith@example.com', 'janesmith', 'pass456'),
    ('Alice', 'Johnson', 'alicej@example.com', 'alicejohnson', 'mypassword789'),
    ('Bob', 'Williams', 'bobw@example.com', 'bobwilliams', 'securepass123');
-- Orders
INSERT INTO Orders (CustomerID, OrderDate, ShippingDate, TotalPrice)
VALUES
    (1, '2024-12-01', '2024-12-05', 29.95),
    (2, '2024-12-02', '2024-12-06', 19.99),
    (3, '2024-12-03', '2024-12-07', 49.95),
    (4, '2024-12-04', '2024-12-08', 25.49);
-- Combos
INSERT INTO Combos (ProductID, ComboName, ComboDescription)
VALUES
    (1, 'Tropical Combo', 'A mix of tropical-themed items with a fruity twist.'),
    (2, 'Nutty Combo', 'A combination of nut-based products for nut lovers.'),
    (3, 'Cocoa Delight', 'Chocolate-themed combo with a rich flavor.'),
    (4, 'Healthy Choice', 'Low-sugar and vegan-friendly selection.');
-- Combo toppings
INSERT INTO Combo_toppings (ComboID, ToppingID)
VALUES
    (1, 3), -- Tropical Combo + Coconut Flakes
    (1, 8), -- Tropical Combo + Sparkle
    (2, 1), -- Nutty Combo + Almond Crumbs
    (2, 5), -- Nutty Combo + Peanut Crumbs
    (3, 2), -- Cocoa Delight + Cashew Crumbs
    (3, 10), -- Cocoa Delight + Secret Sauce
    (4, 7), -- Healthy Choice + Pistachios Crumbs
    (4, 13); -- Healthy Choice + Honey
-- Order Details
INSERT INTO Order_Combos (OrderID, ComboID, Quantity)
VALUES
    (1, 1, 2), -- John Doe ordered 2 of Tropical Combo
    (2, 2, 1), -- Jane Smith ordered 1 Nutty Combo
    (3, 3, 3), -- Alice Johnson ordered 3 Cocoa Delight
    (4, 4, 1); -- Bob Williams ordered 1 Healthy Choice
INSERT INTO Order_Products (OrderID, ProductID, Quantity)
VALUES
    (1, 3, 1), -- John Doe ordered 1 Iced Coco
    (2, 5, 2), -- Jane Smith ordered 2 Tropical Delight
    (3, 11, 1), -- Alice Johnson ordered 1 Sticky Nutty
    (4, 13, 2); -- Bob Williams ordered 2 Yellow Snow

