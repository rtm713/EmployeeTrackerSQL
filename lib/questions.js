const inquirer = require('inquirer');
const departments = require('./departments');
const roles = require('./roles');
const employees = require('./employees');



const questions = [
    {
        type: "list",
        message: "What would you like to do?",
        name: "menuChoice",
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add new department',
            'Add new role',
            'Add new employee',
            'Update employee role',
        ]
    }
];

function renderMenu() {
    inquirer.prompt(questions).then(function(choice) {
        switch(choice.menuChoice) {
            case 'View all departments':
                departments.viewDepartments();
                break;
            case 'View all roles':
                roles.viewRoles();
                break;
            case 'View all employees':
                employees.viewEmployees();
                break;
            case 'Add new department':
                departments.addDepartment();
                break;
            case 'Add new role':
                roles.addRole();
                break;
            case 'Add new employee':
                employees.addEmployee();
                break;
        }
    });
};

module.exports = renderMenu;