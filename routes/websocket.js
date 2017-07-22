import users from '../controller/users';
import clinicController from '../controller/clinics';
import queueController from '../controller/queues';

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

})
}