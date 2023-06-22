const Joi = require("joi");
const moment = require("moment");
const helpers = require("../helper/general_helper");


const authValidation = {
    register: async (req, res, next) => {
        const schema = Joi.object().keys({
            full_name: Joi.string()
                .min(2)
                .trim()
                .required()
                .pattern(/^[A-Za-z]+(?:[ ]?[A-Za-z]+)*$/)
                .messages({
                    "string.pattern.base":
                        "Full name should only contain alphabets and spaces.",
                    "any.required": "Full name is required.",
                    "string.empty": "Full name should not be empty.",
                }),
            email: Joi.string().email().required().messages({
                "string.email": "Invalid email format.",
                "any.required": "Email is required.",
                "string.empty": "Email should not be empty.",
            }),
            position: Joi.string()
                .valid("student", "teacher")
                .required()
                .messages({
                    "any.only":
                        "Position must be either 'student' or 'teacher'.",
                    "any.required": "Position is required.",
                    "string.empty": "Position should not be empty.",
                }),
            work_time: Joi.string()
                .valid("part_time", "full_time")
                .when("position", {
                    is: "teacher",
                    then: Joi.required().messages({
                        "any.required": "Work time is required for teachers.",
                    }),
                    otherwise: Joi.optional().allow(""),
                }),
            institution_name: Joi.string().trim().required().messages({
                "any.required": "Institution name is required.",
                "string.empty": "Institution name should not be empty.",
            }),
            education_level: Joi.string()
                .trim()
                .when("position", {
                    is: "student",
                    then: Joi.required().messages({
                        "any.required":
                            "Education level is required for students.",
                    }),
                    otherwise: Joi.optional().allow(""),
                }),
            password: Joi.string().min(6).max(16).required().messages({
                "any.required": "Password is required.",
                "string.empty": "Password should not be empty.",
                "string.min":
                    "Password must be at least {#limit} characters long.",
                "string.max":
                    "Password cannot be longer than {#limit} characters.",
            }),
            confirm_password: Joi.string()
                .valid(Joi.ref("password"))
                .required()
                .messages({
                    "any.only": "Passwords do not match.",
                    "any.required": "Confirm password is required.",
                    "string.empty": "Confirm password should not be empty.",
                }),
        });

        try {
            const result = schema.validate(req.body);
            const isEmailExist = await helpers.check_if_email_exist(
                req.bodyString("email"),
                "users"
            );

            if (result.error) {
                res.status(500).json({
                    status: false,
                    error: result.error.message,
                });
            } else if (isEmailExist) {
                res.status(500).json({
                    status: false,
                    error: "Email is already registered.",
                });
            } else {
                next();
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                error: "Server side error!",
            });
        }
    },

    login: async (req, res, next) => {
        const schema = Joi.object().keys({
            email: Joi.string().email().required().messages({
                "string.email": "Invalid email format.",
                "any.required": "Email is required.",
                "string.empty": "Email should not be empty.",
            }),
            password: Joi.string().min(6).max(16).required().messages({
                "any.required": "Password is required.",
                "string.empty": "Password should not be empty.",
                "string.min":
                    "Password must be at least {#limit} characters long.",
                "string.max":
                    "Password cannot be longer than {#limit} characters.",
            }),
        });

        try {
            const result = schema.validate(req.body);
            if (result.error) {
                res.status(500).json({
                    status: false,
                    error: result.error.message,
                });
            } else {
                next();
            }
        } catch (error) {
            res.status(500).json({
                status: false,
                error: "Server side error!",
            });
        }
    },
};

module.exports = authValidation;
