import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import {
  getTokenByAuthorizationString,
  getUserIdByToken,
} from "../utils/token";
import { collection, getDocs } from "firebase/firestore";

import { db } from "../lib/firebase";

import { Gastos } from "../types";

export async function getGastos(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/gasto",
    {
      schema: {
        response: {
          200: z.object({
            gastos: z
              .array(
                z.object({
                  id: z.string(),
                  title: z.string(),
                  category: z.string(),
                  price: z.string(),
                  description: z.string().nullish(),
                  createdAt: z.string().optional(),
                })
              )
              .default([])
              .transform((val) => val ?? []),
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
      const { authorization } = request.headers;

      const token = getTokenByAuthorizationString(authorization!);
      const userId = getUserIdByToken(token);

      try {
        const collectionRef = collection(db, userId!);
        const collectionSnapshot = await getDocs(collectionRef);
  
        if (collectionSnapshot.empty)
          return reply.status(200).send({ gastos: [] });
  
        const gastos: Gastos[] = [];
  
        collectionSnapshot.forEach((document) => {
          gastos.push(document.data() as Gastos);
        });
  
        return reply.status(200).send({
          gastos: gastos.map((gasto) => {
            return {
              id: gasto.id!,
              title: gasto.title,
              category: gasto.category,
              price: gasto.price,
              createdAt: gasto.createdAt,
              description: gasto.description,
            };
          }),
        });
      } catch (error) {
        return reply.status(400).send({ message: "Ocorreu um erro ao obter os gastos." });
      }
    }
  );
}
