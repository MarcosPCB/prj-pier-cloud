import { Router } from 'express'
import { router as consumerRouter} from '../../modules/consumer/consumer.route';

const routes = Router()

routes.use('/consumer', consumerRouter);

export default routes
