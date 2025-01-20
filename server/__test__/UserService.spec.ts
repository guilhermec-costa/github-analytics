import { UserService } from "../src/application/service/UserService";
import { ILogger } from "../src/infra/config/ILogger";
import { GithubApiGateway } from "../src/infra/gateway/GithubApiGateway";
import { GithubWebGateway } from "../src/infra/gateway/GithubWebGateway";
import { mock } from "jest-mock-extended";
import { AuthCredentials, GithubUser } from "../src/utils/types/githubUser";

describe("UserService", () => {
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

    expect(mockGithubWeb.oauth).toHaveBeenCalledWith(code);
    expect(result).toEqual(mockResponse);
    expect(mockLogger.log).toHaveBeenCalledWith(
      "Requesting Github Gateway for user authentication",
    );
  });

  it("should refresh token", async () => {
    const refreshToken = "refreshToken123";
    const mockResponse: AuthCredentials = {
      accessToken: "newToken",
      refreshToken: "newRefresh",
    };

    mockGithubWeb.refreshToken.mockResolvedValueOnce(mockResponse);

    const result = await userService.refresh(refreshToken);

    expect(result).toEqual(mockResponse);
    expect(mockGithubWeb.refreshToken).toHaveBeenCalledWith(refreshToken);

    expect(mockLogger.log).toHaveBeenCalledWith(
      "Requesting Github Gateway for user authentication with refresh token",
    );
  });

  it("should load authorized user info", async () => {
    const code = "authCode";
    const mockedUserInfo: GithubUser = mock<GithubUser>();

    mockGithubApi.fetchAuthorizedUserInfo.mockResolvedValueOnce(mockedUserInfo);

    const result = await userService.loadAuthorizedUserInfo(code);

    expect(result).toEqual(mockedUserInfo);
    expect(mockLogger.log).toHaveBeenCalledWith(
      "Requesting Github Gateway information about for authorized user",
    );
  });

  it("should throw on load specific user", async () => {
    const code = "authCode";
    const username = "invalidUser";
    mockGithubApi.fetchSpecificUser.mockRejectedValueOnce(
      "Failed to get specific user",
    );

    await expect(userService.loadSpecificUser(code, username)).rejects.toThrow(
      "Failed to get specific user",
    );
  });

  it("should load specific user", async () => {
    const token = "authCode";
    const username = "username";
    const mockedUser = mock<GithubUser>();

    mockGithubApi.fetchSpecificUser.mockResolvedValue(mockedUser);

    const result = await userService.loadSpecificUser(token, username);

    expect(result).toEqual(mockedUser);
    expect(mockLogger.error).not.toHaveBeenCalledTimes(1);
  });
});
