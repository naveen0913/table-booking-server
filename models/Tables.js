import { DataTypes } from 'sequelize';
import sequelize from '../config/dbConfig.js';

const Tables = sequelize.define('tables', {
    table_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    availableDate:{
        type:DataTypes.DATEONLY
    },
    availableTime:{
        type:DataTypes.TIME
    },
    tableType:{
        type:DataTypes.STRING
    },
    isbooked:{
        type:DataTypes.BOOLEAN
    },
    capacity:{
        type:DataTypes.INTEGER
    },
    category: {
        type: DataTypes.STRING,
      },
    
});

export default Tables;