import axios, { AxiosError, AxiosInstance } from "axios";
import {
  BadRequest,
  Unauthorized,
  NotFound,
  InternalServerError,
} from "../../utils/Exceptions";

export abstract class GithubGateway {
  private client: AxiosInstance;

  constructor(readonly url: string) {
    this.client = axios.create({
      baseURL: this.url,
      headers: { Accept: "application/json" },
    });

    this.client.interceptors.response.use(
      (response) => this.handleSucess(response),
      (error) => this.handleError(error),
    );
  }

  protected httpClient() {
    return this.client;
  }

  protected handleError(error: unknown): void {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        console.error(
          `[HTTP Error] Status: ${status}, Data: ${JSON.stringify(data)}`,
        );

        switch (status) {
          case 422:
          case 400:
            throw new BadRequest(data?.message || "Bad Request");
          case 401:
            throw new Unauthorized(data?.message || "Unauthorized");
          case 404:
            throw new NotFound(data?.message || "Not Found");
          case 500:
          default:
            throw new InternalServerError(
              data?.message || "Internal Server Error",
            );
        }
      } else if (error.request) {
        console.error(`[Network Error] No response received: ${error.message}`);
        throw new InternalServerError("Network error: No response received");
      } else {
        console.error(`[Axios Error] ${error.message}`);
        throw new InternalServerError(`Request setup error: ${error.message}`);
      }
    } else {
      console.error(`[Unknown Error] ${String(error)}`);
      throw new InternalServerError(`Unknown error: ${String(error)}`);
    }
  }

  protected handleSucess(response: any) {
    // Isso é porque o pessoal do gh curte xp programming (faltou daily, review, retro)
    if (response.data.error) {
      this.handleError(
        new AxiosError("", "", undefined, {}, {
          data: { message: response.data.error_description },
          status: 400,
        } as any),
      );
    }
    return response;
  }
}
