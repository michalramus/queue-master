import { Request } from "express";
import { Entity } from "src/auth/types/entity.class";

/**
 * Express request carrying the entity resolved from the JWT by the passport strategies.
 *
 * The user shape is derived from `Entity.convertFromReq` instead of being restated, so the
 * controllers and the entity contract cannot drift apart.
 */
export type AuthenticatedRequest = Request & Parameters<typeof Entity.convertFromReq>[0];
