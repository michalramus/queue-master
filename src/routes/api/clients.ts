import express, { Express, Request, Response } from "express";
import { addClient, getClients } from "../../controllers/clientsController";

export const router = express.Router();

router
    .route("/")
    .get(getClients)

    .post(addClient);
// .put(employeesController.updateEmployee)
// .delete(employeesController.deleteEmployee);

// router.route('/:id')
//     .get(employeesController.getEmployee);

module.exports = router;
