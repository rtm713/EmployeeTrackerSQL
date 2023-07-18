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
            'Update employee manager',
            'View employees by manager',
            'View employees by department',
            'View the total utilized budget of a department',
            'Delete a department',
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
            case 'Update employee role':
                employees.updateEmployeeRole();
                break;
            case 'Update employee manager':
                employees.updateManager();
                break;
            case 'View employees by manager':
                employees.viewByManager();
                break;
            case 'View employees by department':
                departments.viewByDepartment();
                break;
            case 'View the total utilized budget of a department':
                departments.viewDepartmentBudget();
                break;
            case 'Delete a department':
                departments.deleteDepartment();
                break;
        }
    });
};

module.exports = renderMenu;