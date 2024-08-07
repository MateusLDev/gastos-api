import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { getAuth, signOut } from "firebase/auth";

export async function logout(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/logout",
    {
      schema: {
        response: {
          200: z.string(),
          400: z.string()
        }
      }
    },
    async (request, reply) => {
      const auth = getAuth();

      signOut(auth).then(() => {
        reply.status(200).send('Usuário deslogado')
      }).catch((error) => {
        const errorMessage = error.message

        reply.status(400).send(errorMessage)
      })
    }
  )
}