USE employee_db;

INSERT INTO departments (name) 
    VALUES ('ENGINEERING'), ('SALES'),("FINANCE");

INSERT INTO roles (title, salary, department_id)
    VALUES ('SALES MANAGER', 85000, 2),('SALESPERSON', 50000, 2),
    ('SENIOR ENGINEER', 90000, 1),('JUNIOR ENGINEER', 65000, 1),
    ('FINANCE DIRECTOR', 75000, 3),('PAYROLL SPECIALIST', 45000, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
    VALUES ('John', 'Smith', 1, NULL),('Shelby', 'Miller', 2, 1),
    ('Hunter', 'Johnson', 3, NULL),('Trey', 'Birmingham', 4, 3),
    ('Brittany', 'Wilson', 5, NULL),('Michael', 'Spears', 6, 5);