import express from 'express'
import {  createBooking,deleteBooking,getAllBookings,getUserBookings } from '../controllers/BookingController.js';

const router = express.Router();

router.post("/create/:tableId/:userId",createBooking);
router.get('/user/:userId', getUserBookings);
router.get('/all',getAllBookings);
router.delete('/:bookingId/:tableId',deleteBooking)


export default router;