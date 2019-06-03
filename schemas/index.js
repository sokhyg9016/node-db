const mongoose = require('mongoose');

const { MONGO_ID, MONGO_PASSWORD, NODE_ENV} = process.env;
const MONGO_URL = `mongodb://${MONGO_ID}:${MONGO_PASSWORD}@localhost:27017/admin`;

module.exports = () =>
{
    const connect = () => 
    {
        if(process.env.NODE_ENV !== 'production')
        {
            mongoose.set('debug', true);
        }
        mongoose.connect(MONGO_URL,
        {
            dbName: 'test_DB'
        },
        (error)=>
        {
            if(error)
            {
                console.log('connection error :: ', error);
            }
            else
            {
                console.log('connection success!');
            }
        });
    };
    connect();
    mongoose.connection.on('error', (error)=>
    {
        console.log('connection error :: ', error);
    });
    mongoose.connection.on('disconnecte', ()=>
    {
        console.log('connection error ::  disconnected --> connect again..');
        connect();
    });
    require('./user');
    require('./room');
    require('./chat');
};