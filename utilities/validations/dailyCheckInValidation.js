const Joi = require("joi").extend(require("@joi/date"));
// const ServerResponse = require("../response/ServerResponse");
// const StatusCode = require("../statuscode/index");
// const checkEmpty = require("./emptyChecker");
// const validate_mobile = require("./validate_mobile");
// const checkwithcolumn = require("./checkerwithcolumn");
// const checkifrecordexist = require("./checkifrecordexist");
// const enc_dec = require("../decryptor/decryptor");
// const multer = require("multer");
// const helpers = require("../helper/general_helper");
// const fs = require("fs");
// const encrypt_decrypt = require("../../utilities/decryptor/encrypt_decrypt");
// const { join } = require("path");
// const invModel = require("../../models/invoiceModel");
const moment = require("moment");

// .pattern(new RegExp(/^[A-Za-z]+[A-Za-z ]*$/))
const dailyCheckInValidation = {
    dailyCheckIn: async (req, res, next) => {
        const schema = Joi.object().keys({
            feeling: Joi.string()
                .valid(
                    "happy",
                    "loved",
                    "tired",
                    "confused",
                    "angry",
                    "shy",
                    "worried",
                    "sad"
                )
                .required()
                .messages({
                    "any.only":
                        "Feeling must be one of the allowed values: happy, loved, tired, confused, angry, shy, worried, or sad.",
                    "any.required": "Feeling is required.",
                    "string.empty": "Feeling should not be empty.",
                }),
            feeling_pain: Joi.boolean().required().messages({
                "any.only": "Feeling pain must be either true or false.",
                "any.required": "Feeling pain is required.",
            }),
            pain_area: Joi.string()
                .pattern(/^(l[1-9]|r[1-4])(,(l[1-9]|r[1-4]))*$/)
                .required()
                .messages({
                    "string.pattern.base":
                        "Pain area must be a comma-separated string containing values from l1 to l9 and r1 to r4.",
                    "any.required": "Pain area is required.",
                    "string.empty": "Pain area should not be empty.",
                }),
            pain_intensity: Joi.number()
                .integer()
                .min(1)
                .max(5)
                .required()
                .messages({
                    "number.base": "Pain intensity must be a number.",
                    "number.integer": "Pain intensity must be an integer.",
                    "number.min": "Pain intensity must be at least 1.",
                    "number.max": "Pain intensity must be at most 5.",
                    "any.required": "Pain intensity is required.",
                }),
            had_bleeding: Joi.boolean().required().messages({
                "any.only": "Had bleeding must be either true or false.",
                "any.required": "Had bleeding is required.",
            }),
            bleeding_weight: Joi.number()
                .integer()
                .min(1)
                .max(6)
                .required()
                .messages({
                    "number.base": "Bleeding weight must be a number.",
                    "number.integer": "Bleeding weight must be an integer.",
                    "number.min": "Bleeding weight must be at least 1.",
                    "number.max": "Bleeding weight cannot be greater than 6.",
                    "any.required": "Bleeding weight is required.",
                }),
            clots_weight: Joi.number()
                .integer()
                .min(1)
                .max(6)
                .required()
                .messages({
                    "number.base": "Clots weight must be a number.",
                    "number.integer": "Clots weight must be an integer.",
                    "number.min": "Clots weight cannot be less than 1.",
                    "number.max": "Clots weight cannot be greater than 6.",
                    "any.required": "Clots weight is required.",
                }),
            bleed_color: Joi.string()
                .valid("c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8")
                .required()
                .messages({
                    "any.only":
                        "Bleed color must be one of the allowed values: c1 to c8.",
                    "any.required": "Bleed color is required.",
                    "string.empty": "Bleed color should not be empty.",
                }),
            had_sex: Joi.boolean().required().messages({
                "boolean.base": "Had sex must be true or false.",
                "any.required": "Had sex is required.",
            }),
            was_sex_painful: Joi.boolean().required().messages({
                "boolean.base": "Was sex painful must be true or false.",
                "any.required": "Was sex painful is required.",
            }),
            heart_screen_date: Joi.date()
                .format("YYYY-MM-DD")
                .required()
                .messages({
                    "date.base": "Heart screen date must be a valid date.",
                    "date.format":
                        "Heart screen date must be in the format YYYY-MM-DD.",
                    "any.required": "Heart screen date is required.",
                }),
            heart_screen_test_names: Joi.array()
                .items(
                    Joi.string().valid(
                        "ecg",
                        "treadmill",
                        "heart_echo",
                        "heart_ct"
                    )
                )
                .allow(null)
                .messages({
                    "array.base":
                        "Heart screen test names must be an array of strings.",
                    "string.base": "Heart screen test names must be a string.",
                    "any.only":
                        "Heart screen test name must be one of 'ecg', 'treadmill', 'heart_echo', 'heart_ct'.",
                }),
            heart_screen_test_results: Joi.object({
                ecg: Joi.string().valid("normal", "abnormal").required(),
                treadmill: Joi.string().valid("normal", "abnormal").required(),
                heart_echo: Joi.string().valid("normal", "abnormal").required(),
                heart_ct: Joi.string().valid("normal", "abnormal").required(),
            }).messages({
                "object.base": "Heart screen test results must be an object.",
                "any.only":
                    "Heart screen test result must be either 'normal' or 'abnormal'.",
                "any.required": "All heart screen test results are required.",
            }),
            heart_screen_test_ct_result: Joi.object({
                calcium_score: Joi.number().positive().required(),
                heart_blockage: Joi.boolean().required(),
            })
                .or("calcium_score", "heart_blockage")
                .messages({
                    "object.base":
                        "Heart screen test CT result must be an object.",
                    "number.positive":
                        "Calcium score must be a positive number.",
                    "boolean.base":
                        "Heart blockage result must be either true or false.",
                    "any.required": "Heart screen test CT result is required.",
                    "object.missing":
                        "At least one of calcium score or heart blockage is required.",
                }),
            add_appointment: Joi.boolean().required().messages({
                "boolean.base":
                    "Add appointment value must be either true or false.",
                "any.required": "Add appointment field is required.",
            }),
            blood_test_date: Joi.date()
                .format("YYYY-MM-DD")
                .required()
                .messages({
                    "date.base": "Blood test date must be a valid date.",
                    "date.format":
                        "Blood test date must be in YYYY-MM-DD format.",
                    "any.required": "Blood test date is required.",
                }),
            blood_test_result: Joi.object({
                blood_sugar: Joi.number().allow(null).messages({
                    "number.base": "Blood sugar value must be a number.",
                }),
                hba1c: Joi.number().allow(null).messages({
                    "number.base": "HbA1c value must be a number.",
                }),
                total_cholesterol: Joi.number().allow(null).messages({
                    "number.base": "Total cholesterol value must be a number.",
                }),
                ldl_cholesterol: Joi.number().allow(null).messages({
                    "number.base": "LDL cholesterol value must be a number.",
                }),
                hdl_cholesterol: Joi.number().allow(null).messages({
                    "number.base": "HDL cholesterol value must be a number.",
                }),
                triglycerides: Joi.number().allow(null).messages({
                    "number.base": "Triglycerides value must be a number.",
                }),
                chylomicrons: Joi.number().allow(null).messages({
                    "number.base": "Chylomicrons value must be a number.",
                }),
            })
                .required()
                .messages({
                    "object.base": "Blood test result must be an object.",
                    "any.required": "Blood test result is required.",
                }),
            daily_symptoms: Joi.array()
                .items(
                    Joi.string().valid(
                        "chest_pain",
                        "irregular_heart_beat",
                        "breathlessness",
                        "feeling_faint",
                        "unusual_fatigue",
                        "unusual_sweating",
                        "nausea"
                    )
                )
                .unique()
                .allow(null)
                .messages({
                    "array.base": "Daily symptoms must be an array of strings.",
                    "string.valid":
                        "Daily symptoms must be one of the valid options.",
                    "array.unique":
                        "Daily symptoms must not contain duplicate values.",
                    "any.only":
                        "Daily symptoms must be null or one or more of the valid options.",
                }),
            weekly_blood_pressure: Joi.string()
                .pattern(/^\d{1,3}\/\d{1,3}$/)
                .allow(null)
                .messages({
                    "string.base": "Weekly blood pressure must be a string.",
                    "string.pattern.base":
                        "Weekly blood pressure must be in the format of '90/100'.",
                    "any.only":
                        "Weekly blood pressure must be a string in the format of '90/100' or null.",
                }),
            had_exercise: Joi.boolean().messages({
                "boolean.base": "Exercise status must be true or false.",
            }),
        });

        try {
            const result = schema.validate(req.body);
            if (result.error) {
                res.status(503).json({
                    status: false,
                    error: result.error.message,
                });
            } else {
                next();
            }
        } catch (error) {
            res.status(503).json({
                status: false,
                error: "Server side error!",
            });
        }
    },
};

module.exports = dailyCheckInValidation;
