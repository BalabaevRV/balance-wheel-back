import { createAllTables } from './models/CreateTables'
import authRouter from '@/routers/auth'


const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

app.get('/', (req: any, res: any) => {
  res.send('Hello World!')
})

app.use(authRouter)
createAllTables()
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})