const UserController = require('./controllers/UserControllers')


module.exports = [
  {
    endpoint: '/users',
    method: 'GET',
    handler: UserController.listUsers,
  },
];