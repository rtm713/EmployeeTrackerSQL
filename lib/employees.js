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
    let manList = [];
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
    let ManagerID = manList.indexOf(newEmployee.newEmployeeManager) +1;

    const [employees] = await connection.execute('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)', [newEmployee.newEmployeeFirst, newEmployee.newEmployeeLast, roleID, ManagerID]);
    console.log(`Added ${newEmployee.newEmployeeFirst} ${newEmployee.newEmployeeLast} to employees`);
    renderMenu();
};


module.exports = {viewEmployees, addEmployee};