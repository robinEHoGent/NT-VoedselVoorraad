USE nimbleit_db;

-- ----------------------------------------------------
-- 1. STATIC DATA (Storage, Categories, Units)
-- ----------------------------------------------------

/* STORAGE TYPES */
INSERT INTO storage_types (name) VALUES 
("Fridge"),
("Freezer"),
("Cabinet");

/* CATEGORIES */
INSERT INTO categories (name, notification_time) VALUES
("Vegetables", 5),
("Meat", 2),
("Dairy", 3),
("Fruit", 4),
("Grains", 7),
("Beverages", 10),
("Fish", 3),
("Veggie", 4),
("Sauces", 10),
("Spices", 30),
("Baking", 20);

/* UNITS OF MEASUREMENTS */
INSERT INTO units_of_measurement (name) VALUES
("kg"),
("L"),
("Pieces"),
("g"),
("ml"),
("Cloves");

-- ----------------------------------------------------
-- 2. CORE INVENTORY DATA (Products & Inventory)
-- ----------------------------------------------------

/* PRODUCTS */
INSERT INTO products (name, category_id, uom_id) VALUES
( "Paprika", 1, 3), ( "Eggs", 3, 3), ( "Milk", 3, 2), ( "Carero", 2, 1),
( "Carrots", 1, 3), ( "Tomatoes", 1, 3), ( "Chicken Breast", 2, 1), ( "Ground Beef", 2, 1),
( "Cheese", 3, 4), ( "Yogurt", 3, 5), ( "Apples", 4, 3), ( "Bananas", 4, 3),
( "Oranges", 4, 3), ( "Rice", 5, 1), ( "Pasta", 5, 1), ( "Bread", 5, 3),
( "Orange Juice", 6, 2), ( "Coffee", 6, 4), ( "Tea", 6, 4), ( "Tomato Sauce", 9, 5),
( "Onion", 1, 3), ( "Garlic", 10, 6), ( "Salt", 10, 4), ( "Soy Sauce", 9, 5),
( "Peas", 1, 4), ( "Sugar", 11, 4), ( "Cinnamon", 10, 4), ( "Butter", 3, 4),
( "Berries", 4, 4), ( "Cream", 3, 4), ( "Tofu", 8, 4), ( "Mushrooms", 1, 4),
( "Bell Pepper", 1, 3); -- Product IDs 1 - 33

/* INVENTORY */
INSERT INTO inventories (product_id, amount, purchase_date, expiry_date, storage_type_id) VALUES
(1, 2, current_date() - INTERVAL 4 DAY, current_date() + INTERVAL 1 DAY, 1),
(2, 12, current_date() - INTERVAL 4 DAY, current_date() + INTERVAL 8 DAY, 1),
(5, 1, current_date() - INTERVAL 4 DAY, current_date() + INTERVAL 6 DAY, 1),
(10, 1000, current_date() - INTERVAL 4 DAY, current_date() + INTERVAL 10 DAY, 1),
(14, 0.5, current_date() - INTERVAL 4 DAY, '2027-12-31', 3),
(19, 300, current_date() - INTERVAL 4 DAY, '2026-12-31', 3),
(25, 200, current_date() - INTERVAL 4 DAY, current_date() + INTERVAL 10 DAY, 1),
(33, 2, current_date() - INTERVAL 4 DAY, current_date() + INTERVAL 10 DAY, 1),
(1, 5, current_date() - INTERVAL 1 DAY, current_date() + INTERVAL 9 DAY, 3),
(2, 6, current_date() - INTERVAL 1 DAY, '2026-02-01', 1),
(3, 1, current_date() - INTERVAL 1 DAY, current_date() + INTERVAL 2 DAY, 1),
(4, 0.5, current_date() - INTERVAL 1 DAY, '2028-06-23', 2),
(7, 0.2, current_date() - INTERVAL 1 DAY, current_date() + INTERVAL 1 DAY, 1),
(8, 0.7, current_date() - INTERVAL 1 DAY, '2026-01-20', 2),
(9, 100, current_date() - INTERVAL 1 DAY, '2026-02-15', 1),
(11, 6, current_date() - INTERVAL 1 DAY, current_date() + INTERVAL 13 DAY, 3),
(12, 5, current_date() - INTERVAL 1 DAY, current_date() + INTERVAL 4 DAY, 3),
(13, 10, current_date() - INTERVAL 1 DAY, '2026-01-10', 1),
(15, 0.1, current_date() - INTERVAL 1 DAY, '2027-06-30', 3),
(16, 2, current_date() - INTERVAL 1 DAY, current_date() + INTERVAL 3 DAY, 3),
(17, 2, current_date() - INTERVAL 1 DAY, current_date() + INTERVAL 8 DAY, 1),
(18, 250, current_date() - INTERVAL 1 DAY, '2027-03-15', 3),
(3, 2, current_date(), '2026-03-01', 3),
(7, 2, current_date(), '2026-02-05', 2),
(8, 1.2, current_date(), '2026-01-20', 2),
(11, 4, current_date(), current_date() + INTERVAL 6 DAY, 3),
(14, 2, current_date(), '2027-12-31', 3),
(27, 25, current_date(), '2027-12-25', 3),
(28, 50, current_date(), '2026-03-01', 1);

-- ----------------------------------------------------
-- 3. RECIPES: MASTER LIST
-- ----------------------------------------------------

/* TAGS */
INSERT INTO tags (name) VALUES
("Breakfast"), ("Lunch"), ("Dinner"), ("Dessert"), -- 1-4: Category
("Easy"), ("Medium"), ("Hard"),                     -- 5-7: Difficulty
("Quick"), ("Long"),                                -- 8-9: Duration
("Italian"), ("Pasta"), ("Asian"), ("Greek"),      -- 10-13: Cuisine/Style
("Salad"), ("Healthy"), ("Sweet");                  -- 14-16: Other/Diet

/* RECIPES */
INSERT INTO recipes (name, description, prepare_time, complexity, serving_size, created_on, last_cooked, favorite) VALUES 
("Spaghetti Bolognese", "Classic Italian pasta dish with rich meat sauce. Traditional recipe combining ground beef, tomatoes, and herbs.", 45, 2, 4, current_date() - INTERVAL 7 DAY, current_date() - INTERVAL 2 DAY, 1), -- 1
("Greek Salad", "Fresh Mediterranean salad with feta cheese and olives.", 15, 1, 4, current_date() - INTERVAL 5 DAY, current_date() - INTERVAL 1 DAY, 1), -- 2
("Chicken Stir Fry", "Quick and easy Asian-inspired chicken with colorful vegetables.", 25, 1, 2, current_date() - INTERVAL 5 DAY, NULL, 0), -- 3
("Banana Pancakes", "Fluffy breakfast pancakes with fresh bananas and cinnamon.", 20, 1, 2, current_date() - INTERVAL 5 DAY, NULL, 0), -- 4
("Cheesy Omelette", "Simple, classic omelette with melted cheese and butter.", 10, 1, 1, current_date() - INTERVAL 2 DAY, current_date(), 1), -- 5
("Vegetable Soup", "Light, comforting vegetable soup with a clear broth.", 30, 1, 3, current_date(), NULL, 0), -- 6
("Pasta Salad", "Cold pasta salad with fresh chopped veggies and a light vinaigrette.", 15, 1, 2, current_date(), NULL, 0), -- 7
("Tomato Pasta", "Simple pasta with fresh tomato sauce and basil.", 20, 1, 2, current_date() - INTERVAL 3 DAY, NULL, 0), -- 8
("Fried Rice", "Classic Asian fried rice with vegetables and egg.", 25, 1, 4, current_date() - INTERVAL 4 DAY, NULL, 1), -- 9
("Chicken Salad", "Healthy chicken salad with mixed greens and light dressing.", 15, 1, 2, current_date() - INTERVAL 2 DAY, NULL, 0), -- 10
("Veggie Burger", "Delicious vegetarian patty served on a bun with fresh toppings.", 30, 2, 4, current_date() - INTERVAL 6 DAY, current_date() - INTERVAL 1 DAY, 1), -- 11
("Mushroom Risotto", "Creamy Italian risotto with mushrooms and Parmesan cheese.", 40, 2, 4, current_date() - INTERVAL 5 DAY, NULL, 0), -- 12
("Beef Tacos", "Spicy ground beef tacos with crunchy shells and fresh salsa.", 25, 1, 4, current_date() - INTERVAL 3 DAY, NULL, 1), -- 13
("Chicken Curry", "Flavorful Indian-style chicken curry in a rich, creamy sauce.", 45, 2, 4, current_date() - INTERVAL 7 DAY, NULL, 0), -- 14
("Caesar Salad", "Classic Caesar salad with romaine, croutons, and homemade dressing.", 15, 1, 2, current_date() - INTERVAL 1 DAY, NULL, 0), -- 15
("Tomato Soup", "Creamy tomato soup perfect for lunch or a light dinner.", 30, 1, 4, current_date() - INTERVAL 4 DAY, NULL, 0), -- 16
("Grilled Chicken", "Simple grilled chicken breast seasoned with herbs and spices.", 25, 1, 2, current_date() - INTERVAL 2 DAY, NULL, 1), -- 17
("Pasta Carbonara", "Traditional Italian pasta with eggs, cheese, cured pork, and black pepper.", 20, 2, 2, current_date() - INTERVAL 5 DAY, NULL, 0), -- 18
("Vegetable Curry", "Spicy vegetable curry with coconut milk and a variety of vegetables.", 35, 2, 4, current_date() - INTERVAL 6 DAY, NULL, 0), -- 19
("Fish and Chips", "Classic British deep-fried battered fish served with thick-cut fried potatoes.", 40, 2, 4, current_date() - INTERVAL 8 DAY, current_date() - INTERVAL 3 DAY, 1), -- 20
("Egg Fried Rice", "Quick egg fried rice with vegetables, ideal for leftovers.", 15, 1, 2, current_date() - INTERVAL 1 DAY, NULL, 0), -- 21
("Chicken Parmesan", "Breaded chicken breast topped with tomato sauce and mozzarella, baked until bubbly.", 45, 2, 4, current_date() - INTERVAL 9 DAY, NULL, 1), -- 22
("Veggie Pasta", "Light pasta dish tossed with seasonal fresh vegetables.", 20, 1, 2, current_date() - INTERVAL 3 DAY, NULL, 0), -- 23
("Beef Stir Fry", "Quick beef stir fry with Asian flavors and crisp vegetables.", 25, 1, 4, current_date() - INTERVAL 4 DAY, NULL, 0), -- 24
("Chicken Noodle Soup", "Comforting chicken noodle soup, a classic remedy.", 40, 2, 6, current_date() - INTERVAL 7 DAY, NULL, 1), -- 25
("Caprese Salad", "Italian salad with sliced fresh mozzarella, tomatoes, and basil.", 10, 1, 2, current_date() - INTERVAL 2 DAY, NULL, 0), -- 26
("Beef Burger", "Juicy beef burger patty served on a soft bun with lettuce and sauce.", 20, 1, 4, current_date() - INTERVAL 5 DAY, current_date() - INTERVAL 1 DAY, 1), -- 27
("Chicken Tacos", "Spicy chicken tacos with fresh salsa, cilantro, and lime.", 25, 1, 4, current_date() - INTERVAL 3 DAY, NULL, 0), -- 28
("Pasta Primavera", "Spring pasta with fresh seasonal vegetables and a light cream sauce.", 25, 2, 4, current_date() - INTERVAL 6 DAY, NULL, 0), -- 29
("Tomato Basil Pasta", "Simple pasta with tomatoes and fresh basil, a quick summer dish.", 20, 1, 2, current_date() - INTERVAL 2 DAY, NULL, 0), -- 30
("Chicken Wings", "Crispy baked chicken wings tossed in a flavorful sauce.", 45, 2, 4, current_date() - INTERVAL 8 DAY, NULL, 1), -- 31
("Veggie Stir Fry", "Healthy vegetable stir fry with tofu and soy sauce.", 20, 1, 2, current_date() - INTERVAL 3 DAY, NULL, 0), -- 32
("Beef Curry", "Rich and spicy beef curry with deep, aromatic flavors.", 50, 3, 4, current_date() - INTERVAL 10 DAY, NULL, 0), -- 33
("Chicken Soup", "Classic chicken soup with vegetables and herbs.", 35, 2, 6, current_date() - INTERVAL 7 DAY, NULL, 0), -- 34
("Pasta Alfredo", "Creamy Alfredo pasta made with butter, heavy cream, and Parmesan cheese.", 25, 2, 2, current_date() - INTERVAL 4 DAY, NULL, 1), -- 35
("Greek Chicken", "Greek-style marinated chicken (souvlaki) served with lemon.", 30, 2, 4, current_date() - INTERVAL 6 DAY, NULL, 0), -- 36
("Veggie Wrap", "Healthy vegetable wrap packed with raw and cooked vegetables.", 10, 1, 1, current_date() - INTERVAL 1 DAY, NULL, 0), -- 37
("Beef Pasta", "Hearty beef and pasta dish, often a casserole or baked dish.", 30, 2, 4, current_date() - INTERVAL 5 DAY, NULL, 0), -- 38
("Chicken Caesar Wrap", "Caesar salad ingredients wrapped in a soft tortilla.", 15, 1, 2, current_date() - INTERVAL 2 DAY, NULL, 1), -- 39
("Tomato Risotto", "Creamy tomato risotto using arborio rice and fresh tomato sauce.", 35, 2, 4, current_date() - INTERVAL 7 DAY, NULL, 0), -- 40
("Beef Noodles", "Asian-style beef noodles tossed in a savory sauce with vegetables.", 25, 2, 2, current_date() - INTERVAL 4 DAY, NULL, 0), -- 41
("Chicken Sandwich", "Classic chicken sandwich with lettuce and mayonnaise.", 15, 1, 2, current_date() - INTERVAL 2 DAY, NULL, 1), -- 42
("Vegetable Lasagna", "Layered vegetable lasagna with creamy ricotta and cheese.", 60, 3, 6, current_date() - INTERVAL 12 DAY, NULL, 1), -- 43
("Chicken Quesadilla", "Cheesy chicken quesadilla grilled until crispy.", 20, 1, 2, current_date() - INTERVAL 3 DAY, NULL, 0), -- 44
("Beef Stroganoff", "Creamy beef stroganoff served over egg noodles.", 40, 2, 4, current_date() - INTERVAL 8 DAY, NULL, 0), -- 45
("Greek Pasta", "Mediterranean pasta dish with tomatoes, feta, and herbs.", 25, 2, 4, current_date() - INTERVAL 5 DAY, NULL, 0), -- 46
("Chicken Fried Rice", "Chicken fried rice with vegetables and soy sauce.", 20, 1, 4, current_date() - INTERVAL 3 DAY, current_date(), 1), -- 47
("Veggie Pizza", "Homemade vegetable pizza with a thin crust.", 40, 2, 4, current_date() - INTERVAL 9 DAY, NULL, 1), -- 48
("Beef Bowl", "Asian beef bowl with rice and a savory glaze.", 25, 2, 2, current_date() - INTERVAL 4 DAY, NULL, 0), -- 49
("Chicken Wrap", "Grilled chicken wrap with mixed greens.", 15, 1, 2, current_date() - INTERVAL 2 DAY, NULL, 0), -- 50
("Tomato Chicken", "Chicken baked in a simple tomato sauce.", 35, 2, 4, current_date() - INTERVAL 6 DAY, NULL, 0), -- 51
("Pasta Bake", "Baked pasta with ground meat and a cheesy top layer.", 45, 2, 6, current_date() - INTERVAL 8 DAY, NULL, 1), -- 52
("Beef Salad", "Fresh beef salad with tender sliced steak.", 15, 1, 2, current_date() - INTERVAL 2 DAY, NULL, 0), -- 53
("Chicken Pasta", "Simple chicken pasta tossed in a light sauce.", 25, 2, 4, current_date() - INTERVAL 5 DAY, NULL, 0), -- 54
("Veggie Bowl", "Healthy vegetable and grain bowl with a light dressing.", 20, 1, 2, current_date() - INTERVAL 3 DAY, NULL, 1), -- 55
("Beef Sandwich", "Hearty beef sandwich with melted cheese.", 15, 1, 2, current_date() - INTERVAL 2 DAY, NULL, 0), -- 56
("Chicken Bowl", "Chicken and rice bowl with vegetables.", 25, 2, 2, current_date() - INTERVAL 4 DAY, NULL, 0), -- 57
("Greek Bowl", "Mediterranean bowl with chicken, rice, and tzatziki.", 20, 2, 2, current_date() - INTERVAL 3 DAY, NULL, 1), -- 58
("Pasta Soup", "Pasta and vegetable soup (Minestrone style).", 30, 1, 4, current_date() - INTERVAL 6 DAY, NULL, 0), -- 59
("Beef Rice", "Beef and rice dish (e.g., Pilaf or Biryani).", 30, 2, 4, current_date() - INTERVAL 5 DAY, NULL, 0), -- 60
("Chicken Salad Wrap", "Chicken salad mixture wrapped in a tortilla.", 15, 1, 2, current_date() - INTERVAL 2 DAY, NULL, 0), -- 61
("Veggie Soup", "Mixed vegetable soup with a thick broth.", 30, 1, 4, current_date() - INTERVAL 5 DAY, NULL, 0), -- 62
("Beef Wrap", "Beef and vegetable wrap.", 15, 1, 2, current_date() - INTERVAL 2 DAY, NULL, 1), -- 63
("Chicken Nuggets", "Homemade chicken nuggets with a crispy coating.", 30, 2, 4, current_date() - INTERVAL 7 DAY, NULL, 1), -- 64
("Greek Wrap", "Greek-style chicken or veggie wrap with fresh herbs.", 15, 1, 2, current_date() - INTERVAL 2 DAY, NULL, 0), -- 65
("Pasta Salad Bowl", "Cold pasta salad bowl.", 20, 1, 2, current_date() - INTERVAL 3 DAY, NULL, 0), -- 66
("Beef Taco Bowl", "Beef taco bowl with toppings like sour cream and salsa.", 25, 2, 2, current_date() - INTERVAL 4 DAY, NULL, 0), -- 67
("Chicken Burrito", "Chicken burrito with beans, rice, and cheese.", 25, 2, 2, current_date() - INTERVAL 5 DAY, NULL, 1), -- 68
("Veggie Burrito", "Vegetarian burrito packed with black beans and corn.", 20, 1, 2, current_date() - INTERVAL 3 DAY, NULL, 0), -- 69
("Beef Burrito", "Beef burrito with cheese and rice.", 25, 2, 2, current_date() - INTERVAL 4 DAY, NULL, 0), -- 70
("Chicken Fajitas", "Sizzling chicken fajitas served with warm tortillas.", 30, 2, 4, current_date() - INTERVAL 6 DAY, NULL, 1), -- 71
("Greek Pizza", "Greek-style pizza with feta, spinach, and olives.", 35, 2, 4, current_date() - INTERVAL 8 DAY, NULL, 0), -- 72
("Pasta Frittata", "Italian pasta frittata (omelette with pasta).", 25, 2, 4, current_date() - INTERVAL 5 DAY, NULL, 0), -- 73
("Beef Kebabs", "Grilled beef kebabs with bell peppers and onions.", 30, 2, 4, current_date() - INTERVAL 7 DAY, NULL, 0), -- 74
("Chicken Skewers", "Marinated chicken skewers (Shish Kebab style).", 30, 2, 4, current_date() - INTERVAL 6 DAY, NULL, 1), -- 75
("Veggie Skewers", "Grilled vegetable skewers with balsamic glaze.", 25, 1, 4, current_date() - INTERVAL 5 DAY, NULL, 0), -- 76
("Greek Chicken Bowl", "Greek chicken with rice, feta, and cucumber.", 25, 2, 2, current_date() - INTERVAL 4 DAY, NULL, 0), -- 77
("Pasta Carbonara Bowl", "Carbonara-style pasta served in a bowl.", 20, 2, 2, current_date() - INTERVAL 3 DAY, NULL, 1), -- 78
("Beef Pho", "Vietnamese beef noodle soup with aromatic broth.", 60, 3, 4, current_date() - INTERVAL 15 DAY, NULL, 0), -- 79
("Chicken Pho", "Vietnamese chicken soup with thin rice noodles.", 50, 3, 4, current_date() - INTERVAL 12 DAY, NULL, 0), -- 80
("Veggie Pho", "Vegetarian pho with mushroom broth.", 45, 2, 4, current_date() - INTERVAL 10 DAY, NULL, 0), -- 81
("Greek Gyros", "Greek gyros with meat, tomato, onion, and tzatziki wrapped in pita.", 30, 2, 4, current_date() - INTERVAL 7 DAY, NULL, 1), -- 82
("Chicken Gyros", "Chicken gyros with vegetables.", 30, 2, 4, current_date() - INTERVAL 6 DAY, NULL, 0), -- 83
("Pasta Pesto", "Pasta with fresh basil pesto.", 20, 1, 2, current_date() - INTERVAL 3 DAY, NULL, 1), -- 84
("Beef Lasagna", "Classic beef lasagna with layered pasta, meat sauce, and cheese.", 75, 3, 8, current_date() - INTERVAL 14 DAY, NULL, 1), -- 85
("Chicken Lasagna", "Creamy chicken lasagna with Alfredo sauce.", 70, 3, 8, current_date() - INTERVAL 13 DAY, NULL, 0), -- 86
("Veggie Quesadilla", "Vegetable quesadilla with bell peppers and onion.", 15, 1, 2, current_date() - INTERVAL 2 DAY, NULL, 0), -- 87
("Beef Quesadilla", "Beef and cheese quesadilla.", 20, 1, 2, current_date() - INTERVAL 3 DAY, NULL, 0), -- 88
("Greek Burger", "Greek-style lamb burger with feta and oregano.", 25, 2, 4, current_date() - INTERVAL 5 DAY, NULL, 0), -- 89
("Chicken Schnitzel", "Crispy fried or baked chicken schnitzel.", 30, 2, 4, current_date() - INTERVAL 6 DAY, NULL, 1), -- 90
("Pasta Marinara", "Classic marinara pasta with simple tomato sauce.", 20, 1, 2, current_date() - INTERVAL 2 DAY, NULL, 0), -- 91
("Beef Ramen", "Asian beef ramen noodles with rich broth and soft egg.", 30, 2, 2, current_date() - INTERVAL 5 DAY, NULL, 0), -- 92
("Chicken Ramen", "Chicken ramen with rich broth, vegetables, and soft egg.", 30, 2, 2, current_date() - INTERVAL 4 DAY, NULL, 1), -- 93
("Veggie Ramen", "Vegetable ramen with mushroom broth and fresh greens.", 25, 2, 2, current_date() - INTERVAL 3 DAY, NULL, 0), -- 94
("Greek Meatballs", "Greek-style meatballs (Keftedes) seasoned with herbs.", 35, 2, 4, current_date() - INTERVAL 7 DAY, NULL, 0), -- 95
("Chicken Meatballs", "Chicken meatballs in a light sauce.", 35, 2, 4, current_date() - INTERVAL 6 DAY, NULL, 1), -- 96
("Pasta Arrabiata", "Spicy tomato pasta with chili and garlic.", 20, 1, 2, current_date() - INTERVAL 2 DAY, NULL, 0), -- 97
("Beef Teriyaki", "Japanese beef teriyaki with a sweet and savory glaze.", 25, 2, 2, current_date() - INTERVAL 4 DAY, NULL, 0), -- 98
("Chicken Teriyaki", "Sweet and savory chicken teriyaki.", 25, 2, 2, current_date() - INTERVAL 3 DAY, NULL, 1), -- 99
("Greek Moussaka", "Traditional Greek casserole with layered eggplant, meat sauce, and bechamel.", 90, 3, 8, current_date() - INTERVAL 20 DAY, current_date() - INTERVAL 5 DAY, 1); -- 100

-- ----------------------------------------------------
-- 4. RECIPE METADATA (Tags, Ingredients, Instructions)
-- ----------------------------------------------------

/* RECIPE TAGS (1-100) */
INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
-- 1-7 (Original Data)
(1, 10), (1, 11), (1, 3), (1, 6), (1, 9),
(2, 13), (2, 14), (2, 15), (2, 2), (2, 8),
(3, 12), (3, 3), (3, 5), (3, 8), (3, 15),
(4, 1), (4, 16), (4, 5), (4, 8),
(5, 1), (5, 5), (5, 8), (5, 6),
(6, 5), (6, 15), (6, 2), (6, 3),
(7, 11), (7, 14), (7, 3), (7, 8), (7, 15),
-- 8-100 (Expanded Data)
(8, 10), (8, 11), (8, 3), (8, 5), (8, 8),
(9, 12), (9, 3), (9, 5), (9, 8),
(10, 14), (10, 2), (10, 15), (10, 8),
(11, 3), (11, 6), (11, 15),
(12, 10), (12, 3), (12, 6), (12, 9),
(13, 3), (13, 5), (13, 8),
(14, 3), (14, 6), (14, 9),
(15, 14), (15, 2), (15, 8),
(16, 2), (16, 3), (16, 5),
(17, 3), (17, 5), (17, 8), (17, 15),
(18, 10), (18, 11), (18, 3), (18, 6),
(19, 3), (19, 6),
(20, 3), (20, 6),
(21, 12), (21, 1), (21, 8), (21, 5),
(22, 10), (22, 3), (22, 6),
(23, 11), (23, 2), (23, 15),
(24, 12), (24, 3), (24, 8),
(25, 3), (25, 2), (25, 6), (25, 9),
(26, 10), (26, 14), (26, 2), (26, 8), (26, 15),
(27, 3), (27, 5), (27, 8),
(28, 3), (28, 5), (28, 8),
(29, 11), (29, 3), (29, 6),
(30, 11), (30, 3), (30, 5), (30, 8),
(31, 3), (31, 6),
(32, 12), (32, 3), (32, 15), (32, 8),
(33, 3), (33, 7), (33, 9),
(34, 3), (34, 2), (34, 6),
(35, 11), (35, 3), (35, 6),
(36, 13), (36, 3), (36, 6),
(37, 2), (37, 15), (37, 8),
(38, 11), (38, 3), (38, 6),
(39, 2), (39, 8),
(40, 10), (40, 3), (40, 6),
(41, 12), (41, 3), (41, 6),
(42, 2), (42, 8),
(43, 10), (43, 3), (43, 7), (43, 9),
(44, 2), (44, 8),
(45, 3), (45, 6), (45, 9),
(46, 13), (46, 11), (46, 3), (46, 6),
(47, 12), (47, 3), (47, 8),
(48, 3), (48, 6),
(49, 12), (49, 3), (49, 6),
(50, 2), (50, 8),
(51, 3), (51, 6),
(52, 11), (52, 3), (52, 6),
(53, 2), (53, 14), (53, 8),
(54, 11), (54, 3), (54, 6),
(55, 2), (55, 15), (55, 8),
(56, 2), (56, 8),
(57, 3), (57, 6),
(58, 13), (58, 2), (58, 6),
(59, 2), (59, 3), (59, 5),
(60, 3), (60, 6),
(61, 2), (61, 8),
(62, 2), (62, 3), (62, 5),
(63, 2), (63, 8),
(64, 3), (64, 6),
(65, 13), (65, 2), (65, 8),
(66, 11), (66, 2), (66, 8),
(67, 3), (67, 6),
(68, 3), (68, 6),
(69, 3), (69, 5),
(70, 3), (70, 6),
(71, 3), (71, 6),
(72, 13), (72, 3), (72, 6),
(73, 10), (73, 1), (73, 6),
(74, 3), (74, 6),
(75, 3), (75, 6),
(76, 3), (76, 5),
(77, 13), (77, 3), (77, 6),
(78, 10), (78, 11), (78, 3), (78, 6),
(79, 12), (79, 3), (79, 7), (79, 9),
(80, 12), (80, 3), (80, 7), (80, 9),
(81, 12), (81, 3), (81, 6), (81, 9),
(82, 13), (82, 3), (82, 6),
(83, 13), (83, 3), (83, 6),
(84, 11), (84, 3), (84, 5), (84, 8),
(85, 10), (85, 3), (85, 7), (85, 9),
(86, 10), (86, 3), (86, 7), (86, 9),
(87, 2), (87, 8),
(88, 3), (88, 8),
(89, 13), (89, 3), (89, 6),
(90, 3), (90, 6),
(91, 11), (91, 3), (91, 5), (91, 8),
(92, 12), (92, 3), (92, 6),
(93, 12), (93, 3), (93, 6),
(94, 12), (94, 3), (94, 6),
(95, 13), (95, 3), (95, 6),
(96, 3), (96, 6),
(97, 11), (97, 3), (97, 5), (97, 8),
(98, 12), (98, 3), (98, 6),
(99, 12), (99, 3), (99, 6),
(100, 13), (100, 3), (100, 7), (100, 9);


/* RECIPE INFO (Ingredients) */
INSERT INTO recipe_info (recipe_id, title, product_id, amount, part, order_index) VALUES
-- 1-7 (Original Data)
(1,'Bolognese', 8, 0.5, 1, 1), (1,'Bolognese', 6, 5, 1, 2), (1,'Bolognese', 1, 2, 1, 3), (1,'Spaghetti', 15, 0.4, 2, 4),
(2,'Greek Salad', 6, 4, 1, 1), (2,'Greek Salad', 1, 2, 1, 2), (2,'Greek Salad', 9, 200, 1, 3),
(3,'Chicken Stir Fry', 7, 0.4, 1, 1), (3,'Chicken Stir Fry', 5, 2, 1, 2), (3,'Chicken Stir Fry', 1, 2, 1, 3), (3,'Chicken Stir Fry', 14, 0.2, 1, 4),
(4,'Banana Pancakes', 2, 2, 1, 1), (4,'Banana Pancakes', 3, 0.2, 1, 2), (4,'Banana Pancakes', 12, 2, 1, 3),
(5,'Cheesy Omelette', 2, 2, 1, 1), (5,'Cheesy Omelette', 9, 50, 1, 2), (5,'Cheesy Omelette', 28, 10, 1, 3),
(6,'Vegetable Soup', 5, 2, 1, 1), (6,'Vegetable Soup', 6, 2, 1, 2), (6,'Vegetable Soup', 25, 100, 1, 3),
(7,'Pasta Salad', 15, 0.3, 1, 1), (7,'Pasta Salad', 6, 2, 1, 2), (7,'Pasta Salad', 1, 1, 1, 3), (7,'Pasta Salad', 33, 1, 1, 4),
-- 8-100 (Expanded Data)
(8,'Sauce', 6, 4, 1, 1), (8,'Sauce', 21, 1, 1, 2), (8,'Pasta', 15, 0.3, 2, 3),
(9,'Base', 14, 0.5, 1, 1), (9,'Protein', 2, 2, 1, 2), (9,'Veggies', 5, 1, 1, 3), (9,'Sauce', 24, 50, 1, 4),
(10,'Base', 7, 0.3, 1, 1), (10,'Veggies', 6, 2, 1, 2), (10,'Greens', 1, 2, 1, 3),
(11,'Patty', 31, 200, 1, 1), (11,'Veggies', 21, 1, 1, 2), (11,'Buns', 16, 4, 2, 3),
(12,'Base', 14, 0.3, 1, 1), (12,'Veggies', 32, 200, 1, 2), (12,'Dairy', 9, 50, 1, 3),
(13,'Filling', 8, 0.5, 1, 1), (13,'Seasoning', 1, 2, 1, 2), (13,'Shells', 3, 12, 2, 3),
(14,'Protein', 7, 0.5, 1, 1), (14,'Sauce', 20, 200, 1, 2), (14,'Rice', 14, 0.4, 2, 3),
(15,'Base', 1, 4, 1, 1), (15,'Protein', 7, 0.1, 1, 2), (15,'Dairy', 9, 50, 1, 3),
(16,'Base', 6, 8, 1, 1), (16,'Dairy', 3, 0.2, 1, 2), (16,'Spices', 23, 10, 1, 3),
(17,'Protein', 7, 0.4, 1, 1), (17,'Seasoning', 23, 10, 1, 2), (17,'Side', 5, 2, 2, 3),
(18,'Base', 15, 0.2, 1, 1), (18,'Sauce', 2, 2, 1, 2), (18,'Sauce', 9, 50, 1, 3), (18,'Meat', 4, 0.1, 1, 4),
(19,'Veggies', 5, 2, 1, 1), (19,'Veggies', 33, 1, 1, 2), (19,'Sauce', 3, 0.2, 1, 3),
(20,'Protein', 7, 0.5, 1, 1), (20,'Starch', 1, 4, 2, 2), (20,'Sauce', 20, 100, 2, 3),
(21,'Base', 14, 0.3, 1, 1), (21,'Protein', 2, 2, 1, 2), (21,'Veggies', 25, 100, 1, 3),
(22,'Protein', 7, 0.5, 1, 1), (22,'Sauce', 20, 200, 1, 2), (22,'Dairy', 9, 100, 1, 3), (22,'Side', 15, 0.2, 2, 4),
(23,'Base', 15, 0.2, 1, 1), (23,'Veggies', 5, 2, 1, 2), (23,'Veggies', 33, 1, 1, 3),
(24,'Protein', 8, 0.4, 1, 1), (24,'Veggies', 5, 2, 1, 2), (24,'Sauce', 24, 50, 1, 3),
(25,'Protein', 7, 0.5, 1, 1), (25,'Base', 15, 0.1, 1, 2), (25,'Veggies', 5, 2, 1, 3),
(26,'Base', 6, 4, 1, 1), (26,'Dairy', 9, 100, 1, 2), (26,'Herb', 1, 2, 1, 3),
(27,'Protein', 8, 0.4, 1, 1), (27,'Buns', 16, 4, 1, 2), (27,'Dairy', 9, 50, 1, 3),
(28,'Protein', 7, 0.4, 1, 1), (28,'Tortillas', 3, 8, 1, 2), (28,'Veggies', 1, 2, 1, 3),
(29,'Base', 15, 0.4, 1, 1), (29,'Veggies', 5, 2, 1, 2), (29,'Veggies', 33, 1, 1, 3), (29,'Sauce', 3, 0.1, 1, 4),
(30,'Base', 15, 0.2, 1, 1), (30,'Sauce', 6, 4, 1, 2), (30,'Herb', 1, 2, 1, 3),
(31,'Protein', 7, 0.5, 1, 1), (31,'Sauce', 9, 50, 1, 2), (31,'Seasoning', 23, 10, 1, 3),
(32,'Protein', 31, 200, 1, 1), (32,'Veggies', 5, 2, 1, 2), (32,'Veggies', 33, 1, 1, 3), (32,'Sauce', 24, 50, 1, 4),
(33,'Protein', 8, 0.5, 1, 1), (33,'Sauce', 20, 200, 1, 2), (33,'Spices', 27, 5, 1, 3),
(34,'Protein', 7, 0.5, 1, 1), (34,'Veggies', 5, 2, 1, 2), (34,'Veggies', 21, 1, 1, 3),
(35,'Base', 15, 0.2, 1, 1), (35,'Sauce', 30, 100, 1, 2), (35,'Dairy', 9, 50, 1, 3),
(36,'Protein', 7, 0.5, 1, 1), (36,'Veggies', 6, 4, 1, 2), (36,'Herb', 22, 2, 1, 3),
(37,'Base', 1, 2, 1, 1), (37,'Veggies', 5, 2, 1, 2), (37,'Veggies', 6, 2, 1, 3),
(38,'Base', 15, 0.4, 1, 1), (38,'Protein', 8, 0.4, 1, 2), (38,'Sauce', 20, 100, 1, 3),
(39,'Protein', 7, 0.3, 1, 1), (39,'Base', 1, 2, 1, 2), (39,'Dairy', 9, 50, 1, 3),
(40,'Base', 14, 0.3, 1, 1), (40,'Sauce', 20, 200, 1, 2), (40,'Dairy', 9, 50, 1, 3),
(41,'Base', 15, 0.2, 1, 1), (41,'Protein', 8, 0.3, 1, 2), (41,'Sauce', 24, 50, 1, 3),
(42,'Protein', 7, 0.2, 1, 1), (42,'Base', 16, 2, 1, 2), (42,'Sauce', 9, 20, 1, 3),
(43,'Veggies', 6, 6, 1, 1), (43,'Veggies', 32, 200, 1, 2), (43,'Veggies', 21, 1, 1, 3), (43,'Pasta', 15, 0.5, 2, 4),
(44,'Protein', 7, 0.3, 1, 1), (44,'Dairy', 9, 100, 1, 2), (44,'Base', 1, 4, 1, 3),
(45,'Protein', 8, 0.5, 1, 1), (45,'Dairy', 30, 100, 1, 2), (45,'Base', 15, 0.4, 2, 3),
(46,'Base', 15, 0.4, 1, 1), (46,'Dairy', 9, 100, 1, 2), (46,'Veggies', 6, 4, 1, 3),
(47,'Protein', 7, 0.3, 1, 1), (47,'Base', 14, 0.5, 1, 2), (47,'Veggies', 5, 2, 1, 3), (47,'Sauce', 24, 50, 1, 4),
(48,'Base', 16, 1, 1, 1), (48,'Sauce', 20, 200, 1, 2), (48,'Veggies', 33, 2, 1, 3), (48,'Dairy', 9, 150, 1, 4),
(49,'Protein', 8, 0.3, 1, 1), (49,'Base', 14, 0.2, 1, 2), (49,'Sauce', 24, 50, 1, 3),
(50,'Protein', 7, 0.2, 1, 1), (50,'Base', 1, 2, 1, 2), (50,'Veggies', 6, 2, 1, 3),
(51,'Protein', 7, 0.5, 1, 1), (51,'Sauce', 6, 4, 1, 2), (51,'Herb', 22, 2, 1, 3),
(52,'Protein', 8, 0.5, 1, 1), (52,'Base', 15, 0.4, 1, 2), (52,'Sauce', 20, 200, 1, 3), (52,'Dairy', 9, 150, 1, 4),
(53,'Protein', 8, 0.2, 1, 1), (53,'Veggies', 1, 4, 1, 2), (53,'Dressing', 9, 20, 1, 3),
(54,'Protein', 7, 0.4, 1, 1), (54,'Base', 15, 0.3, 1, 2), (54,'Sauce', 20, 100, 1, 3),
(55,'Base', 14, 0.2, 1, 1), (55,'Veggies', 5, 2, 1, 2), (55,'Veggies', 31, 100, 1, 3),
(56,'Protein', 8, 0.2, 1, 1), (56,'Base', 16, 2, 1, 2), (56,'Dairy', 9, 50, 1, 3),
(57,'Protein', 7, 0.3, 1, 1), (57,'Base', 14, 0.2, 1, 2), (57,'Veggies', 5, 2, 1, 3),
(58,'Protein', 7, 0.3, 1, 1), (58,'Base', 14, 0.2, 1, 2), (58,'Dairy', 9, 50, 1, 3),
(59,'Base', 15, 0.1, 1, 1), (59,'Veggies', 5, 2, 1, 2), (59,'Veggies', 21, 1, 1, 3),
(60,'Protein', 8, 0.5, 1, 1), (60,'Base', 14, 0.4, 1, 2), (60,'Sauce', 24, 50, 1, 3),
(61,'Protein', 7, 0.2, 1, 1), (61,'Base', 1, 2, 1, 2), (61,'Sauce', 9, 20, 1, 3),
(62,'Veggies', 5, 3, 1, 1), (62,'Veggies', 6, 3, 1, 2), (62,'Veggies', 25, 200, 1, 3),
(63,'Protein', 8, 0.3, 1, 1), (63,'Base', 1, 2, 1, 2), (63,'Sauce', 9, 50, 1, 3),
(64,'Protein', 7, 0.5, 1, 1), (64,'Coating', 16, 0.1, 1, 2), (64,'Sauce', 20, 50, 1, 3),
(65,'Protein', 7, 0.3, 1, 1), (65,'Base', 1, 2, 1, 2), (65,'Dairy', 9, 50, 1, 3),
(66,'Base', 15, 0.2, 1, 1), (66,'Veggies', 6, 2, 1, 2), (66,'Veggies', 33, 1, 1, 3),
(67,'Protein', 8, 0.3, 1, 1), (67,'Base', 14, 0.2, 1, 2), (67,'Dairy', 9, 50, 1, 3),
(68,'Protein', 7, 0.3, 1, 1), (68,'Base', 14, 0.2, 1, 2), (68,'Veggies', 25, 100, 1, 3), (68,'Dairy', 9, 50, 1, 4),
(69,'Protein', 31, 100, 1, 1), (69,'Base', 14, 0.2, 1, 2), (69,'Veggies', 25, 100, 1, 3),
(70,'Protein', 8, 0.3, 1, 1), (70,'Base', 14, 0.2, 1, 2), (70,'Dairy', 9, 50, 1, 3),
(71,'Protein', 7, 0.5, 1, 1), (71,'Veggies', 33, 2, 1, 2), (71,'Base', 1, 4, 1, 3),
(72,'Base', 16, 1, 1, 1), (72,'Dairy', 9, 150, 1, 2), (72,'Veggies', 1, 2, 1, 3), (72,'Sauce', 20, 100, 1, 4),
(73,'Base', 15, 0.2, 1, 1), (73,'Protein', 2, 4, 1, 2), (73,'Dairy', 9, 50, 1, 3),
(74,'Protein', 8, 0.5, 1, 1), (74,'Veggies', 33, 2, 1, 2), (74,'Veggies', 21, 1, 1, 3),
(75,'Protein', 7, 0.5, 1, 1), (75,'Veggies', 1, 4, 1, 2), (75,'Veggies', 21, 1, 1, 3),
(76,'Veggies', 33, 2, 1, 1), (76,'Veggies', 21, 1, 1, 2), (76,'Veggies', 5, 2, 1, 3),
(77,'Protein', 7, 0.2, 1, 1), (77,'Base', 14, 0.2, 1, 2), (77,'Dairy', 9, 50, 1, 3),
(78,'Base', 15, 0.2, 1, 1), (78,'Protein', 2, 2, 1, 2), (78,'Dairy', 9, 50, 1, 3),
(79,'Protein', 8, 0.5, 1, 1), (79,'Base', 15, 0.3, 1, 2), (79,'Spices', 22, 2, 1, 3),
(80,'Protein', 7, 0.5, 1, 1), (80,'Base', 15, 0.3, 1, 2), (80,'Spices', 22, 2, 1, 3),
(81,'Protein', 31, 200, 1, 1), (81,'Base', 15, 0.3, 1, 2), (81,'Veggies', 32, 200, 1, 3),
(82,'Protein', 8, 0.4, 1, 1), (82,'Base', 1, 4, 1, 2), (82,'Sauce', 10, 50, 1, 3),
(83,'Protein', 7, 0.4, 1, 1), (83,'Base', 1, 4, 1, 2), (83,'Sauce', 10, 50, 1, 3),
(84,'Base', 15, 0.2, 1, 1), (84,'Sauce', 1, 2, 1, 2), (84,'Nut', 22, 2, 1, 3),
(85,'Protein', 8, 0.8, 1, 1), (85,'Base', 15, 0.8, 1, 2), (85,'Sauce', 20, 300, 1, 3), (85,'Dairy', 9, 200, 1, 4),
(86,'Protein', 7, 0.8, 1, 1), (86,'Base', 15, 0.8, 1, 2), (86,'Sauce', 30, 200, 1, 3), (86,'Dairy', 9, 200, 1, 4),
(87,'Protein', 31, 100, 1, 1), (87,'Dairy', 9, 50, 1, 2), (87,'Veggies', 33, 1, 1, 3),
(88,'Protein', 8, 0.2, 1, 1), (88,'Dairy', 9, 50, 1, 2), (88,'Base', 1, 4, 1, 3),
(89,'Protein', 8, 0.4, 1, 1), (89,'Dairy', 9, 50, 1, 2), (89,'Herb', 22, 2, 1, 3),
(90,'Protein', 7, 0.5, 1, 1), (90,'Coating', 16, 0.1, 1, 2), (90,'Sauce', 1, 50, 1, 3),
(91,'Base', 15, 0.2, 1, 1), (91,'Sauce', 20, 100, 1, 2), (91,'Herb', 22, 2, 1, 3),
(92,'Protein', 8, 0.3, 1, 1), (92,'Base', 15, 0.2, 1, 2), (92,'Sauce', 24, 50, 1, 3),
(93,'Protein', 7, 0.3, 1, 1), (93,'Base', 15, 0.2, 1, 2), (93,'Protein', 2, 1, 1, 3),
(94,'Protein', 31, 100, 1, 1), (94,'Base', 15, 0.2, 1, 2), (94,'Veggies', 32, 100, 1, 3),
(95,'Protein', 8, 0.5, 1, 1), (95,'Sauce', 20, 100, 1, 2), (95,'Herb', 22, 2, 1, 3),
(96,'Protein', 7, 0.5, 1, 1), (96,'Sauce', 20, 100, 1, 2), (96,'Herb', 22, 2, 1, 3),
(97,'Base', 15, 0.2, 1, 1), (97,'Sauce', 20, 100, 1, 2), (97,'Spices', 22, 2, 1, 3),
(98,'Protein', 8, 0.3, 1, 1), (98,'Sauce', 24, 50, 1, 2), (98,'Base', 14, 0.2, 2, 3),
(99,'Protein', 7, 0.3, 1, 1), (99,'Sauce', 24, 50, 1, 2), (99,'Base', 14, 0.2, 2, 3),
(100,'Protein', 8, 0.8, 1, 1), (100,'Veggies', 1, 2, 1, 2), (100,'Sauce', 30, 200, 1, 3), (100,'Veggies', 33, 2, 1, 4);

/* INSTRUCTIONS (1-100) */
INSERT INTO instructions (step, header, text, recipe_id) VALUES
-- 1-7 (Original Data)
(1, "Prepare sauce", "Brown the ground beef in a large pan over medium heat.", 1),
(2, "Add vegetables", "Chop tomatoes and paprika, add to the beef and simmer for 20 minutes.", 1),
(3, "Cook pasta", "Boil pasta according to package instructions, drain and serve with sauce.", 1),
(1, "Chop vegetables", "Cut tomatoes and paprika into chunks.", 2),
(2, "Combine", "Mix vegetables in a bowl, add cubed feta cheese.", 2),
(3, "Dress", "Drizzle with olive oil, lemon juice, and oregano.", 2),
(1, "Prep ingredients", "Cut chicken into strips, slice vegetables thinly.", 3),
(2, "Cook rice", "Cook rice according to package instructions.", 3),
(3, "Stir fry", "Heat oil in wok, stir fry chicken until golden, add vegetables and cook for 5 minutes.", 3),
(1, "Make batter", "Mix eggs, milk, and mashed banana together.", 4),
(2, "Cook", "Pour batter onto hot pan and cook until golden on both sides.", 4),
(3, "Serve", "Stack pancakes and top with syrup or fruit.", 4),
(1, "Beat eggs", "Whisk eggs together with a pinch of salt.", 5),
(2, "Cook", "Melt butter in pan, pour eggs, sprinkle cheese, cook until set.", 5),
(3, "Serve", "Fold omelette and serve hot.", 5),
(1, "Prep vegetables", "Chop carrots, tomatoes and peas.", 6),
(2, "Cook soup", "Add vegetables to pot with water, simmer for 20 minutes.", 6),
(3, "Season", "Add salt and pepper to taste, serve warm.", 6),
(1, "Cook pasta", "Boil pasta until al dente, drain and cool.", 7),
(2, "Chop vegetables", "Cut tomatoes, paprika, and bell pepper.", 7),
(3, "Mix salad", "Combine pasta and vegetables, drizzle with olive oil and herbs.", 7),
-- 8-100 (Expanded Data)
(1, "Prep sauce", "Sauté chopped onion and garlic. Add tomatoes and simmer for 15 minutes.", 8),
(2, "Cook pasta", "Boil pasta until al dente. Drain.", 8),
(3, "Combine", "Toss pasta with sauce and fresh basil.", 8),
(1, "Prep", "Cook rice and scramble eggs. Chop carrots.", 9),
(2, "Stir fry", "Stir fry carrots and other veggies. Add rice and egg.", 9),
(3, "Season", "Drizzle with soy sauce and serve hot.", 9),
(1, "Prep chicken", "Cook chicken and shred or cube it.", 10),
(2, "Chop veggies", "Chop tomatoes, lettuce (paprika).", 10),
(3, "Mix", "Combine chicken, greens, and dressing. Toss lightly.", 10),
(1, "Prep patty", "Form veggie patty (tofu) and pan fry or bake.", 11),
(2, "Assemble", "Place patty on a bun with onion, tomato, and sauce.", 11),
(1, "Sauté", "Cook mushrooms and garlic until softened.", 12),
(2, "Cook rice", "Add arborio rice and gradually add warm broth, stirring constantly.", 12),
(3, "Finish", "Stir in cheese and season. Serve immediately.", 12),
(1, "Cook beef", "Brown ground beef with paprika and other spices.", 13),
(2, "Prep toppings", "Shred lettuce, chop tomatoes.", 13),
(3, "Serve", "Fill taco shells with beef and toppings.", 13),
(1, "Sauté base", "Cook onion and garlic. Add chicken and brown.", 14),
(2, "Simmer curry", "Add sauce (tomato sauce) and spices (cinnamon). Simmer until chicken is cooked through.", 14),
(3, "Serve", "Serve hot over rice.", 14),
(1, "Prep dressing", "Mix dressing ingredients (mayonnaise, cheese).", 15),
(2, "Toss", "Toss lettuce and croutons with dressing.", 15),
(3, "Garnish", "Top with shaved cheese.", 15),
(1, "Simmer", "Combine tomatoes, milk, and spices. Simmer for 30 minutes.", 16),
(2, "Blend", "Use an immersion blender to make it smooth.", 16),
(3, "Serve", "Serve warm with croutons.", 16),
(1, "Season", "Season chicken breast with salt and herbs.", 17),
(2, "Grill", "Grill or pan-fry chicken until fully cooked.", 17),
(3, "Serve", "Slice and serve with a side of carrots.", 17),
(1, "Cook pasta", "Boil pasta until al dente.", 18),
(2, "Prep sauce", "Whisk eggs and cheese. Fry cured meat (Carero).", 18),
(3, "Combine", "Toss hot pasta with egg mixture and meat. Serve immediately.", 18),
(1, "Sauté base", "Cook onion and garlic. Add vegetables and cook until tender.", 19),
(2, "Simmer", "Add coconut milk and curry paste (Tomato Sauce). Simmer for 20 minutes.", 19),
(1, "Prep fish", "Coat chicken in batter (sub for fish).", 20),
(2, "Fry", "Deep fry the fish and the sliced potatoes (Paprika) until golden.", 20),
(3, "Serve", "Serve with sauce (Tomato Sauce).", 20),
(1, "Prep", "Cook rice. Scramble eggs.", 21),
(2, "Stir fry", "Stir fry eggs, peas, and rice.", 21),
(3, "Season", "Add soy sauce and stir.", 21),
(1, "Prep chicken", "Bread chicken and pan fry until golden.", 22),
(2, "Bake", "Top chicken with sauce (Tomato Sauce) and cheese, then bake until melted.", 22),
(3, "Serve", "Serve with pasta.", 22),
(1, "Cook pasta", "Boil pasta until al dente.", 23),
(2, "Sauté veggies", "Cook carrots and bell pepper until tender.", 23),
(3, "Combine", "Toss pasta with vegetables and light oil.", 23),
(1, "Prep beef", "Slice beef thinly. Chop carrots.", 24),
(2, "Stir fry", "Stir fry beef, then add carrots and sauce (Soy Sauce).", 24),
(3, "Serve", "Serve hot.", 24),
(1, "Prep base", "Boil chicken and vegetables (carrots). Shred chicken.", 25),
(2, "Simmer", "Add noodles (Pasta) and cook until tender.", 25),
(3, "Season", "Season with salt and pepper.", 25),
(1, "Slice", "Slice tomatoes and cheese (Mozzarella).", 26),
(2, "Arrange", "Layer tomatoes, cheese, and basil (Paprika) on a plate.", 26),
(3, "Dress", "Drizzle with olive oil.", 26),
(1, "Cook patty", "Form ground beef patty and grill/pan fry.", 27),
(2, "Assemble", "Place patty on a bun (Bread) with cheese (Cheese) and toppings.", 27),
(1, "Cook chicken", "Cook and shred chicken. Season with paprika.", 28),
(2, "Warm tortillas", "Warm tortillas (Paprika) lightly.", 28),
(3, "Fill", "Fill tortillas with chicken and toppings.", 28),
(1, "Cook pasta", "Boil pasta.", 29),
(2, "Sauté veggies", "Cook carrots and bell pepper. Add cream for a light sauce.", 29),
(3, "Combine", "Toss pasta with vegetables and sauce.", 29),
(1, "Cook pasta", "Boil pasta.", 30),
(2, "Prep sauce", "Sauté fresh tomatoes and basil (Paprika).", 30),
(3, "Combine", "Toss pasta with sauce.", 30),
(1, "Prep chicken", "Toss chicken wings with sauce (Soy Sauce) and seasoning.", 31),
(2, "Bake", "Bake at 200°C for 45 minutes until crispy.", 31),
(1, "Prep veggies", "Chop tofu, carrots, and bell pepper.", 32),
(2, "Stir fry", "Stir fry tofu and vegetables. Add sauce (Soy Sauce).", 32),
(3, "Serve", "Serve hot.", 32),
(1, "Prep beef", "Brown ground beef. Sauté onions and garlic.", 33),
(2, "Simmer", "Add sauce (Tomato Sauce) and spices (Cinnamon). Cook for 40 minutes.", 33),
(1, "Prep base", "Boil chicken and vegetables (carrots, onion). Shred chicken.", 34),
(2, "Simmer", "Cook until vegetables are tender.", 34),
(3, "Season", "Season with salt and pepper.", 34),
(1, "Cook pasta", "Boil pasta.", 35),
(2, "Prep sauce", "Heat cream and butter. Stir in cheese until melted.", 35),
(3, "Combine", "Toss pasta with sauce.", 35),
(1, "Marinate", "Marinate chicken in oil, herbs, and lemon juice (Paprika).", 36),
(2, "Grill", "Grill until cooked through.", 36),
(3, "Serve", "Serve with tomatoes and herbs (Garlic).", 36),
(1, "Prep veggies", "Chop carrots and tomatoes. Add lettuce (Paprika).", 37),
(2, "Wrap", "Place veggies in a tortilla (Bread) and roll tightly.", 37),
(1, "Cook beef", "Brown ground beef. Sauté onions.", 38),
(2, "Combine", "Mix beef with tomato sauce. Toss with cooked pasta.", 38),
(1, "Prep chicken", "Slice grilled chicken.", 39),
(2, "Assemble", "Mix chicken, lettuce (Paprika), and cheese (Cheese). Wrap in a tortilla (Bread).", 39),
(1, "Sauté base", "Cook onion. Add rice and stir.", 40),
(2, "Cook rice", "Gradually add warm broth (Tomato Sauce), stirring constantly.", 40),
(3, "Finish", "Stir in cheese and season.", 40),
(1, "Prep beef", "Slice beef thinly. Cook quickly.", 41),
(2, "Cook noodles", "Boil noodles (Pasta).", 41),
(3, "Combine", "Toss beef, noodles, and sauce (Soy Sauce).", 41),
(1, "Prep chicken", "Slice cooked chicken.", 42),
(2, "Assemble", "Place chicken, lettuce, and mayo (Cheese) on bread.", 42),
(1, "Prep filling", "Sauté vegetables (Tomatoes, Mushrooms, Onion).", 43),
(2, "Assemble", "Layer pasta, filling, and cheese/sauce (Ricotta/Milk).", 43),
(3, "Bake", "Bake at 180°C for 60 minutes.", 43),
(1, "Prep chicken", "Shred or cube cooked chicken.", 44),
(2, "Assemble", "Fill tortillas (Paprika) with chicken and cheese. Fold.", 44),
(3, "Cook", "Grill or pan-fry until golden.", 44),
(1, "Prep beef", "Cook beef strips until tender.", 45),
(2, "Prep sauce", "Make a creamy sauce with sour cream/cream.", 45),
(3, "Combine", "Mix beef with sauce. Serve over egg noodles (Pasta).", 45),
(1, "Cook pasta", "Boil pasta.", 46),
(2, "Prep sauce", "Mix tomatoes, feta (Cheese), and herbs.", 46),
(3, "Combine", "Toss pasta with sauce.", 46),
(1, "Prep rice", "Cook rice. Cook and cube chicken.", 47),
(2, "Stir fry", "Stir fry chicken and vegetables (carrots). Add rice and sauce (Soy Sauce).", 47),
(1, "Prep dough", "Prepare pizza dough (Bread) or use store-bought.", 48),
(2, "Top", "Spread tomato sauce, cheese, and vegetables (Bell Pepper).", 48),
(3, "Bake", "Bake at 200°C for 20 minutes.", 48),
(1, "Prep beef", "Cook beef strips and glaze with sauce (Soy Sauce).", 49),
(2, "Serve", "Serve beef over rice.", 49),
(1, "Prep chicken", "Slice grilled chicken.", 50),
(2, "Assemble", "Fill tortilla (Paprika) with chicken and vegetables (Tomatoes).", 50),
(1, "Prep chicken", "Season chicken. Place in a pan.", 51),
(2, "Bake", "Pour tomatoes (Tomatoes) over chicken and bake.", 51),
(1, "Prep sauce", "Cook ground meat (Ground Beef) and mix with tomato sauce.", 52),
(2, "Assemble", "Layer pasta, meat sauce, and cheese. Bake until bubbly.", 52),
(1, "Prep beef", "Slice cooked steak thinly.", 53),
(2, "Toss", "Combine lettuce (Paprika) and beef. Dress with vinaigrette (Cheese).", 53),
(1, "Prep chicken", "Cook and cube chicken.", 54),
(2, "Cook pasta", "Boil pasta.", 54),
(3, "Combine", "Toss chicken and pasta with a light tomato sauce.", 54),
(1, "Prep base", "Cook rice.", 55),
(2, "Prep veggies", "Roast or sauté carrots and tofu.", 55),
(3, "Assemble", "Combine rice, veggies, and dressing.", 55),
(1, "Prep beef", "Slice cooked beef. Melt cheese (Cheese).", 56),
(2, "Assemble", "Place beef and cheese on bread. Grill or toast.", 56),
(1, "Prep chicken", "Cook and cube chicken.", 57),
(2, "Serve", "Serve chicken over rice with a side of carrots.", 57),
(1, "Prep chicken", "Cube chicken. Make tzatziki (Yogurt).", 58),
(2, "Assemble", "Combine rice, chicken, and toppings (Feta/Cheese).", 58),
(1, "Prep base", "Make a vegetable broth (Carrots, Onion).", 59),
(2, "Add pasta", "Add pasta (Pasta) and cook until tender.", 59),
(1, "Prep beef", "Cook ground beef with spices.", 60),
(2, "Serve", "Serve beef over rice with soy sauce (Soy Sauce).", 60),
(1, "Prep chicken", "Cook chicken. Mix with mayo (Cheese) for salad.", 61),
(2, "Wrap", "Fill tortilla (Paprika) with chicken salad.", 61),
(1, "Prep veggies", "Chop carrots, tomatoes, and peas.", 62),
(2, "Simmer", "Cook vegetables in broth until soft.", 62),
(1, "Prep beef", "Cook beef strips.", 63),
(2, "Wrap", "Fill tortilla (Paprika) with beef and cheese.", 63),
(1, "Prep chicken", "Cut chicken into small pieces. Coat in breadcrumbs (Bread).", 64),
(2, "Cook", "Bake or fry until crispy.", 64),
(1, "Prep filling", "Cube chicken. Chop vegetables (Paprika).", 65),
(2, "Wrap", "Fill tortilla (Paprika) with chicken, vegetables, and cheese.", 65),
(1, "Cook pasta", "Boil pasta. Cool.", 66),
(2, "Prep veggies", "Chop tomatoes and bell pepper.", 66),
(3, "Combine", "Toss pasta and veggies with dressing.", 66),
(1, "Prep beef", "Cook ground beef with taco seasoning.", 67),
(2, "Assemble", "Combine rice, beef, and toppings (Cheese) in a bowl.", 67),
(1, "Prep filling", "Cook chicken, rice, and beans (Peas).", 68),
(2, "Assemble", "Fill tortilla (Paprika) with filling and cheese. Roll tightly.", 68),
(1, "Prep filling", "Cook tofu, rice, and beans (Peas).", 69),
(2, "Assemble", "Fill tortilla (Paprika) with filling and roll.", 69),
(1, "Prep filling", "Cook ground beef and rice.", 70),
(2, "Assemble", "Fill tortilla (Paprika) with filling and cheese.", 70),
(1, "Prep chicken", "Slice chicken and bell pepper into strips.", 71),
(2, "Sizzle", "Cook chicken and bell pepper quickly in a hot pan.", 71),
(3, "Serve", "Serve with warm tortillas (Paprika).", 71),
(1, "Prep base", "Prepare pizza dough (Bread).", 72),
(2, "Top", "Spread sauce (Tomato Sauce), cheese, and vegetables (Paprika).", 72),
(3, "Bake", "Bake at 200°C.", 72),
(1, "Cook pasta", "Boil pasta.", 73),
(2, "Prep eggs", "Whisk eggs with cheese. Add cooled pasta.", 73),
(3, "Cook", "Bake or pan-fry until set.", 73),
(1, "Prep beef", "Cut beef into cubes. Chop vegetables (Bell Pepper, Onion).", 74),
(2, "Assemble", "Skewer beef and vegetables.", 74),
(3, "Grill", "Grill until beef is cooked.", 74),
(1, "Prep chicken", "Cut chicken into cubes. Chop vegetables (Paprika, Onion).", 75),
(2, "Assemble", "Skewer chicken and vegetables.", 75),
(3, "Grill", "Grill until chicken is cooked.", 75),
(1, "Prep veggies", "Chop bell pepper, onion, and carrots.", 76),
(2, "Assemble", "Skewer vegetables.", 76),
(3, "Grill", "Grill until vegetables are tender.", 76),
(1, "Prep chicken", "Cook and cube chicken. Make tzatziki (Yogurt).", 77),
(2, "Assemble", "Combine rice, chicken, and feta (Cheese) in a bowl.", 77),
(1, "Cook pasta", "Boil pasta.", 78),
(2, "Prep sauce", "Whisk eggs and cheese. Fry cured meat (Carero).", 78),
(3, "Combine", "Toss hot pasta with egg mixture and meat. Serve in a bowl.", 78),
(1, "Prep broth", "Make rich beef broth. Add spices (Garlic).", 79),
(2, "Assemble", "Add cooked noodles (Pasta), sliced beef, and herbs to the broth.", 79),
(1, "Prep broth", "Make chicken broth. Add spices (Garlic).", 80),
(2, "Assemble", "Add cooked noodles (Pasta), shredded chicken, and herbs to the broth.", 80),
(1, "Prep broth", "Make vegetable (mushroom) broth.", 81),
(2, "Assemble", "Add cooked noodles (Pasta), tofu, and mushrooms to the broth.", 81),
(1, "Prep beef", "Slice beef (Ground Beef) thinly and cook.", 82),
(2, "Serve", "Fill pita bread (Paprika) with beef, tzatziki (Yogurt), and tomatoes.", 82),
(1, "Prep chicken", "Slice chicken and cook.", 83),
(2, "Serve", "Fill pita bread (Paprika) with chicken, tzatziki (Yogurt), and vegetables.", 83),
(1, "Cook pasta", "Boil pasta.", 84),
(2, "Prep pesto", "Blend basil (Paprika) and nuts (Garlic) to make pesto.", 84),
(3, "Combine", "Toss pasta with pesto.", 84),
(1, "Prep filling", "Cook ground beef with tomato sauce. Make bechamel (Cream/Milk).", 85),
(2, "Assemble", "Layer pasta sheets, meat sauce, and bechamel. Repeat.", 85),
(3, "Bake", "Bake at 180°C for 60-75 minutes.", 85),
(1, "Prep filling", "Cook chicken and mix with creamy sauce (Cream). Make bechamel.", 86),
(2, "Assemble", "Layer pasta sheets, chicken filling, and bechamel. Repeat.", 86),
(3, "Bake", "Bake at 180°C for 60-70 minutes.", 86),
(1, "Prep veggies", "Chop bell pepper and onion. Cook tofu.", 87),
(2, "Assemble", "Fill tortilla (Paprika) with veggies and cheese.", 87),
(3, "Cook", "Grill until golden.", 87),
(1, "Prep beef", "Cook ground beef.", 88),
(2, "Assemble", "Fill tortilla (Paprika) with beef and cheese.", 88),
(3, "Cook", "Grill until golden.", 88),
(1, "Prep beef", "Form ground beef patty with feta (Cheese) and herbs (Garlic).", 89),
(2, "Grill", "Grill patty until cooked.", 89),
(3, "Serve", "Serve on a bun with toppings.", 89),
(1, "Prep chicken", "Pound chicken breast thin. Coat in breadcrumbs (Bread).", 90),
(2, "Cook", "Pan fry until golden and crispy.", 90),
(1, "Cook pasta", "Boil pasta.", 91),
(2, "Prep sauce", "Heat tomato sauce. Add herbs (Garlic).", 91),
(3, "Combine", "Toss pasta with sauce.", 91),
(1, "Prep broth", "Make beef broth (Soy Sauce). Cook beef.", 92),
(2, "Assemble", "Add cooked noodles (Pasta), beef, and vegetables to the broth.", 92),
(1, "Prep broth", "Make chicken broth (Soy Sauce). Cook chicken. Boil egg.", 93),
(2, "Assemble", "Add cooked noodles (Pasta), chicken, and soft egg to the broth.", 93),
(1, "Prep broth", "Make vegetable broth. Cook tofu.", 94),
(2, "Assemble", "Add cooked noodles (Pasta), tofu, and mushrooms to the broth.", 94),
(1, "Prep beef", "Form ground beef into meatballs with herbs (Garlic).", 95),
(2, "Cook", "Bake or pan fry meatballs. Serve with tomato sauce.", 95),
(1, "Prep chicken", "Form ground chicken into meatballs with herbs (Garlic).", 96),
(2, "Cook", "Bake or pan fry meatballs. Serve with tomato sauce.", 96),
(1, "Cook pasta", "Boil pasta.", 97),
(2, "Prep sauce", "Heat tomato sauce with chili (Garlic) and garlic.", 97),
(3, "Combine", "Toss pasta with spicy sauce.", 97),
(1, "Prep beef", "Slice beef. Marinate and cook in teriyaki sauce (Soy Sauce).", 98),
(2, "Serve", "Serve beef over rice.", 98),
(1, "Prep chicken", "Cube chicken. Marinate and cook in teriyaki sauce (Soy Sauce).", 99),
(2, "Serve", "Serve chicken over rice.", 99),
(1, "Prep filling", "Brown ground beef. Slice eggplant (Paprika).", 100),
(2, "Assemble", "Layer beef, eggplant, and bechamel (Cream).", 100),
(3, "Bake", "Bake at 180°C for 90 minutes.", 100);

/* SHOPPING LIST (missing ingredients for vegetable soup) */
insert into shopping_list (product_id, amount) values 
(6, 2), /* 2 tomatoes */
(5, 1); /* 1 carrot */

/* SHOPPING LIST ???*/
insert into shopping_list (product_id, amount) values (3, 2); /* id = 1 - Milk, 2 L,  */
insert into shopping_list (product_id, amount) values (16, 1); /* id = 2 - Bread, 1 pcs,  */
insert into shopping_list (product_id, amount) values (2, 1); /* id = 3 - Eggs, 1 pcs,  */
insert into shopping_list (product_id, amount) values (9, 0.5); /* id = 4 - Cheese, 0.5 kg,  */
insert into shopping_list (product_id, amount) values (11, 6); /* id = 5 - Apples, 6 pcs,  */ 