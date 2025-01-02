import { DataTypes } from 'sequelize';
import  sequelize from '../config/dbConfig.js';

// Initialize Sequelize
const Users = sequelize.define('users', {
  id: {
    type: DataTypes.UUID, 
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  password:{
    type:DataTypes.STRING
  }
  
});

export default Users;