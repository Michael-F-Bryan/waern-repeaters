export default class Repeater {
    latitude: number = 0;
    longitude: number = 0;
    channel?: number;
    plan?: string;
    agency?: string;
    label?: string;
    location?: string;
    address?: string;
    altitude?: number;
    mast_height?: number;

    constructor(options: Partial<Repeater>) {
        Object.assign(this, options);
    }
}

