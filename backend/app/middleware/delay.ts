import { Response, Request, NextFunction } from 'express';

export const delay = ms => (req: Request, res: Response, next: NextFunction) => {
  setTimeout(next, Math.random() * ms/2 + ms/2)
}
