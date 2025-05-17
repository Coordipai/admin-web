import { api } from '@hooks/useAxios'
import { showSuccessToastMsg, showErrorToastMsg } from '@utils/showToastMsg';
import { useAccessTokenStore } from '@store/useUserStore'

/**
 * 1. 이슈 자동 생성 요청하기 (Post)
 * 
 * @returns {object} issueData
 */
export const getGeneratedIssues = async (projectId) => {
    try {
        const token = useAccessTokenStore.getState().accessToken
        if (!token) {
            throw new Error('Access token is not available')
        }
        const response = await api.get(`/agent/generate_issues/${projectId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        showSuccessToastMsg('이슈 제안 완료');
        return response.data.content.data;
    } catch (error) {
        showErrorToastMsg(error);
        throw error;
    }
}


/**
 * 2. 역량 평가 요청하기 (Post)
 * 
 * @param {object} data
 * example: {
 *    "selected_repos": [
 *        "string"
 *   ]
 * }
 * 
 * @returns {object} assessData
 * example: {
 *     "name": "string",
 *     "field": "string",
 *     "experience": "string",
 *     "evaluation_scores": {
 *        "additionalProp1": {}
 *     },
 *     "implemented_features": [
 *        "string"
 *     ],
 *     "timestamp": "string"
 * }
 * 
 */
export const postAssessStat = async (data) => {
    try {
        const token = useAccessTokenStore.getState().accessToken
        if (!token) {
            throw new Error('Access token is not available')
        }
        const response = await api.post('/agent/assess_stat', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: data
        })
        return response.data.content.data;
    } catch (error) {
        showErrorToastMsg(error);
        throw error;
    }
}


/**
 * 3. 평가된 역량 정보 가져오기 (Get)
 * 
 * @param {string} userId 
 * 
 * @returns {object}
 * example: {
 *     "name": "string",
 *     "field": "string",
 *     "experience": "string",
 *     "evaluation_scores": {
 *        "additionalProp1": {}
 *     },
 *     "implemented_features": [
 *        "string"
 *     ],
 *     "timestamp": "string"
 * }
 * 
 */
export const getReadStat = async (userId) => {
    try {
        const token = useAccessTokenStore.getState().accessToken
        if (!token) {
            throw new Error('Access token is not available')
        }
        const response = await api.get('/agent/read_stat', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: { user_id: userId }
        })
        return response.data.content.data;
    } catch (error) {
        showErrorToastMsg(error);
        throw error;
    }
}


/**
 * 4. 사용자 이슈 할당하기 (Post)
 * 
 *  @param {string} projectId
 *  @param {object} data 
 * example: {
 *    "user_names": [
 *       "string"
 *    ],
 *    "issues": {
 *       "issues": [
 *          {
 *               "type": "string",
 *               "name": "string",
 *               "description": "string",
 *               "title": "string",
 *               "labels": [
 *                  "string"
 *               ],
 *               "body": [
 *                  "string"
 *               ]
 *          }
 *       ]
 * }
 *  @returns {object} 
 * example: {
 *    "issues": [
 *       {
 *         "issue": "string",
 *         "assignee": "string",
 *         "description": [
 *            "string"
 *         ]
 *      }
 *   ]
 * }
 * 
 */
export const postAssignIssues = async (projectId, data) => {
    try {
        const token = useAccessTokenStore.getState().accessToken
        if (!token) {
            throw new Error('Access token is not available')
        }
        const response = await api.post('/agent/assign_issues', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: { project_id: projectId },
            body: data
        })
        showSuccessToastMsg('이슈 할당 완료');
        return response.data.content.data;
    } catch (error) {
        showErrorToastMsg(error);
        throw error;
    }
}