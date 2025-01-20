import { IGithubApiGateway } from "../src/application/gateway/IGithubApiGateway";
import { IGithubWebGateway } from "../src/application/gateway/IGithubWebGateway";
import { UserService } from "../src/application/service/UserService";
import { ILogger } from "../src/infra/config/ILogger";
import { GithubApiGateway } from "../src/infra/gateway/GithubApiGateway";
import { GithubWebGateway } from "../src/infra/gateway/GithubWebGateway";
import { mock } from "jest-mock-extended";
import { AuthCredentials } from "../src/utils/types/githubUser";

let userService: UserService;
const mockLogger = mock<ILogger>();
const mockGithubApi = mock<GithubApiGateway>();
const mockGithubWeb = mock<GithubWebGateway>();

beforeEach(() => {
  jest.clearAllMocks();
  userService = new UserService(mockLogger, mockGithubWeb, mockGithubApi);
});

it("should auth user using oauth", async () => {
  const code = "authCode";
  const mockResponse: AuthCredentials = {
    accessToken: "token123",
    refreshToken: "refresh123",
  };

  mockGithubWeb.oauth.mockResolvedValueOnce(mockResponse);

  const result = await userService.oauth(code);

  expect(result).toEqual(mockResponse);
  expect(mockLogger.log).toHaveBeenCalledWith(
    "Requesting Github Gateway for user authentication",
  );
});
