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

module.exports = { viewDepartments, addDepartment}