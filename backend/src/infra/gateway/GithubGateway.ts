import axios, { AxiosError, AxiosInstance } from "axios";
import {
  BadRequest,
  Unauthorized,
  NotFound,
  InternalServerError,
} from "../../utils/Exceptions";
import { HttpStatus } from "../../utils/HttpStatus";
import { ILogger } from "../config/ILogger";
import WinstonLogger from "../config/WinstonLogger";

export abstract class GithubGateway {
  private client: AxiosInstance;
  private logger: ILogger;

  constructor(readonly url: string) {
    this.client = axios.create({
      baseURL: url,
      headers: { Accept: "application/json" },
    });

    this.client.interceptors.response.use(
      (response) => this.handleSucess(response),
      (error) => this.handleError(error),
    );

    this.logger = new WinstonLogger();
  }

  protected httpClient() {
    return this.client;
  }

  protected handleError(error: unknown): never {
    if (!axios.isAxiosError(error)) {
      this.logger.error(`[Unknown Error] ${String(error)}`);
      throw new InternalServerError(`Unknown error: ${String(error)}`);
    }

    if (!error.response) {
      if (error.request) {
        this.logger.error(
          `[Network Error] No response received: ${error.message}`,
        );
        throw new InternalServerError("Network error: No response received");
      }
      this.logger.error(`[Axios Error] ${error.message}`);
      throw new InternalServerError(`Request setup error: ${error.message}`);
    }

    const { status, data } = error.response;

    this.logger.error(
      `[HTTP Error] Status: ${status}, Data: ${JSON.stringify(data)}`,
    );

    switch (status) {
      case HttpStatus.UNPROCESSABLE_ENTITY:
      case HttpStatus.BAD_REQUEST:
        throw new BadRequest(data?.message || "Bad Request");
      case HttpStatus.UNAUTHORIZED:
        throw new Unauthorized(data?.message || "Unauthorized");
      case HttpStatus.NOT_FOUND:
        throw new NotFound(data?.message || "Not Found");
      case HttpStatus.INTERNAL_SERVER_ERROR:
      default:
        throw new InternalServerError(data?.message || "Internal Server Error");
    }
  }

  protected handleSucess(response: any) {
    // This is because the GitHub folks love XP programming (missing daily, review, retro)
    if (!response.data.error) return response;

    this.handleError(
      new AxiosError("", "", undefined, {}, {
        data: { message: response.data.error_description },
        status: HttpStatus.BAD_REQUEST,
      } as any),
    );
  }
}
