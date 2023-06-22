require("dotenv").config();
const env = process.env.ENVIRONMENT;
const config = require("../config/config.json")[env];
const pool = require("../config/database");
const dbtable = config.table_prefix + "courses";
const comment_table = config.table_prefix + "comments";
const helpers = require("../utilities/helper/general_helper");

var dbModel = {
    add: async (data) => {
        console.log("data => ", data);
        let qb = await pool.get_connection();
        let response = await qb.returning("id").insert(dbtable, data);
        qb.release();
        return response;
    },
    add_comment: async (data) => {
        console.log("data => ", data);
        let qb = await pool.get_connection();
        let response = await qb.returning("id").insert(comment_table, data);
        qb.release();
        return response;
    },
    updateDetails: async (condition, data) => {
        let qb = await pool.get_connection();
        let response = await qb.set(data).where(condition).update(dbtable);
        qb.release();
        return response;
    },
    delete: async (condition) => {
        let qb = await pool.get_connection();
        let response = await qb.where(condition).delete(dbtable);
        qb.release();
        console.log(qb.last_query());
        return response;
    },

    // select_limit: async (condition, limit) => {
    //     let qb = await pool.get_connection();
    //     let response = await qb
    //         .select("*")
    //         .where(condition)
    //         .order_by("designation", "asc")
    //         .limit(limit.perpage, limit.start)
    //         .get(dbtable);
    //     qb.release();
    //     return response;
    // },

    select: async (condition) => {
        let qb = await pool.get_connection();
        let response = await qb.select("*").where(condition).get(dbtable);
        qb.release();
        return response;
    },

    select_list: async (limit) => {
        let qb = await pool.get_connection();

        let query =
            "select * from " +
            dbtable +
            " ORDER BY id DESC LIMIT " +
            limit.perpage +
            " OFFSET " +
            limit.start;

        console.log("query => ", query);
        let response = await qb.query(query);
        qb.release();
        return response;
    },

    get_count: async () => {
        let qb = await pool.get_connection();
        let query = "select count(*) as total from " + dbtable;
        console.log("query => ", query);
        let response = await qb.query(query);
        qb.release();
        return response[0]?.total;
    },

    // selectSpecific: async (selection, condition) => {
    //     let qb = await pool.get_connection();
    //     let response = await qb.select(selection).where(condition).get(dbtable);
    //     qb.release();
    //     return response;
    // },
    // selectOne: async (selection, condition) => {
    //     let qb = await pool.get_connection();
    //     let response = await qb.select(selection).where(condition).get(dbtable);
    //     qb.release();
    //     return response[0];
    // },
    // selectUserDetails: async (condition) => {
    //     let qb = await pool.get_connection();
    //     let response = await qb.select(selection).where(condition).get(dbtable);
    //     qb.release();
    //     return response[0];
    // },
};

module.exports = dbModel;
