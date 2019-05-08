/**
 * Something which contains a latitude and longitude.
 */
export interface Coordinate {
    latitude: number;
    longitude: number;
}

export function IsCoordinate(item: any): item is Coordinate {
    console.log(item);
    return (
        item && item.latitude instanceof Number && item.longitude instanceof Number
    );
}

export function radians(degrees: number): number {
    return (degrees * Math.PI) / 180;
}

/**
 * Calculate the distance between @param first and @param second when travelling
 * along the surface of a sphere of @param radius.
 * @param first The first point.
 * @param second The second point.
 * @param radius The body's radius.
 */
export function haversine(
    first: Coordinate,
    second: Coordinate,
    radius: number = 6371e3
): number {
    const φ1 = radians(first.latitude);
    const φ2 = radians(second.latitude);
    const Δφ = radians(second.latitude - first.latitude);
    const Δλ = radians(second.longitude - first.longitude);

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return radius * c;
}

/**
 * Calculate the bearing to head on to go from @param first to @param second.
 * @param first The start point
 * @param second The end point
 */
export function bearing(first: Coordinate, second: Coordinate): number {
    var y =
        Math.sin(second.longitude - first.longitude) * Math.cos(second.latitude);
    var x =
        Math.cos(first.latitude) * Math.sin(second.latitude) -
        Math.sin(first.latitude) *
        Math.cos(second.latitude) *
        Math.cos(second.longitude - first.longitude);
    return Math.atan2(y, x);
}

export function toString(value: any): string {
    if (!value) {
        return "";
    } else if (value instanceof Object) {
        return Object.keys(value)
            .sort()
            .map(key => toString(value[key]))
            .join(" ");
    }
    return String(value);
}

export function cmp(l: number, r: number): number {
    if (l < r) {
        return -1;
    } else if (r < l) {
        return 1;
    } else {
        return 0;
    }
}

/**
 * The default sort compare function for a Vue bootstrap table.
 * @param a (dunno)
 * @param b The row
 * @param key The column name
 */
export function sortCompare(a: any, b: any, key: string): number {
    // see https://github.com/bootstrap-vue/bootstrap-vue/issues/3178

    if (typeof a[key] === "number" && typeof b[key] === "number") {
        // If both compared fields are native numbers
        return cmp(a[key], b[key]);
    } else {
        // Stringify the field data and use String.localeCompare
        return toString(a[key]).localeCompare(toString(b[key]), undefined, {
            numeric: true
        });
    }
}