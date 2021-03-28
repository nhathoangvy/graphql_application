export namespace Validator {

    const required:ValidType = 
    {
        "column":
        <ValidCondition>
        {
            "create":<Array<string>> 
            [
                "name", 
                "order"
            ]
        }
    }

    export const Validation = <T extends object>(args: T, model: string, action: string):boolean => {
        const keys = Object.keys(args);
        if (!required[model]) return false;
        for ( var key of required[model][action]) if (!keys.includes(key)) return false
        return true
    }

}