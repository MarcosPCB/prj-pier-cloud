import { Router } from 'express'
import { router as messagerRouter} from '../../modules/messager/messager.route';

const routes = Router()

routes.use('/messager', messagerRouter);

export default routes
