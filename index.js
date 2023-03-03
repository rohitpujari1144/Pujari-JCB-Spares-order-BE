const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')
const mongodb = require('mongodb')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
const dbUrl = 'mongodb+srv://rohitpujari:rohitkaranpujari@cluster0.inae9ih.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(dbUrl)
const port = 7000

// getting all users order information
app.get('/', async (req, res) => {
    const client = await MongoClient.connect(dbUrl)
    try {
        const db = await client.db('Pujari_JCB_Spares')
        let orders = await db.collection('Orders').find().toArray()
        res.status(200).send(orders)
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
}) 

// booking new order
app.post('/newOrder', async (req, res) => {
    const client = await MongoClient.connect(dbUrl)
    try {
        if (req.body.custUsername && req.body.prodName && req.body.prodQuantity && req.body.orderedDate && req.body.deliveryDate && req.body.prodPrice && req.body.totalPrice && req.body.paymentMode)  {
            const db = await client.db('Pujari_JCB_Spares')
            await db.collection('Orders').insertOne(req.body)
            res.status(201).send({ message: 'Order booked successfully', data: req.body })    
        }
        else {
            res.status(400).send({ message: 'customer username, prodName, prodQuantity, orderedDate, deliveryDate, prodPrice, totalPrice,  paymentMode are mandatory' })
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

// getting orders info of particular user
app.get('/getOrder/:username', async (req, res) => {
    const client = await MongoClient.connect(dbUrl)
    try {
        if(req.params.username){
            const db = await client.db('Pujari_JCB_Spares')
            let order = await db.collection('Orders').find({custUsername:req.params.username}).toArray()
            if(order.length){
                res.status(200).send(order)
            }
            else{
                res.status(404).send({message:`no order data found with user ${req.params.username}`})
            }
        }
        else{
            res.status(400).send({message:'Please enter username to get order info'})
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
}) 

app.listen(port, () => { console.log(`App listening on ${port}`) })