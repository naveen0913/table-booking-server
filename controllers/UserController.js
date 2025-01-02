import Users from "../models/Users.js";

export const userSignUp = async (req,res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ code: process.env.STATUS_CODE_BAD_REQUEST, message: 'All fields are required' });
    }
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) return res.status(409).send({ code: process.env.STATUS_CODE_EXISTS, error: 'User already exists.' });

    try {

        // Create a new user
        const user = await Users.create({
            username,
            email,
            password,
        });

        res.status(201).json({ code: process.env.STATUS_CODE_CREATED, message: 'User registered successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });

    }
}

export const userLogin = async (req,res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ code: process.env.STATUS_CODE_BAD_REQUEST, message: 'All fields are required' });
    }

    try {
        const existingUser = await Users.findOne({ where: { email } });
        if (!existingUser) {
            return res.status(404).send({ code: process.env.STATUS_CODE_NOT_FOUND, error: 'User not found.' });
        }
        if (existingUser.password !== password) {
            return res.status(400).send({ code: process.env.STATUS_CODE_BAD_REQUEST, error: 'Invalid password.Please try again!' });
        }
        res.status(200).json({code:process.env.STATUS_CODE_SUCCESS,message:"Login Successful",data:existingUser});

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });

    }

}

export const updateUserDetails=async(req,res)=>{
    const { id } = req.params;
    const { username, email, password } = req.body;

    try {
        const user = await Users.findByPk(id);

        if (!user) {
            return res.status(404).send({ code: process.env.STATUS_CODE_NOT_FOUND, error: 'User not found.' });
        }

        // Update fields if provided
        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = password;

        await user.save();

        res.status(200).json({code:process.env.STATUS_CODE_SUCCESS, message: 'User updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}