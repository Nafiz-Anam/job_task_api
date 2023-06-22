require("dotenv").config();
const UserModel = require("../model/userModel");
const accessToken = require("../utilities/tokenmanager/token");
const enc_dec = require("../utilities/decryptor/decryptor");
const moment = require("moment");
const { get_user_id_by_email } = require("../utilities/helper/general_helper");

var UserController = {
    getAllUsers: async (req, res) => {
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

            const totalCount = await UserModel.get_count(date);
            console.log(totalCount);

            UserModel.select_list(date, limit)
                .then(async (result) => {
                    let response = [];
                    for (val of result) {
                        let f_name = val?.full_name.split(" ")[0];
                        let l_name = val?.full_name.split(" ")[1];
                        temp = {
                            id: val?.id ? enc_dec.encrypt(val.id) : "",
                            full_name: val?.full_name ? val.full_name : "",
                            f_name: f_name ? f_name : "",
                            l_name: l_name ? l_name : "",
                            email: val?.email ? val.email : "",
                            created_at: val.created_at
                                ? moment(val.created_at).format("YYYY-MM-DD")
                                : "",
                        };
                        response.push(temp);
                    }
                    res.status(200).json({
                        status: true,
                        data: response,
                        message: "Users fetched successfully!",
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
            console.log(error);
            res.status(500).json({
                status: false,
                data: {},
                error: "Server side error!",
            });
        }
    },

    delete: async (req, res) => {
        let user_id = enc_dec.decrypt(req.bodyString("user_id"));
        try {
            await UserModel.delete({ id: user_id });
            res.status(200).json({
                status: true,
                message: "User deleted successfully!",
            });
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },

    forgot_password: async (req, res) => {
        try {
            let newPass = req.bodyString("new_password");
            let hashPassword = await enc_dec.encrypt(newPass);
            let insData = {
                password: hashPassword,
            };
            await UserModel.updateDetails(
                { email: req.bodyString("email") },
                insData
            );
            res.status(200).json({
                status: true,
                message: "Password changed successfully!",
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                error: "Server side error!",
            });
        }
    },
};

module.exports = UserController;