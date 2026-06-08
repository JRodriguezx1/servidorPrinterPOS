//import "module-alias/register"; //en modo dev comentar esta linea.
import { Server } from "@server/httpserver";
import { RouterApp } from "@routes/router";
import "@config/mongodb";
import dotenv from "dotenv";
import { brokerClient } from "@dependencies/dependencies";

dotenv.config();

      
(async  ()=>{
    new Server(3101, RouterApp.routes).start();
    brokerClient.connect();
})();