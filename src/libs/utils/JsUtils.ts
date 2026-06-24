
export function getAllKeyFromObject(obj: Record<string, any>, prefix = ''): string[] {
    let keys: string[] = [];
    for (const key in obj) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        keys.push(fullKey);
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            keys = keys.concat(getAllKeyFromObject(obj[key], fullKey));
        }
    }
    return keys;
}

export function merchObjectToObject(first_obj: Record<string, any>, second_obj: Record<string, any>): Record<string, any> {
    for (const key in second_obj) {
        if (Object.prototype.hasOwnProperty.call(second_obj, key)) {
            if (typeof second_obj[key] === "object" && second_obj[key] !== null) {
                first_obj[key] = merchObjectToObject(first_obj[key] || {}, second_obj[key]);
            } else {
                first_obj[key] = second_obj[key];
            }
        }
    }
    return first_obj;
}

export function getAllValueFromObject(obj: Record<string, any>, prefix = ''): any[] {
    let values: any[] = [];
    for (const key in obj) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        values.push(obj[fullKey] || obj[key]);
    }
    return values;
}
