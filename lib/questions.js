const inquirer = require('inquirer');
const viewDepartments = require('./departments');



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
                viewDepartments();
                break;
            case 'View all roles':
                console.log("this would show roles");
                break;
            case 'View all employees':
                console.log('This would render employees');
                break;
        }
    });
};

module.exports = renderMenu;