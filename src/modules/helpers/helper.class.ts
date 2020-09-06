export class Helper {
    /**
     * Checks if a variable is valid or not
     * @param input the variable to check
     */
    public static falsify(input: any): boolean {
        if (input === undefined) { return false; }
        if (input === null) { return false; }
        if (typeof input === 'string' && input === '') { return false; }
        if (input.length && input.length === 0) { return false; }

        // If nothing else applies, variable must be valid
        return true;
    }

    public static getBoolean(value){
        switch(value){
             case true:
             case "true":
             case 1:
             case "1":
             case "on":
             case "yes":
                 return true;
             default: 
                 return false;
         }
     }
}