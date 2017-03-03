exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://jon:allison9@ds113650.mlab.com:13650/capstone-two-users';
exports.PORT = process.env.PORT || 8080;