import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import {
  getTokenByAuthorizationString,
  getUserIdByToken,
} from "../utils/token";

import { Gastos } from "../types";

import { db } from "../lib/firebase";
import { doc, deleteDoc, collection, getDocs } from "firebase/firestore";

export async function deleteGastos(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
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
      try {
        const { gastoId } = request.params;
        const { authorization } = request.headers;

        const token = getTokenByAuthorizationString(authorization!);
        const userId = getUserIdByToken(token);

        const gastoRef = doc(db, userId!, gastoId);

        await deleteDoc(gastoRef);

        reply.status(200).send("Gasto deletado com sucesso!");
      } catch (error) {
        reply
          .status(400)
          .send({ message: "Ocorreu um erro ao deletar este gasto." });
      }
    }
  );
}
