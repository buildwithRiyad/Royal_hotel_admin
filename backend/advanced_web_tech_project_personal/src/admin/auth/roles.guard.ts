import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user; // user is attached by JwtAuthGuard

    // Temporary developer bypass: when FORCE_ADMIN_ACCESS=true, allow any
    // authenticated user to pass role checks. Use only in dev/testing.
    if (process.env.FORCE_ADMIN_ACCESS === 'true') {
      return !!user;
    }

    return requiredRoles.includes(user?.role);
  }
}