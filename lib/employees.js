require('dotenv').config();
const {buildConnectionOptions, createConnection} = require('../config/dbConfig');

async function viewEmployees() {
    const connection = await(createConnection(buildConnectionOptions()));
    const renderMenu = require('./questions');

    const [employees] = await connection.execute('SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.name AS department FROM employees JOIN roles ON employees.role_id = roles.id JOIN departments ON roles.department_id = departments.id;', []);
    console.table(employees);
    renderMenu();
};

module.exports = viewEmployees;