export interface SupervisorInput {
    userId: string;
    status: string;
    supervisorId:string;
    options: SupervisorOptionInput[];
}

export interface SupervisorOptionInput {
    applicationId: string;
    optionId: string;
}