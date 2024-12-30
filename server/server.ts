import http from 'http'
import { Server } from 'socket.io'
import app from './src/app'

const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: '*' }, // Adjust CORS policy as needed
})

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('sendMessage', (data) => {
    io.emit('receiveMessage', data) // Broadcast the message to all clients
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

const PORT = 5000
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
