require('dotenv').config();
const {buildConnectionOptions, createConnection} = require('../config/dbConfig');
const inquirer = require('inquirer');

async function viewRoles() {
    const connection = await(createConnection(buildConnectionOptions()));
    const renderMenu = require('./questions');

    const [roles] = await connection.execute('SELECT roles.id, roles.title, roles.salary, departments.name AS department FROM roles JOIN departments ON roles.department_id = departments.id;', []);
    console.table(roles);
    renderMenu();
};

async function addRole() {
    const connection = await(createConnection(buildConnectionOptions()));
    const renderMenu = require('./questions');

    let [departments] = await connection.execute('SELECT * FROM departments;', []);
    let depList = [];
    departments.forEach(department =>{depList.push(department.name)});

    let newRole = await inquirer.prompt([{
        type: 'input',
        message: "What is the name of the new role?",
        name: 'newRoleName',
    },{
        type: 'input',
        message: "What is the salary of the new role?",
        name: 'newRoleSalary',
    },{
        type: 'list',
        message: "What department is this new role in?",
        name: 'newRoleDepartment',
        choices: depList,
    }]);

    let roleDepID = depList.indexOf(newRole.newRoleDepartment) + 1;

    const [roles] = await connection.execute('INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)', [newRole.newRoleName, newRole.newRoleSalary, roleDepID]);
    console.log(`Added ${newRole.newRoleName} to roles`);
    renderMenu();
};

module.exports = {viewRoles, addRole};