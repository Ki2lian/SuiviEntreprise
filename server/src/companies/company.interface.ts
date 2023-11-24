type CompanyData = {
    id?: number;
    name: string;
    description?: string;
    location?: string;
    website?: string;
    applicationDate?: Date;
    state?: TState;
    userId?: number;
};

export type TState = 'pending' | 'accepted' | 'rejected';

export const validStates: TState[] = ['pending', 'accepted', 'rejected'];

export default CompanyData;
