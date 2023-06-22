require("dotenv").config();
const CourseModel = require("../model/courseModel");
const accessToken = require("../utilities/tokenmanager/token");
const enc_dec = require("../utilities/decryptor/decryptor");
const moment = require("moment");
const { get_user_id_by_email } = require("../utilities/helper/general_helper");
const helpers = require("../utilities/helper/general_helper");
let static_url = process.env.STATIC_FILE_URL;

var DashboardController = {
    list: async (req, res) => {
        try {
            let std_statics = [
                {
                    id: 1,
                    title: "course_completed",
                    total: 55,
                    progress: 70,
                },
                {
                    id: 2,
                    title: "certificate_earned",
                    total: 20,
                    progress: 20,
                },
                {
                    id: 3,
                    title: "course_in_progress",
                    total: 25,
                    progress: 30,
                },
                {
                    id: 4,
                    title: "total_course",
                    total: 86,
                    progress: "",
                },
            ];

            let tch_statics = [
                {
                    id: 1,
                    title: "new_course_sale",
                    total: 1560,
                    progress: 70,
                },
                {
                    id: 2,
                    title: "total_student",
                    total: 5900,
                    progress: 20,
                },
                {
                    id: 3,
                    title: "total_course",
                    total: 500,
                    progress: 30,
                },
                {
                    id: 4,
                    title: "total_revenue",
                    total: 25365,
                    progress: "",
                },
            ];

            let statics;
            if (req.user.position === "student") {
                statics = std_statics;
            } else if (req.user.position === "teacher") {
                statics = tch_statics;
            }

            res.status(200).json({
                status: true,
                statics,
                message: "Statics fetched successfully!",
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                message: "Server side error! Try again.",
            });
        }
    },

    progress: async (req, res) => {
        try {
            let time_period = req.bodyString("time_period");
            let data = await helpers.generateCourseProgressData(time_period);
            // console.log("data", data);
            // console.log(JSON.stringify(data, null, 2));

            res.status(200).json({
                status: true,
                progress: data,
                message: "Statics fetched successfully!",
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                message: "Server side error! Try again.",
            });
        }
    },
};

module.exports = DashboardController;
