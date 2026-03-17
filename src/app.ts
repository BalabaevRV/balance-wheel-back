const express = require('express')
const cors = require('cors');
import authRouter from '@/routers/auth'
const app = express()
const port = 3000

app.use(cors());

app.get('/', (req: any, res: any) => {
  res.send('Hello World!')
})

app.use(authRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})