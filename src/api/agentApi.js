import  api  from '@hooks/useAxios'
import { useAccessTokenStore } from '@store/useUserStore'
import useLoadingStore from '@store/useLoadingStore'
import toastMsg from '@utils/toastMsg'

/**
 * 1. 이슈 자동 생성 요청하기 (Streaming 방식)
 *
 * @param {number} projectId
 * @param {(chunk: string) => void} onChunk - 데이터를 스트리밍 단위로 받을 때마다 호출되는 콜백
 * @returns {Promise<string>} 전체 스트림 결과
 */
export const getGeneratedIssues = async (projectId, onChunk) => {
  try {
    const token = useAccessTokenStore.getState().accessToken;
    if (!token) {
      throw new Error('Access token is not available');
    }

    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/agent/generate_issues/${projectId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('response', response);

    if (!response.ok || !response.body) {
      throw new Error(`Streaming response failed: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let result = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      console.log('value', value);
      const chunk = decoder.decode(value, { stream: true });
      result += chunk;
    
      onChunk(chunk);
    }
    toastMsg('자동 이슈 생성 완료', 'success');
    return result;
  } catch (error) {
    toastMsg(error,'error')
    //showErrortoastMsgMsg(error);
    throw error;
  }
};


/**
 * 2. 역량 평가 요청하기 (Post)
 * 
 * @param {object} data
 * @returns {object} assessData
 * 
 */
export const postAssessStat = async (data) => {
    try {
        const token = useAccessTokenStore.getState().accessToken
        if (!token) {
            throw new Error('Access token is not available')
        }
        const response = await api.post('/agent/assess_stat', {
            body: data
        })
        return response;
    } catch (error) {
        toastMsg(error,'error')
        //showErrortoastMsgMsg(error);
        throw error;
    }
}


/**
 * 3. 평가된 역량 정보 가져오기 (Get)
 * 
 * @param {string} userId 
 * @returns {object}
 * 
 */
export const getReadStat = async (userId) => {
    try {
        const token = useAccessTokenStore.getState().accessToken
        if (!token) {
            throw new Error('Access token is not available')
        }
        const response = await api.get('/agent/read_stat', {
            params: { user_id: userId }
        })
        return response;
    } catch (error) {
        toastMsg(error,'error')
        //showErrortoastMsgMsg(error);
        throw error;
    }
}


/**
 * 4. 사용자 이슈 할당하기 (Post)
 * 
 *  @param {string} projectId
 *  @param {object} data 
 *  @returns {object} 
 *
 */
export const postAssignIssues = async (projectId, data) => {
    try {
        useLoadingStore.getState().setLoading(true)
        const token = useAccessTokenStore.getState().accessToken
        if (!token) {
            throw new Error('Access token is not available')
        }

        const issues = data.map(issue => ({
            type: issue.type,
            name: issue.name,
            description: issue.description,
            title: issue.title,
            labels: issue.labels,
            sprint: issue.sprint,
            priority: issue.priority,
            body: issue.body,
        }))

        console.log('issues', issues)

        const requestBody = {
            issues: {
                issues,
            }
        }
        console.log('requestBody', requestBody)

        const response = await api.post(`/agent/recommend_assignees/${projectId}`,
            requestBody,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        console.log('response', response)
        toastMsg('이슈 할당 완료','success')
        return response;
    } catch (error) {
        toastMsg(error,'error')
        //showErrortoastMsgMsg(error);
        throw error;
    } finally {
        useLoadingStore.getState().setLoading(false)
    }
}