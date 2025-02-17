import axios from "axios";
import type { AxiosError } from "axios";

export const api = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true,
});

export const extractError = (error: unknown): string => {
    const typeEnforcedError = error as AxiosError<{ message: string }>;
    return typeEnforcedError.response?.data?.message || "Unexpected error occured";
};
