import { QuestionDetailInsert, QuestionGroupDetailsResponse, QuestionGroupResponse } from "../models/QuestionModels";
import api from "../utils/Api";

export class QuestionService {

    public async getQuestionGroupList({
        userId,
    }: { userId: string }): Promise<QuestionGroupResponse> {
        return await api.get(`questiongroup/question-group-get-list/${userId}`);
    }

    public async insertQuestionDetail({
        userId,
        groupId,
        question,
        answer,
    }: QuestionDetailInsert): Promise<{
        data:{groupId: string;
        getValue: number;}
    }> {
        return await api.post(`questiondetail/question-detail-insert/${userId}?groupId=${groupId ? groupId: ""}`, {
            question,
            answer,
        });
    }

    /*
        HTTP GET: api/questiongroup/question-group-get-by-id/{groupId}

        RESPONSE:

        GroupId INT
        GroupName STRING
        State BIT
    */

    public async getQuestionGroupById({
        groupId,
    }: { groupId: string }): Promise<QuestionGroupResponse> {
        return await api.get(`questiongroup/question-group-get-by-id/${groupId}`);
    }

    /*
        HTTP GET: api/questiondetail/question-detail-get-list/{groupId}

        RESPONSE:

        Id INT
        GroupId INT
        Question STRING
        Answer STRING
    */

    public async getQuestionDetailList({
        groupId,
    }: { groupId: string }): Promise<QuestionGroupDetailsResponse> {
        return await api.get(`questiondetail/question-detail-get-list/${groupId}`);
    }

    /*
        HTTP POST: api/questiongroup/question-group-update

        REQUEST:

        GroupId INT
        GroupName STRING
        State INT

        RESPONSE:

        StatusCode 200
    */
    public async updateQuestionGroup({
        groupId,
        groupName,
        state,
    }: {
        groupId: string;
        groupName: string;
        state: boolean;
    }): Promise<unknown> {
        return await api.post(`questiongroup/question-group-update`, {
            groupId,
            groupName,
            state,
        });
    }

    /*
        HTTP GET: api/prompt/prompt-get-list

        RESPONSE:

        PromptId INT
        PromptName STRING
    */

    public async getPromptList(): Promise<unknown> {
        return await api.get(`prompt/prompt-get-list`);
    }

    /*
        HTTP GET: api/banned/banned-get-list

        RESPONSE:

        BannedId INT
        BannedName STRING
    */

    



}

const questionService = new QuestionService();
export default questionService;