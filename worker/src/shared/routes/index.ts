import { Router } from 'express'
import { router as consumerRouter} from '../../modules/consumer/consumer.route';
import { router as sellerRouter } from '../../modules/seller/seller.route';

const routes = Router()

routes.use('/consumer', consumerRouter);
routes.use('/seller', sellerRouter);

export default routes
