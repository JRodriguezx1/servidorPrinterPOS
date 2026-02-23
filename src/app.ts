import "module-alias/register"; //en modo dev comentar esta linea.
import { Server } from "@server/server";
import { RouterApp } from "@routes/router";
import "@config/mongodb";
import dotenv from "dotenv";

dotenv.config();

      
(async  ()=>{
    new Server(3100, RouterApp.routes).start();
})();