import express, { Express, Request, Response } from "express";
import { addClient } from "../../controllers/clientsController";

export const router = express.Router();

router
    .route("/")
    // .get(employeesController.getAllEmployees)

    .post(addClient);
// .put(employeesController.updateEmployee)
// .delete(employeesController.deleteEmployee);

// router.route('/:id')
//     .get(employeesController.getEmployee);

module.exports = router;
