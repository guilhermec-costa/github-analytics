import { z } from "zod";

export const AuthorizationHeaderSchema = z.object({
  authorization: z.string().nonempty(),
});

export const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string().nonempty(),
});

export const GithubUserAuthorizationSchema = z.object({
  code: z.string().nonempty(),
});

export const RepositoryOwnerPairSchema = z.object({
  repoName: z.string().nonempty(),
  repoOwner: z.string().nonempty(),
});

export const RepositoryOwnerSchema = z.object({
  repoOwner: z.string().nonempty(),
});

export const CommitReferenceSchema = z
  .object({
    ref: z.string().nonempty(),
  })
  .merge(RepositoryOwnerPairSchema);
