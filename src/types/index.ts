import { Request } from "express";
import { REQUEST_STATUS } from "../utils/enums";
export interface AuthenticatedRequest extends Request {
  user: any;
}
