// controllers/bookingController.js
import Booking from '../models/TableBooking.js';
import Users from '../models/Users.js';
import Tables from '../models/Tables.js';
import moment from 'moment';

// Define associations
Users.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(Users, { foreignKey: 'userId' });

Tables.hasMany(Booking, { foreignKey: 'tableId' });
Booking.belongsTo(Tables, { foreignKey: 'tableId' });

// Controller methods
export const createBooking = async (req, res) => {
  try {
    const { date, time, guests, name, contact } = req.body;
    const { tableId, userId } = req.params;

    if (!date || !time || !guests || !name || !contact) {
      return res.status(process.env.STATUS_CODE_BAD_REQUEST).json({
        code:  process.env.STATUS_CODE_BAD_REQUEST,
        status: "error",
        message: "All fields are required.",
      });
    }
    const existedUser = await Users.findByPk(userId);

    if (!existedUser) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "User not found",
      });
    }
    const existingTable = await Tables.findByPk(tableId);
    if (!existingTable) {
      return res.status(process.env.STATUS_CODE_NOT_FOUND).json({
        code: process.env.STATUS_CODE_NOT_FOUND,
        status: "error",
        message: "Table not found",
      });
    }

    const payloadDate = moment(date, "YYYY-MM-DD");
    const payloadTime = moment(time, "HH:mm");

    // Combine and parse the table's available date and time
    const tableDate = moment(existingTable.availableDate, "YYYY-MM-DD");
    const tableTime = moment(existingTable.availableTime, "HH:mm:ss");


    // Check if the dates are the same
    if (!payloadDate.isSame(tableDate, 'day')) {
      return res.status(process.env.STATUS_CODE_BAD_REQUEST).json({
        code:  process.env.STATUS_CODE_BAD_REQUEST,
        status: "error",
        message: "The selected table is not available on the given date.",
      });
    }


    // Check if the times are the same
    if (!payloadTime.isSame(tableTime, 'minute')) {
      return res.status(process.env.STATUS_CODE_BAD_REQUEST).json({
        code: process.env.STATUS_CODE_BAD_REQUEST,
        status: "error",
        message: "The selected table is not available at the given time.",
      });
    }

    if (existingTable.isbooked) {
      return res.status(process.env.STATUS_CODE_BAD_REQUEST).json({
        code: process.env.STATUS_CODE_BAD_REQUEST,
        status: "error",
        message: "The table is already booked.",
      });
    }

    if (guests > existingTable.capacity) {
      return res.status(process.env.STATUS_CODE_BAD_REQUEST).json({
        code: process.env.STATUS_CODE_BAD_REQUEST,
        status: "error",
        message: "Guests are more than table capacity",
      });
    }

    const existingBooking = await Booking.findOne({
      where: { date, time, tableId },
    });

    if (existingBooking) {
      return res.status(process.env.STATUS_CODE_BAD_REQUEST).json({ code: process.env.STATUS_CODE_BAD_REQUEST, message: 'Table is already booked for the selected time.' });
    }

    await Booking.create({
      userId,
      tableId,
      date,
      time,
      guests,
      name,
      contact,
    });
    await Tables.update(
      { isbooked: true },
      { where: { table_id: tableId } }
    );


    res.status(process.env.STATUS_CODE_CREATED).json({ code: process.env.STATUS_CODE_CREATED, message: "Booking Successful" });
  } catch (error) {
    console.error(error);
    res.status(process.env.STATUS_CODE_INTERNAL_ERROR).json({
      code: process.env.STATUS_CODE_INTERNAL_ERROR
      , message: error.message
    });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.findAll({
      where: { userId },
      include: [
        { model: Tables, attributes: ['table_id', 'capacity', 'tableType', 'isbooked', 'category'] },
      ],
    });

    res.status(process.env.STATUS_CODE_SUCCESS).json({ code: process.env.STATUS_CODE_SUCCESS, bookings });
  } catch (error) {
    res.status(process.env.STATUS_CODE_INTERNAL_ERROR).json({
      code: process.env.STATUS_CODE_INTERNAL_ERROR
      , message: error.message
    });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        { model: Users, attributes: ['username', 'email', 'password'] },
        { model: Tables, attributes: ['table_id', 'capacity', 'tableType', 'isbooked', 'category'] },
      ],
    });

    res.status(200).json({ code: process.env.STATUS_CODE_SUCCESS, bookings });
  } catch (error) {
    res.status(500).json({
      code: process.env.STATUS_CODE_INTERNAL_ERROR
      , message: error.message
    });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { bookingId, tableId } = req.params;

    const existedBooking = await Booking.findByPk(bookingId);
    if (!existedBooking) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Booking not found",
      });
    }

    const existingTable = await Tables.findByPk(tableId);
    if (!existingTable) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Table not found",
      });
    }

    await Booking.destroy({ where: { bookingId: bookingId } });
    await Tables.update(
      { isbooked: false },
      { where: { table_id: tableId } }
    );

    res.status(200).json({ code: process.env.STATUS_CODE_SUCCESS, message: "Booking Canceled Successfully" });

  } catch (error) {
    res.status(500).json({
      code: process.env.STATUS_CODE_INTERNAL_ERROR, message: error.message
    });
  }
}