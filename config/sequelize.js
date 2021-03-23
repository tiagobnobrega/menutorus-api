//! This file should not be changed //
//* Exports relevant parts of configuration to sequelize migration
const config = require('./config');
if(!config.db){
    throw new Error(`db configurations not defined. Check current environment (${process.env.NODE_ENV}) config file.`)
}
module.exports = config.db;