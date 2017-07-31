import users from '../controller/users';
import clinicController from '../controller/clinics';
import queueController from '../controller/queues';
import subscribeController from '../controller/subscribes';

/***********FROM JENS****************/
// io     -- Use that broadcast to all connected user
// socket -- Use socket to send to the user that made the connection/emit that particular event
/***********DO NOT DELETE BEFORE FINAL SUBMITION****************/

module.exports = (io) => {

io.on('connection', (socket) => {
  console.log('current user', socket.request.user);
  //when not logged in, socket.request.user is { logged_in: false }


  // Listen in to socket event 'getAllQueues' within io connection and execute an anonymous function
  // Anonymous function accepts data emitted from frontend as argument and executes controller
  // Controller accepts two arguments: callback and data
  socket.on('getAllQueues', (data) => {
    console.log('data', data)
  //   queueController.getAllQueue(data, (queues) => {
  //     io.emit('allQueues', queues);
  //   }
  // );
  });

  socket.on('getAllClinic', () => {
    clinicController.getAllClinic((clinic)=> {
      io.emit('allClinic', clinic);
    })
  })

  socket.on('latestQueueForAllUser', (queue) => {
    console.log("websocket receives new queue, sending to others", queue);
    socket.broadcast.emit('queueForAllUser', queue);
  })

  socket.on('new subscribe to back end', (newSubscribe) => {
    console.log("websocket reached")
    console.log(newSubscribe)
    subscribeController.postNewSubscribe(socket.request.user, newSubscribe, (subscribeSaved) => {
      io.emit('subscription successful', subscribeSaved)
    })
  })

  socket.on('delete queue to back end', (queueToBeDeleted) => {
    console.log("web sockect for delete queue reached")
    console.log(queueToBeDeleted)
    queueController.deleteQueue(socket.request.user, queueToBeDeleted, (queueInfoToFrontEnd) => {
      io.emit('delete queue done', queueInfoToFrontEnd)
    })
  })

  socket.on('delete subscribe to back end', (subscribeInfo) => {
    console.log('websocket for delete subscribe reached')
    console.log(subscribeInfo)
    subscribeController.deleteSubscribe(socket.request.user, subscribeInfo, (subscribeInfoToFrontEnd) => {
      io.emit('delete subscribe done', subscribeInfoToFrontEnd)
    })
  })

})
}
