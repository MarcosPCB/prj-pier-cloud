import { Router } from 'express'
import Controller from './Controller';

const router = Router()
const controller = new Controller();

// GET
router.get('/download', controller.downloadCSV);

export { router };
