require('dotenv').config();
const {buildConnectionOptions, createConnection} = require('../config/dbConfig');

async function viewDepartments() {
    const connection = await(createConnection(buildConnectionOptions()));
    const renderMenu = require('./questions');

    const [departments] = await connection.execute('SELECT * FROM departments;', []);
    console.table(departments);
    renderMenu();
};

module.exports = viewDepartments;