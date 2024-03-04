import { Response } from "express";
function myErrorHandler(err: unknown, res: Response) {
  if (err instanceof Error) {
    console.log(err.message);
    res.status(400).json(err.message);
  }
}
export default myErrorHandler;
