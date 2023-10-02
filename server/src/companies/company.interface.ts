type CreateCompany = {
    name: string;
    description?: string;
    location?: string;
    website?: string;
    applicationDate?: Date;
    state?: TState;
    userId?: number;
};

export type TState = 'pending' | 'accepted' | 'rejected';

export default CreateCompany;
