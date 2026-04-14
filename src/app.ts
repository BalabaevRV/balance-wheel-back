import authRouter from '@/modules/users/auth.router'
import userRouter from '@/modules/users/user.router'
import wheelRouter from '@/modules/wheel/wheel.router'


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
app.use(userRouter)
app.use(wheelRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

export default app