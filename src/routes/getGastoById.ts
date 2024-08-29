import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { db } from "../lib/firebase";

import { Gastos } from "../types";
import {
  getTokenByAuthorizationString,
  getUserIdByToken,
} from "../utils/token";
import { doc, getDoc } from "firebase/firestore";

export async function getGastosById(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
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
        response: {
          200: z.object({
            id: z.string(),
            title: z.string(),
            category: z.string(),
            price: z.string(),
            description: z.string().nullish(),
            createdAt: z.string(),
          }),
          404: z.object({
            message: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { gastoId } = request.params;
      const { authorization } = request.headers;

      const token = getTokenByAuthorizationString(authorization!);
      const userId = getUserIdByToken(token);

      try {
        const gastoRef = doc(db, userId!, gastoId);
        const gastoSnap = await getDoc(gastoRef);
        const gasto = gastoSnap.data() as Gastos;

        if (!gasto)
          return reply.status(400).send({ message: "Gasto não encontrado." });

        return reply.status(200).send({
          id: gasto.id!,
          title: gasto.title,
          category: gasto.category,
          price: gasto.price,
          createdAt: gasto.createdAt!,
          description: gasto.description,
        });
      } catch (error) {
        return reply.status(400).send({ message: "Ocorreu um erro ao obter este gasto." });
      }
    }
  );
}
