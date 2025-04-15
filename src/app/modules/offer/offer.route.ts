import express from 'express';
import { OfferController } from './offer.controller';
const router = express.Router();
router.get('/', OfferController.getAvailableofferItems);
export const OfferRoutes = router;
