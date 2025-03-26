CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  description TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example seed data
INSERT INTO locations (name, address, description, latitude, longitude) VALUES
('Coffee Shop', '123 Main St, Anytown, USA', 'A cozy coffee shop with great pastries.', 37.7749, -122.4194),
('Bookstore', '456 Market St, Anytown, USA', 'Independent bookstore with a large selection.', 37.7831, -122.4075),
('Park', '789 Park Ave, Anytown, USA', 'Beautiful city park with walking trails.', 37.7694, -122.4862); 