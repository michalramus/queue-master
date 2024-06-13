import express, { Express, Request, Response } from "express";
import { addClient, getClients, setClientAsInService } from "../../controllers/clientsController";

export const router = express.Router();

router
    .route("/")
    .get(getClients)

    .post(addClient)
    .put(setClientAsInService);
// .delete(employeesController.deleteEmployee);

// router.route('/:id')
//     .get(employeesController.getEmployee);

module.exports = router;
