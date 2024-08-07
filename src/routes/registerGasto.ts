import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  addDoc,
  DocumentData,
} from "firebase/firestore";

import { getTokenByAuthorizationString, getUserIdByToken } from "../utils/token"
import { db } from "../lib/firebase";
import { randomUUID } from "crypto";

export async function registerGasto(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/gasto",
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
        body: z.object({
          title: z.string(),
          category: z.number(),
          price: z.string(),
          description: z.string().max(100).nullish(),
          createdAt: z.string().optional(),
        }),
        headers: z.object({
          authorization: z.string().optional(),
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
      },
    },
    async (request, reply) => {
      const { authorization } = request.headers;
      const { title, category, price, description, createdAt } = request.body;

      const token = getTokenByAuthorizationString(authorization!);
      const userId = getUserIdByToken(token);

      const gastoId = randomUUID()


      try {
        const documentPayload = {
          id: gastoId,
          title,
          category,
          price,
          description: description || null,
          createdAt: createdAt || new Date().toDateString(),
        };

        const document = doc(db, userId!, gastoId);
        await setDoc(document, documentPayload)

        reply.status(200).send("Gasto criado com sucesso!");
      } catch (error) {
        reply.status(400).send({ message: "Ocorreu um erro ao criar gasto." });
      }
    }
  );
}
