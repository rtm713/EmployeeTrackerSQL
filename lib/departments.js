require('dotenv').config();
const {buildConnectionOptions, createConnection} = require('../config/dbConfig');
const inquirer = require('inquirer');

async function viewDepartments() {
    const connection = await(createConnection(buildConnectionOptions()));
    const renderMenu = require('./questions');

    const [departments] = await connection.execute('SELECT * FROM departments;', []);
    console.table(departments);
    renderMenu();
};

async function addDepartment() {
    const connection = await(createConnection(buildConnectionOptions()));
    const renderMenu = require('./questions');

    let newDep = await inquirer.prompt({
        type: 'input',
        message: "What is the name of the new department?",
        name: 'newDepAnswer',
    });

    const [departments] = await connection.execute('INSERT INTO departments (name) VALUES (?)', [newDep.newDepAnswer]);
    console.log(`Added ${newDep.newDepAnswer} to departments`);
    renderMenu();
};

async function viewByDepartment() {
    const connection = await(createConnection(buildConnectionOptions()));
    const renderMenu = require('./questions');

    let [allDepartments] = await connection.execute('SELECT * FROM departments;', []);
    let departmentList = [];
    allDepartments.forEach(department =>{departmentList.push(department.name)});

    let viewByDep = await inquirer.prompt({
        type: 'list',
        message: "What department would you like to view?",
        name: 'departmentChoice',
        choices: departmentList,
    });

    let departmentID = departmentList.indexOf(viewByDep.departmentChoice) + 1;

    const [departments] = await connection.execute("SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employees JOIN roles ON employees.role_id = roles.id JOIN departments ON roles.department_id = departments.id LEFT JOIN employees AS manager ON employees.manager_id = manager.id WHERE department_id = ?;", [departmentID]);
    console.table(departments);
    renderMenu();
};

async function viewDepartmentBudget() {
    const connection = await(createConnection(buildConnectionOptions()));
    const renderMenu = require('./questions');

    let [allDepartments] = await connection.execute('SELECT * FROM departments;', []);
    let departmentList = [];
    allDepartments.forEach(department =>{departmentList.push(department.name)});

    let viewByDep = await inquirer.prompt({
        type: 'list',
        message: "Which department budget would you like to view?",
        name: 'departmentChoice',
        choices: departmentList,
    });

    let departmentID = departmentList.indexOf(viewByDep.departmentChoice) + 1;

    const [departments] = await connection.execute("SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employees JOIN roles ON employees.role_id = roles.id JOIN departments ON roles.department_id = departments.id LEFT JOIN employees AS manager ON employees.manager_id = manager.id WHERE department_id = ?;", [departmentID]);
    let salaryList = [];
    departments.forEach(department => salaryList.push(parseInt(department.salary)))
    let salaryTotal = salaryList.reduce((a, b) => a + b);
    
    let budgetBox = `
     ____________________________________________
                                                
              The total budget for the          
            ${viewByDep.departmentChoice} department   
                    is $ ${salaryTotal.toLocaleString("en-US")}         
    ____________________________________________
    `

    console.table(departments);
    console.log(budgetBox);
    renderMenu();
};

async function deleteDepartment() {
    const connection = await(createConnection(buildConnectionOptions()));
    const renderMenu = require('./questions');

    let [allDepartments] = await connection.execute('SELECT * FROM departments;', []);
    let departmentList = [];
    allDepartments.forEach(department =>{departmentList.push(department.name)});

    let viewByDep = await inquirer.prompt({
        type: 'list',
        message: "What department would you like to delete?",
        name: 'departmentChoice',
        choices: departmentList,
    });

    let departmentID = departmentList.indexOf(viewByDep.departmentChoice) + 1;

    const [departments] = await connection.execute("DELETE FROM departments WHERE departments.id = ?;", [departmentID]);
    console.log(`The ${viewByDep.departmentChoice} department was deleted`);
    renderMenu();
};

module.exports = { viewDepartments, addDepartment, viewByDepartment, viewDepartmentBudget, deleteDepartment}