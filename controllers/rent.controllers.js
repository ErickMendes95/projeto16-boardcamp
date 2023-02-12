import { db } from "../database/database.js";
import dayjs from "dayjs"

export async function buscarAlugueis(req, res){
    
    try {
        const alugueis = await db.query(`
        SELECT 
            rentals.*, 
            customers.id AS customer_id, 
            customers.name AS customer_name, 
            games.id AS game_id, 
            games.name AS game_name        
        FROM rentals 
        INNER JOIN customers ON rentals."customerId"= customers.id
        INNER JOIN games ON rentals."gameId"= games.id
        `);

        return res.send(alugueis.rows);

    } catch (err) {
        return res.status(500).send(console.log(err.message));
    };
};

export async function inserirAluguel(req, res){

    const aluguel = req.body;
    
    try {

        if(aluguel.daysRented <= 0){
            console.log("oi")
            return res.sendStatus(400)
        }

        const customerExist = await db.query(`SELECT * FROM customers WHERE id= '${aluguel.customerId}'`)
        
        if(customerExist.rowCount === 0){
            return res.sendStatus(400)
        }

        const gameExist = await db.query(`SELECT * FROM games WHERE id= ${aluguel.gameId}`)
        
        if(gameExist.rowCount === 0){
            return res.sendStatus(400)
        }

        const originalPrice = (gameExist.rows[0].pricePerDay)*(aluguel.daysRented)
        const rentDate = dayjs().format("YYYY-MM-DD");
        
        const gameDisponivel = await db.query(`SELECT * FROM rentals
            WHERE "gameId"= ${gameExist.rows[0].id} AND "returnDate"= null
        `);

        if(gameDisponivel.rowCount === gameExist.rows[0].stockTotal){
            return res.sendStatus(400)
        }

        await db.query(`INSERT INTO rentals
        ("customerId", "gameId", "daysRented", "rentDate", "returnDate", "originalPrice", "delayFee")
        VALUES
        (${aluguel.customerId},${aluguel.gameId}, ${aluguel.daysRented}, '${rentDate}', NULL,${originalPrice}, NULL)
        
        `)
        
        return res.sendStatus(201)
        
    } catch (error) {
        return res.status(500).send(console.log(error.message));
    }

};

export async function finalizarAluguel(req, res){
    const cliente = req.body;
    
    try {
        
        
    } catch (error) {
        return res.status(500).send(console.log(error.message));
    }
}

export async function deletarAluguel(req,res){

    const cliente = req.body;

    try {


    }  catch (error) {
        return res.status(500).send(console.log(error.message));
    }
}