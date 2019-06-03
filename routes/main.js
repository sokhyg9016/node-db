var express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');

const { Room } = require('../models/');
const { Chat } = require('../models/');

var router = express.Router();

// /* GET Main page. */
router.get('/', isLoggedIn, async (req, res)=>
{
    const rooms = await Room.findAll({});
    const count = await Room.count({});
    res.render('main', { title: 'main - test_DB', user: req.user, rooms, count, roomError: req.flash('roomError') });
});

/* GET Room page. */
router.get('/room', isLoggedIn, async (req, res)=>
{
    const rooms = await Room.find({});
    res.render('room', { title: '채팅방 생성',  user: req.user, rooms, roomError: req.flash('roomError') });
});

router.post('/room',  isLoggedIn, async (req, res, next) => 
{
  const { title, max, password, user } = req.body;

  try 
  {
    const rooms = await Room.find({ where: { title } });
    if (rooms) 
    {
      req.flash('roomError', '이미 존재하는 채팅방입니다.');
      return res.redirect('/main/room');
    }
    const newRoom = await Room.create(
    {
      title,
      max,
      owner: req.session.color,
      password,
    });
    const io = req.app.get('io');
    // io.of('/main/room').emit('newRoom', title, max, password, user);
    res.redirect(`/main/room/${newRoom.id}?password=${req.body.password}`);
    // req.flash('roomError', '채팅방이 생성되었습니다.');
    // return res.redirect('/main/room');
  } 
  catch (error) 
  {
    console.log('에러!!!');
    console.error(error);
    return next(error);
  }
});


router.get('/room/:id', isLoggedIn, async (req, res, next) => 
{  
  try 
  {
    const room = await Room.find({ where: { id: req.params.id } });
    const io = req.app.get('io');

    // const room = await Room.find({ id: req.params.id });
    // const test =await Room.find({ id: 3 })

    // console.log("=================[query test :: test]======================");
    // console.log(test);
    // console.log("=================------------------======================");

    // console.log("=================[room information]======================");
    // console.log("req.params.id = " + req.params.id);
    // console.log("=================------------------======================");
    // console.log(room);
    // console.log(room.id);
    // console.log(room.title);
    // console.log(room.password);
    // console.log(room.owner);
    // console.log(req.session.color);

    if (!room) 
    {
      req.flash('roomError', '존재하지 않는 방입니다.');
      return res.redirect('/main');
    }
    if (room.password && room.password !== req.query.password) 
    {
      req.flash('roomError', '비밀번호가 틀렸습니다.');
      return res.redirect('/main');
    }
    const { rooms } = io.of('/main/chat').adapter;
    
    // console.log("rooms = " + rooms);
    // console.log("rooms[req.params.id] = " + rooms[req.params.id]);
    console.log("============================================================");
    if (rooms && rooms[req.params.id] && room.max <= rooms[req.params.id].length) 
    {
      req.flash('roomError', '허용 인원이 초과하였습니다.');
      return res.redirect('/main');
    }
    
    // const chats = await Chat.find(
    // {
    //    room: room.id,
    //    order: [['createdAt', 'DESC']], 
    // });

    return res.render('chat', 
    {
      room,
      title: room.title,
      chats: [],
      user: req.session.color,
    });
  } 
  catch (error) 
  {
    console.log('생성오류!!!');
    console.error(error);
    return next(error);
  }
});

router.delete('/room/:id', isLoggedIn, async (req, res, next) => 
{
  try 
  {
    await Room.destroy({ where: { id: req.params.id } });
    await Chat.destroy({ where: { room: req.params.id } });
    res.send('ok');

    const io = req.app.get('io').of('/main/room');
    setTimeout(() => 
    {
      io.emit('removeRoom', req.params.id);
    }, 2000);
  } 
  catch (error) 
  {
    console.error(error);
    next(error);
  }
});

// router.post('/room/:id/chat', async (req, res, next) => 
// {
//   try 
//   {
//     // const chat = new Chat({
//     //   room: req.params.id,
//     //   user: req.user,
//     //   chat: req.body.chat,
//     // });

//       const chat = await Chat.create(
//       {
//         room: req.params.id,
//         user: req.user,
//         chat: req.body.chat,
//       });
//     // await chat.save();
//     req.app.get('io').of('/main/chat').to(req.params.id).emit('chat', chat);
//     res.send('ok');
//   } 
//   catch (error) 
//   {
//     console.log('채팅 오류..');
//     console.error(error);
//     next(error);
//   }
// });

/* GET Chat page. */
router.get('/chat_test', isLoggedIn, (req, res)=>
{
    res.render('chat_test', { title: 'main - test_DB', user: req.user, loginError: req.flash('loginError') });
});


module.exports = router;

