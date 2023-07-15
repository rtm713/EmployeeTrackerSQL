require('dotenv').config();
const {buildConnectionOptions, createConnection} = require('../config/dbConfig');

async function viewRoles() {
    const connection = await(createConnection(buildConnectionOptions()));
    const renderMenu = require('./questions');

    const [roles] = await connection.execute('SELECT roles.id, roles.title, roles.salary, departments.name AS department FROM roles JOIN departments ON roles.department_id = departments.id;', []);
    console.table(roles);
    renderMenu();
};

module.exports = viewRoles;