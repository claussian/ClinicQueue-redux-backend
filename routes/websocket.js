import users from '../controller/users';
import clinicController from '../controller/clinics';
import queueController from '../controller/queues';
import subscribeController from '../controller/subscribes';

// io     -- Use that broadcast to all connected user
// socket -- Use socket to send to the user that made the connection/emit that particular event

module.exports = (io) => {

  io.on('connection', (socket) => {
    console.log('current user', socket.request.user);
    //when not logged in, socket.request.user is { logged_in: false }


    // Listen in to socket event 'getAllQueues' within io connection and execute a callback function
    // Callback function accepts data emitted from frontend as argument and executes controller
    // Controller accepts two arguments: callback function and data
    socket.on('get all queue on app initialise', () => {
      // accessing controller function
      queueController.getAllQueue((queues) => {
        socket.emit('get all queue from backend', queues);
      });
    });

    socket.on('getAllClinic', () => {
      clinicController.getAllClinic((clinic)=> {
        socket.emit('allClinic', clinic);
      })
    })

    socket.on('latestQueueForAllUser', (queue) => {
      console.log("websocket receives new queue, sending to others", queue);
      socket.broadcast.emit('queueForAllUser', queue);
    })

    socket.on('new subscribe to back end', (newSubscribe) => {
      console.log("websocket reached. new subscribe is", newSubscribe)
      subscribeController.postNewSubscribe(socket.request.user, newSubscribe, (subscribeSaved) => {
        io.emit('subscription successful', subscribeSaved)
      })
    })

    socket.on('delete queue to back end', (queueToBeDeleted) => {
      console.log("web sockect for delete queue reached", queueToBeDeleted)
      queueController.deleteQueue(socket.request.user, queueToBeDeleted, (queueInfoToFrontEnd) => {
        io.emit('delete queue done', queueInfoToFrontEnd)
      })
    })

    socket.on('delete subscribe to back end', (subscribeInfo) => {
      console.log('websocket for delete subscribe reached', subscribeInfo)
      subscribeController.deleteSubscribe(socket.request.user, subscribeInfo, (subscribeInfoToFrontEnd) => {
        io.emit('delete subscribe done', subscribeInfoToFrontEnd)
      })
    })

  })
}
