USE employee_db;

INSERT INTO departments (name) 
    VALUES ('ENGINEERING'), ('SALES'),("FINANCE"),("LEGAL");

INSERT INTO roles (title, salary, department_id)
    VALUES ('SALES MANAGER', 60000, 2),('SALESPERSON', 40000, 2);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
    VALUES ('John', 'Smith', 1, NULL),('Jane', 'Miller', 2, 1);