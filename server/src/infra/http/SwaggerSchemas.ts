import { OpenAPIV3 } from "openapi-types";

const RefreshTokenRequestSchema: OpenAPIV3.SchemaObject = {
  type: "object",
  properties: {
    refreshToken: {
      type: "string",
      description: "O token de refresh fornecido no login inicial",
    },
  },
  required: ["refreshToken"],
};

const RefreshTokenResponseSchema: OpenAPIV3.SchemaObject = {
  type: "object",
  properties: {
    accessToken: {
      type: "string",
      description: "O token de acesso renovado",
    },
    refreshToken: {
      type: "string",
      description: "O novo token de refresh",
    },
  },
  required: ["accessToken", "refreshToken"],
};

export const RefreshEndpointSchema: OpenAPIV3.PathItemObject = {
  post: {
    summary: "Renova os tokens de autenticação",
    description:
      "Recebe um token de refresh válido e retorna novos tokens de acesso e refresh.",
    tags: ["Auth"],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: RefreshTokenRequestSchema,
        },
      },
    },
    responses: {
      "201": {
        description: "Tokens renovados com sucesso",
        content: {
          "application/json": {
            schema: RefreshTokenResponseSchema,
          },
        },
      },
      "400": {
        description: "Erro de validação nos dados enviados",
      },
      "401": {
        description: "Token de refresh inválido ou expirado",
      },
    },
  },
};
