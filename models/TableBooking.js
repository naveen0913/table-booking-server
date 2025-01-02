import { DataTypes } from 'sequelize';
import sequelize from '../config/dbConfig.js'; 

const Booking = sequelize.define('booking', {
    bookingId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    date: {
        type: DataTypes.DATEONLY,
    },
    time: {
        type: DataTypes.TIME,
    },
    guests: {
        type: DataTypes.INTEGER,
    },
    name: {
        type: DataTypes.STRING,
    },
    contact: {
        type: DataTypes.STRING,
    },
}, {
    indexes: [
        {
            unique: true,
            fields: ['date', 'time'],
        },
    ],
});

export default Booking;
