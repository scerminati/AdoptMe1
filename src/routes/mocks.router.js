import { Router } from "express";
import mocksController from "../controllers/mocks.controller.js";
const router = Router();

router.get("/mockingpets/:q", mocksController.generatePets);
router.get("/mockingusers/:q", mocksController.generateUsers);

router.post("/generateData", mocksController.generateData);

export default router;
