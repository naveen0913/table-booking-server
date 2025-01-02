import Tables from "../models/Tables.js";

export const addNewTable = async (req, res) => {
  try {
    // Destructure the request body
    const {
      availableDate,
      availableTime,
      tableType,
      isbooked, 
      capacity,
      category,
    } = req.body;

    // Validate required fields
    if (
      !availableDate ||
      !availableTime ||
      !tableType ||
      isbooked === undefined || 
      !capacity ||
      !category
    ) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "All fields are required.",
      });
    }

    // Insert data into the database
    await Tables.create({
      availableDate,
      availableTime,
      tableType,
      isbooked,
      capacity,
      category,
    });

    // Respond with success
    res.status(201).json({
      code: process.env.STATUS_CODE_CREATED || 201,
      status: "success",
      message: "Table created successfully.",
    });
  } catch (error) {
    res.status(500).json({
      code: process.env.STATUS_CODE_INTERNAL_ERROR,
      message: "Failed to create table.",
      error: error.message,
    });
  }
};

export const getAllTables = async(req,res)=>{
    try {
        const tableData = await Tables.findAll({});
        res.status(200).json({ code: process.env.STATUS_CODE_SUCCESS, data: tableData })
    } catch (error) {
        console.error('Error fetching table data:', error.message);
        res.status(500).json({ code: process.env.STATUS_CODE_INTERNAL_ERROR, error: 'Internal server error.' });
    }
}