import { Router } from 'express'
import Controller from './Controller';

const router = Router()
const controller = new Controller();

// POST
router.post('/subscribe', controller.subscribeQueue);

export { router };
