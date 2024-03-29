const { request, response } = require('express');
const { env_pool } = require('../config');
const pool = env_pool;

const post_intake = async (request, response, next) => {
    const { user_id, food_name, amount } = request.body;
    const now = new Date();
    try {
        const result_id = await pool.query('SELECT food_id FROM food_info WHERE food_name = $1', [food_name]);
        const food_id = result_id.rows[0].food_id;
        pool.query('INSERT INTO intake_logs (user_id,food_id,intake_date,amount) VALUES ($1, $2, $3, $4) RETURNING *', [user_id, food_id, now, amount], (error, result) => {
            if (error) {
                next(error);
            } else {
                response.status(201).send(`User added with intake: ${result.rows[0].food_id}`);
            }
        });
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}
// 未完成
// const get_daily_intake_nutrition = async (request, response, next) => {
//     try {
//         const now = new Date();
//         const get_daily_intake_nutrition_result =await pool.query('SELECT SUM(calories) AS total_calories, SUM(protein) AS total_protein, SUM(fat) AS total_fat, SUM(carbohydrate) AS total_carbohydrate FROM food_info JOIN intake_logs ON food_info.food_id = intake_logs.food_id WHERE intake_date = $1 GROUP BY intake_date',[now]);
//         response.status(200).send(get_daily_intake_nutrition_result.rows);
//     } catch(error) {
//         console.error(error);
//         next(error);
//     }
// }


const get_daily_intake_list = async (request, response, next) => {
    try {
        const now = new Date();
        const get_daily_intake_list_result = await pool.query('SELECT food_name,calories,fat,protein,carbohydrate,amount,intake_date FROM food_info JOIN intake_logs ON food_info.food_id = intake_logs.food_id WHERE intake_date = $1',[now]);

        const convertedList = get_daily_intake_list_result.rows.map(intake => ({
            ...intake,
            calories: (intake.calories * intake.amount / 100).toFixed(2),
            fat: (intake.fat * intake.amount / 100).toFixed(2),
            protein: (intake.protein * intake.amount / 100).toFixed(2),
            carbohydrate: (intake.carbohydrate * intake.amount / 100).toFixed(2),
        }));
        response.status(200).send(convertedList);

    } catch(error) {
        console.error(error);
        next(error);
    }
}



const get_daily_intake_sum = async (request, response, next) => {
    try {
       

    } catch(error) {
        console.error(error);
        next(error);
    }
}





module.exports = {
    // get_daily_intake_nutrition,
    post_intake,
    get_daily_intake_list
}




