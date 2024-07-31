/**
 * Entity from jwt token
 */
export class Entity {
    id: number;
    type: "User" | "Device";

    /**
     * 
     * @param req should match schema: req.user:{sub, type}
     */
    convertFromReq(req: any) {
        this.id = req.user.id;
        this.type = req.user.type;

        return this;
    }

    getJwtPayload() {
        return { sub: this.id, type: this.type };
    }
}
