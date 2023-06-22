require("dotenv").config();
const UserModel = require("../model/userModel");
const accessToken = require("../utilities/tokenmanager/token");
const enc_dec = require("../utilities/decryptor/decryptor");
const moment = require("moment");

var AuthController = {
    register: async (req, res) => {
        try {
            let plainPass;
            if (req.bodyString("password")) {
                plainPass = req.bodyString("password");
            }
            let hashPassword = await enc_dec.encrypt(plainPass);

            userData = {
                full_name: req.bodyString("full_name"),
                email: req.bodyString("email"),
                position: req.bodyString("position"),
                institution_name: req.bodyString("institution_name"),
                education_level: req.bodyString("education_level"),
                work_time: req.bodyString("work_time"),
                password: hashPassword,
            };
            await UserModel.add(userData)
                .then((result) => {
                    res.status(200).json({
                        status: true,
                        message: "User created successfully!",
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        status: false,
                        message: "Unable to register user. Try again!",
                    });
                });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                message: "Server side error! Try again.",
            });
        }
    },

    details: async (req, res) => {
        try {
            let id = req.user.id;
            await UserModel.select({ id: id })
                .then((result) => {
                    let user_data = {
                        full_name: result[0]?.full_name
                            ? result[0]?.full_name
                            : "",
                        email: result[0]?.email ? result[0]?.email : "",
                        birth_date: result[0]?.birth_date
                            ? result[0]?.birth_date
                            : "",
                        gender: result[0]?.gender ? result[0]?.gender : "",
                        phone: result[0]?.phone ? result[0]?.phone : "",
                        cover_letter: result[0]?.cover_letter
                            ? result[0]?.cover_letter
                            : "",
                    };
                    res.status(200).json({
                        status: true,
                        user_data,
                        message: "User details updated successfully!",
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        status: false,
                        message: "Unable to update details. Try again!",
                    });
                });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                message: "Server side error! Try again.",
            });
        }
    },
    
    update_details: async (req, res) => {
        try {
            const currentDate = moment().format("YYYY-MM-DD");
            let id = req.user.id;
            userData = {
                full_name: req.bodyString("full_name"),
                birth_date: req.bodyString("birth_date"),
                gender: req.bodyString("gender"),
                email: req.bodyString("email"),
                phone: req.bodyString("phone"),
                cover_letter: req.bodyString("cover_letter"),
                updated_at: currentDate,
            };
            await UserModel.updateDetails({ id: id }, userData)
                .then((result) => {
                    res.status(200).json({
                        status: true,
                        message: "User details updated successfully!",
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        status: false,
                        message: "Unable to update details. Try again!",
                    });
                });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                message: "Server side error! Try again.",
            });
        }
    },

    login: async (req, res) => {
        let foundUser = await UserModel.select({
            email: req.bodyString("email"),
        });

        if (foundUser.length > 0) {
            let submittedPass = req.bodyString("password");
            let plainPassword = await enc_dec.decrypt(foundUser[0].password);

            if (submittedPass === plainPassword) {
                payload = {
                    id: foundUser[0].id,
                    full_name: foundUser[0].full_name,
                    email: foundUser[0].email,
                    position: foundUser[0].position,
                };
                const token = accessToken(payload);
                let res_data = {
                    full_name: foundUser[0].full_name,
                    position: foundUser[0].position,
                    token: token,
                };
                res.status(200).json({
                    status: true,
                    data: res_data,
                    message: "User logged in successfully!",
                });
            } else {
                res.status(500).json({
                    status: false,
                    data: {},
                    error: "Wrong Password!",
                });
            }
        } else {
            res.status(500).json({
                status: false,
                data: {},
                error: "User not exists!",
            });
        }
    },
};

module.exports = AuthController;
