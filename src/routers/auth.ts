const router = express.Router()
import { loginUser, logoutUser, signupUser } from '@/controllers/auth'

router.post('login', loginUser)
router.post('logout', logoutUser)
router.post('signup', signupUser)

export default router