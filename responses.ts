namespace Response {
    
    export class Message implements MessageOptions {
        public code: number
        public message: string
        constructor(opt:MessageOptions) 
        {
            this.code = opt.code;
            this.message = opt.message; 
        }

        OK = () => <MessageOptions> { code: 200, message: "Success" }
        StatusCreated = () => <MessageOptions> { code: 201, message: "Have already been" }
        StatusNonAuthoritativeInfo = () => <MessageOptions> { code: 203, message: "Missing params" }
        StatusBadRequest = () => <MessageOptions> { code: 400, message: "Something were wrong" }
        StatusUnauthorized = () => <MessageOptions> { code: 401, message: "Unthorized" }
        StatusInternalServerError = () => <MessageOptions> { code: 500, message: "Success" }
    }
}

export const message = new Response.Message
(
    <MessageOptions>{}
)