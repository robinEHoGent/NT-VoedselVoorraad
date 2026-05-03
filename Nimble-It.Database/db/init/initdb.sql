-- Database
CREATE DATABASE IF NOT EXISTS nimbleit_db;

USE nimbleit_db;

-- Delete tables for reset (while development)
DROP TABLE IF EXISTS shopping_list;
DROP TABLE IF EXISTS recipe_tags;
DROP TABLE IF EXISTS recipe_info;
DROP TABLE IF EXISTS instructions;
DROP TABLE IF EXISTS inventories;
DROP TABLE IF EXISTS recipes;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS units_of_measurement;
DROP TABLE IF EXISTS storage_types;

-- Lookup tables first
CREATE TABLE storage_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
) ENGINE = InnoDB;

CREATE TABLE units_of_measurement (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(10) NOT NULL
) ENGINE = InnoDB;

CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
) ENGINE = InnoDB;

-- Categories referencing storage_types
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    notification_time INT NULL
) ENGINE = InnoDB;

-- Products referencing categories and units_of_measurement
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    category_id INT,
    uom_id INT,
    image_url VARCHAR(200), -- task 216: URL storage voor images
    FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL,
    FOREIGN KEY (uom_id) REFERENCES units_of_measurement (id) ON DELETE SET NULL
) ENGINE = InnoDB;

-- Recipes
CREATE TABLE recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TINYTEXT NULL,
    prepare_time int NULL,
    complexity INT NULL,
    serving_size INT NULL,
    image_url VARCHAR(200),
    created_on DateTime not null,
    last_cooked DateTime null,
    favorite boolean not null default 0
) ENGINE = InnoDB;

-- instructions
CREATE TABLE instructions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    step int not null,
    header VARCHAR(50) not null,
    text text not null,
    recipe_id int null,
    foreign key (recipe_id) references recipes (id) on delete set null
)ENGINE = InnoDB;

-- Inventories referencing products
CREATE TABLE inventories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    amount DECIMAL(12, 3) DEFAULT 0.000,
    purchase_date DATE NULL,
    expiry_date DATE NULL,
    storage_type_id INT,
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
    FOREIGN KEY (storage_type_id) REFERENCES storage_types (id) ON DELETE SET NULL
) ENGINE = InnoDB;

-- Recipe info referencing recipes, products, units_of_measurement
CREATE TABLE recipe_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_id INT,
    product_id INT,
    amount DECIMAL(12, 3) not null,
    title varchar(50) not null,
    part INT not null,
    order_index int not null,
    FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- Recipe tags referencing recipes and tags
CREATE TABLE recipe_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_id INT,
    tag_id INT,
    FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- Shopping list referencing products
CREATE TABLE shopping_list (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    amount DECIMAL(12, 3),
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE = InnoDB;