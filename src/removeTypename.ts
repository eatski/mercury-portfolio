export const removeTypename = (obj: unknown): unknown => {
    if (obj instanceof Array) {
        return obj.map(removeTypename);
    } else if (obj instanceof Object) {
        const result: Record<string, unknown> = {};
        for (const key in obj) {
            if (key !== "__typename") {
                // @ts-ignore
                result[key] = removeTypename(obj[key]);
            }
        }
        return result;
    } else {
        return obj;
    }
}