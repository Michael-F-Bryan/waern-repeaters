type LoginResponse = { token: string };

export interface API {
    login(username: string, password: string): PromiseLike<LoginResponse>;
    getRepeaters(count?: number, firstID?: number): PromiseLike<LoginResponse>;
}

class DummyAPI implements API {
    login(username: string, password: string): PromiseLike<LoginResponse> {
        throw new Error("Unimplemented");
    }

    getRepeaters(count?: number, firstID?: number): PromiseLike<LoginResponse> {
        throw new Error("Unimplemented");
    }
}

class ProductionAPI implements API {
    login(username: string, password: string): PromiseLike<LoginResponse> {
        throw new Error("Unimplemented");
    }

    getRepeaters(count?: number, firstID?: number): PromiseLike<LoginResponse> {
        throw new Error("Unimplemented");
    }
}

export default function createAPI(): Api {
    if (process.env.NODE_ENV === "development") {
        return new DummyAPI();
    } else {
        return new ProductionAPI();
    }
}