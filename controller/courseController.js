require("dotenv").config();
const CourseModel = require("../model/courseModel");
const accessToken = require("../utilities/tokenmanager/token");
const enc_dec = require("../utilities/decryptor/decryptor");
const moment = require("moment");
const { get_user_id_by_email } = require("../utilities/helper/general_helper");
const helpers = require("../utilities/helper/general_helper");
let static_url = process.env.STATIC_FILE_URL;

var UserController = {
    create: async (req, res) => {
        try {
            let course_data = {
                teacher_id: req.user.id,
                lesson_name: req.bodyString("lesson_name"),
                description: req.bodyString("description"),
                price: req.bodyString("price"),
                tags: JSON.stringify(req.body.tags),
                main_course_file: static_url + req.all_files.main_course_file,
                thumbnail_file: static_url + req.all_files.thumbnail_file,
                introduction_file: static_url + req.all_files.introduction_file,
            };
            await CourseModel.add(course_data)
                .then((result) => {
                    res.status(200).json({
                        status: true,
                        message: "Course created successfully!",
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        status: false,
                        message: "Unable to create course. Try again!",
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

    list: async (req, res) => {
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

            let total_count = await CourseModel.get_count();

            await CourseModel.select_list(limit)
                .then((result) => {
                    let send_res = [];
                    for (let val of result) {
                        let course_data = {
                            id: enc_dec.encrypt(val.id),
                            teacher_id: enc_dec.encrypt(val.teacher_id),
                            lesson_name: val.lesson_name,
                            description: val.description,
                            price: val.price,
                            tags: JSON.parse(val.tags),
                            main_course_file: val.main_course_file,
                            thumbnail_file: val.thumbnail_file,
                            introduction_file: val.introduction_file,
                        };
                        send_res.push(course_data);
                    }

                    res.status(200).json({
                        status: true,
                        send_res,
                        total_count,
                        message: "Course list fetched successfully!",
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        status: false,
                        message: "Unable to fetch list. Try again!",
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
            let course_id = enc_dec.decrypt(req.bodyString("course_id"));

            await CourseModel.select({ id: course_id })
                .then(async (result) => {
                    let send_res;
                    for (let val of result) {
                        let teacher_info = await helpers.get_data_list(
                            "*",
                            "users",
                            { id: val.teacher_id }
                        );
                        let comment_info = await helpers.get_data_list(
                            "*",
                            "comments",
                            { course_id: course_id }
                        );

                        let cmt_arr = [];
                        for (let val of comment_info) {

                            let user_info = await helpers.get_data_list(
                                "id,full_name",
                                "users",
                                { id: val?.user_id }
                            );

                            let temp = {
                                comment_id: val?.id
                                    ? enc_dec.encrypt(val?.id)
                                    : "",
                                course_id: val?.course_id
                                    ? enc_dec.encrypt(val?.course_id)
                                    : "",
                                user_info: {
                                    user_id: enc_dec.encrypt(user_info[0]?.id),
                                    full_name: user_info[0]?.full_name,
                                },
                                comment: val?.comment ? val?.comment : "",
                                created_at: val?.created_at
                                    ? val?.created_at
                                    : "",
                            };
                            cmt_arr.push(temp);
                        }

                        let course_data = {
                            course_id: enc_dec.encrypt(val.id),
                            lesson_name: val.lesson_name,
                            description: val.description,
                            price: val.price,
                            tags: JSON.parse(val.tags),
                            main_course_file: val.main_course_file,
                            thumbnail_file: val.thumbnail_file,
                            introduction_file: val.introduction_file,
                            teacher_info: {
                                teacher_id: enc_dec.encrypt(val.teacher_id),
                                full_name: teacher_info[0].full_name,
                                institution_name:
                                    teacher_info[0].institution_name,
                            },
                            comment_info: cmt_arr,
                        };
                        send_res = course_data;
                    }

                    res.status(200).json({
                        status: true,
                        send_res,
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

    review_add: async (req, res) => {
        let user_id = req.user.id;
        try {
            let review_data = {
                user_id: user_id,
                course_id: enc_dec.decrypt(req.bodyString("course_id")),
                comment: req.bodyString("comment"),
            };
            await CourseModel.add_comment(review_data)
                .then((result) => {
                    res.status(200).json({
                        status: true,
                        message: "Review added successfully!",
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        status: false,
                        message: "Unable to create review. Try again!",
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
};

module.exports = UserController;
