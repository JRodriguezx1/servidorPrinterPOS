import { cuentaRepository } from "@repositories/cuentaRepository";
import { cuentaService } from "@services/cuentaService";
import { BrokerClient } from "@websocket/websocketClient";
import { ICuentaRepository, ICuentaService } from "types/CuentasTypes";

const cuentaRepo:ICuentaRepository = new cuentaRepository;
export const instanceCuentaService:ICuentaService = new cuentaService(cuentaRepo);
export const brokerClient = new BrokerClient(instanceCuentaService);