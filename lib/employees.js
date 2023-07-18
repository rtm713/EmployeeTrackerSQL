require('dotenv').config();
const {buildConnectionOptions, createConnection} = require('../config/dbConfig');
const inquirer = require('inquirer');

async function viewEmployees() {
    const connection = await(createConnection(buildConnectionOptions()));
    const renderMenu = require('./questions');

    const [employees] = await connection.execute("SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employees JOIN roles ON employees.role_id = roles.id JOIN departments ON roles.department_id = departments.id LEFT JOIN employees AS manager ON employees.manager_id = manager.id;", []);
    console.table(employees);
    renderMenu();
};

async function addEmployee() {
    const connection = await(createConnection(buildConnectionOptions()));
    const renderMenu = require('./questions');

    let [roles] = await connection.execute('SELECT * FROM roles;', []);
    let roleList = [];
    roles.forEach(role =>{roleList.push(role.title)});

    let [managers] = await connection.execute('SELECT * FROM employees;', []);
    let manList = ['None'];
    managers.forEach(manager =>{manList.push(manager.first_name + ' ' + manager.last_name)});

    let newEmployee = await inquirer.prompt([{
        type: 'input',
        message: "What is the employees first name?",
        name: 'newEmployeeFirst',
    },{
        type: 'input',
        message: "What is the employees last name?",
        name: 'newEmployeeLast',
    },{
        type: 'list',
        message: "What is this employees role?",
        name: 'newEmployeeRole',
        choices: roleList,
    },{
        type: 'list',
        message: "Who is this employees manager?",
        name: 'newEmployeeManager',
        choices: manList,
    }]);

    let roleID = roleList.indexOf(newEmployee.newEmployeeRole) + 1;
    let ManagerID = newEmployee.newEmployeeManager === 'None' ? null : manList.indexOf(newEmployee.newEmployeeManager);

    const [employees] = await connection.execute('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)', [newEmployee.newEmployeeFirst, newEmployee.newEmployeeLast, roleID, ManagerID]);
    console.log(`Added ${newEmployee.newEmployeeFirst} ${newEmployee.newEmployeeLast} to employees`);
    renderMenu();
};

async function updateEmployeeRole() {
    const connection = await(createConnection(buildConnectionOptions()));
    const renderMenu = require('./questions');

    let [allEmployees] = await connection.execute('SELECT * FROM employees;', []);
    let employeeList = [];
    allEmployees.forEach(employee =>{employeeList.push(employee.first_name + ' ' + employee.last_name)});

    let [roles] = await connection.execute('SELECT * FROM roles;', []);
    let roleList = [];
    roles.forEach(role =>{roleList.push(role.title)});

    let newRoleQuestions = await inquirer.prompt([{
        type: 'list',
        message: "Which employee is changing roles?",
        name: 'employeeChoice',
        choices: employeeList,
    },{
        type: 'list',
        message: "What is this employees new role?",
        name: 'newRole',
        choices: roleList,
    }]);

    let employeeID = employeeList.indexOf(newRoleQuestions.employeeChoice) + 1;
    let roleID = roleList.indexOf(newRoleQuestions.newRole) + 1;

    const [employees] = await connection.execute('UPDATE employees SET role_id = ? WHERE id = ?', [roleID, employeeID]);
    console.log(`Updated ${newRoleQuestions.employeeChoice} to ${newRoleQuestions.newRole}`);
    renderMenu();
};

async function updateManager() {
    const connection = await(createConnection(buildConnectionOptions()));
    const renderMenu = require('./questions');

    let [allEmployees] = await connection.execute('SELECT * FROM employees;', []);
    let employeeList = [];
    allEmployees.forEach(employee =>{employeeList.push(employee.first_name + ' ' + employee.last_name)});
    let managerList = ['None'];
    allEmployees.forEach(employee =>{managerList.push(employee.first_name + ' ' + employee.last_name)});

    let newManagerQuestions = await inquirer.prompt([{
        type: 'list',
        message: "Which employee is changing managers?",
        name: 'employeeChoice',
        choices: employeeList,
    },{
        type: 'list',
        message: "Who is this employees new manager?",
        name: 'managerChoice',
        choices: managerList,
    }]);

    let employeeID = employeeList.indexOf(newManagerQuestions.employeeChoice) + 1;
    let managerID = newManagerQuestions.managerChoice === 'None' ? null : managerList.indexOf(newManagerQuestions.managerChoice);

    const [employees] = await connection.execute('UPDATE employees SET manager_id = ? WHERE id = ?', [managerID, employeeID]);
    console.log(`Updated ${newManagerQuestions.employeeChoice}'s manager to ${newManagerQuestions.managerChoice}`);
    renderMenu();
};

async function viewByManager() {
    const connection = await(createConnection(buildConnectionOptions()));
    const renderMenu = require('./questions');

    let [allEmployees] = await connection.execute('SELECT * FROM employees;', []);
    let employeeList = [];
    allEmployees.forEach(employee =>{employeeList.push(employee.first_name + ' ' + employee.last_name)});

    let [allManagers] = await connection.execute('SELECT manager_id FROM employees;', []);
    let filterList = allManagers.filter(manager => manager.manager_id != null);
    let managerList = ['None'];
    filterList.forEach(manager => {managerList.push(employeeList[manager.manager_id - 1])});
    let newManagerList = managerList.filter((item, index) => managerList.indexOf(item) === index);

    let viewManagerQuestions = await inquirer.prompt([{
        type: 'list',
        message: "Select a manager to view their employees",
        name: 'managerChoice',
        choices: newManagerList,
    }]);

    let managerID = viewManagerQuestions.managerChoice === 'None' ? null : employeeList.indexOf(viewManagerQuestions.managerChoice) + 1;

    const [employees] = await connection.execute("SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employees JOIN roles ON employees.role_id = roles.id JOIN departments ON roles.department_id = departments.id LEFT JOIN employees AS manager ON employees.manager_id = manager.id WHERE employees.manager_id = ?;", [managerID]);
    console.table(employees);
    renderMenu();
};


module.exports = {viewEmployees, addEmployee, updateEmployeeRole, updateManager, viewByManager};