import { res } from '..';

export class MaintenanceModeMiddleware {
  constructor(enable: boolean = false, message: string='Service Unavailable') {
    if (enable) {
      res.serviceUnavailable({
        status: false,
        code: 'maintenance',
        message: message,
      });
    }
  }
}