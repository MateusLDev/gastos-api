import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { db } from "../lib/firebase";

import { Gastos } from "../types";
import {
  getTokenByAuthorizationString,
  getUserIdByToken,
} from "../utils/token";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export async function updateGasto(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    "/gasto/:gastoId",
    {
      preHandler: (request, reply, done) => {
        const { authorization } = request.headers;

        if (!authorization)
          reply.status(404).send({ message: "Unauthorized token." });

        const token = getTokenByAuthorizationString(authorization!);

        if (!token) reply.status(404).send({ message: "invalid token." });

        done();
      },
      schema: {
        params: z.object({
          gastoId: z.string(),
        }),
        body: z.object({
          gasto: z.object({
            id: z.string(),
            title: z.string(),
            category: z.string(),
            price: z.string(),
            description: z.string().nullish(),
            createdAt: z.string(),
          })
        }),
        response: {
          200: z.string(),
          404: z.object({
            message: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      }
    },
    async (request, reply) => {
      const { gastoId } = request.params;
      const { gasto } = request.body
      const { authorization } = request.headers;

      const token = getTokenByAuthorizationString(authorization!);
      const userId = getUserIdByToken(token);

      try {
        const gastoRef = doc(db, userId!, gastoId);
        const gastoSnap = await getDoc(gastoRef);
        const gastoData = gastoSnap.data() as Gastos;

        if (!gastoData)
          return reply.status(400).send({ message: "Gasto não encontrado." });

        await updateDoc(gastoRef, gasto)

        reply.status(200).send("Gasto editado com sucesso!");
      } catch (error) {
        return reply.status(400).send({ message: "Ocorreu um erro ao editar este gasto." });
      }
    }
  )
}