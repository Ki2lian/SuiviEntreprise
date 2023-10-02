declare namespace Express {
    type Request = {
        user: {
            payload: {
                userId: number;
            };
        };
    };
}
