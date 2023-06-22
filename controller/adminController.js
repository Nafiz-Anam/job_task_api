require("dotenv").config();
// const AdminModel = require("../model/adminModel");
const accessToken = require("../utilities/tokenmanager/token");
const enc_dec = require("../utilities/decryptor/decryptor");
const { generatePassword } = require("../utilities/helper/general_helper");
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
                f_name: req.bodyString("f_name"),
                l_name: req.bodyString("l_name"),
                email: req.bodyString("email"),
                mobile: req.bodyString("mobile"),
                designation: req.bodyString("designation"),
                password: hashPassword,
            };
            $inserted_id = await AdminModel.add(userData);
            res.status(200).json({
                status: true,
                message: "Admin registered successfully!",
            });
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },

    login: async (req, res) => {
        try {
            let foundUser = await AdminModel.select({
                email: req.bodyString("email"),
            });
            // console.log(foundUser);
            if (foundUser.length > 0) {
                let submittedPass = req.bodyString("password");
                let plainPassword = await enc_dec.decrypt(
                    foundUser[0].password
                );

                if (submittedPass === plainPassword) {
                    payload = {
                        id: enc_dec.encrypt(foundUser[0].id),
                        email: foundUser[0].email,
                        designation: foundUser[0].designation,
                        type: "admin",
                    };
                    const token = accessToken(payload);
                    let send_data = {
                        f_name: foundUser[0]?.f_name,
                        l_name: foundUser[0]?.l_name,
                        designation: foundUser[0].designation,
                        token: token,
                    };
                    res.status(200).json({
                        status: true,
                        data: send_data,
                        message: "Admin logged in successfully!",
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
                    error: "Wrong Email/Password!",
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },

    getAllAdmins: async (req, res) => {
        try {
            let limit = {
                perpage: 10,
                start: 0,
            };
            if (req.bodyString("perpage") && req.bodyString("page")) {
                perpage = parseInt(req.bodyString("perpage"));
                start = parseInt(req.bodyString("page"));
                limit.perpage = perpage;
                limit.start = (start - 1) * perpage;
            }
            let date = {};
            if (req.bodyString("from_date")) {
                date.from_date = req.bodyString("from_date");
            }
            if (req.bodyString("to_date")) {
                date.to_date = req.bodyString("to_date");
            }

            const totalCount = await AdminModel.get_count(date);
            console.log(totalCount);

            AdminModel.select_list(date, limit)
                .then(async (result) => {
                    let response = [];
                    for (val of result) {
                        temp = {
                            id: val.id ? enc_dec.encrypt(val.id) : "",
                            f_name: val.f_name ? val.f_name : "",
                            l_name: val.l_name ? val.l_name : "",
                            email: val.email ? val.email : "",
                            designation: val.designation ? val.designation : "",
                            mobile: val.mobile ? val.mobile : "",
                            created_at: val.created_at
                                ? moment(val.created_at).format("YYYY-MM-DD")
                                : "",
                        };
                        response.push(temp);
                    }
                    res.status(200).json({
                        status: true,
                        data: response,
                        message: "Admin list fetched successfully!",
                        total: totalCount,
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        status: false,
                        data: {},
                        error: "Server side error!",
                    });
                });
        } catch (error) {
            res.status(500).json({
                status: false,
                data: {},
                error: "Server side error!",
            });
        }
    },

    update: async (req, res) => {
        try {
            let user_id = enc_dec.decrypt(req.bodyString("user_id"));
            userData = {
                f_name: req.bodyString("f_name"),
                l_name: req.bodyString("l_name"),
                mobile: req.bodyString("mobile"),
                designation: req.bodyString("designation"),
            };
            await AdminModel.updateDetails({ id: user_id }, userData);
            res.status(200).json({
                status: true,
                message: "Admin details updated successfully!",
            });
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },

    delete: async (req, res) => {
        let user_id = enc_dec.decrypt(req.bodyString("user_id"));
        try {
            await AdminModel.delete({ id: user_id });
            res.status(200).json({
                status: true,
                message: "Admin deleted successfully!",
            });
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
};

module.exports = AuthController;
