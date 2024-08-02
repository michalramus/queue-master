/**
 * Entity from jwt token
 */
export class Entity {
    id: number;
    type: "User" | "Device";
    name: string;

    constructor(id: number, type: "User" | "Device", name: string) {
        this.id = id;
        this.type = type;
        this.name = name;
    }

    /**
     *
     * @param req should match schema: req.user:{sub, type, name}
     */
    static convertFromReq(req: { user: { id: number; type: "User" | "Device"; name: string } }) {
        return new Entity(req.user.id, req.user.type, req.user.name); //IMPORTANT: If changing this, update also jwt strategies
    }

    getJwtPayload() {
        return { sub: this.id, type: this.type, name: this.name };  //IMPORTANT: If changing this, update also jwt strategies
    }
}
