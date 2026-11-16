import { env } from 'cloudflare:workers';
import { stateApi } from '../../../lib/state-api.mjs';
export const dynamic = 'force-dynamic';
export function GET(request: Request){return stateApi(request,env.DB)}
export function PATCH(request: Request){return stateApi(request,env.DB)}
