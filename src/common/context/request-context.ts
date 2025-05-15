import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export class RequestContext {
  readonly requestId: string;
  readonly timestamp: Date;

  constructor(request: Request) {
    this.requestId = (request.headers['x-request-id'] as string) || this.generateRequestId();
    this.timestamp = new Date();
  }

  private generateRequestId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  // TODO: Add additional context properties you might need, e.g., authenticated user ID
  // userId?: string;
}

// Param decorator to extract request context
export const ReqContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RequestContext => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return new RequestContext(request);
  },
);