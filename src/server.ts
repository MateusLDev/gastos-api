import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";

import { initializeFirebase } from "./lib/firebase";

import { login } from './routes/login'
import { register } from './routes/register'
import { logout } from './routes/logout'

import { registerGasto } from './routes/registerGasto'
import { getGastos } from './routes/getGastos';
import { deleteGastos } from './routes/deleteGastos';
import { getGastosById } from './routes/getGastoById';
import { updateGasto } from './routes/updateGasto';
initializeFirebase()
const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(login)
app.register(register)
app.register(logout)
app.register(getGastos)
app.register(getGastosById)
app.register(registerGasto)
app.register(updateGasto)
app.register(deleteGastos)

app.listen({ port: 3333 }).then(() => {
  console.log("Server running");
});
