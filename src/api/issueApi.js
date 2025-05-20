import  api  from '@hooks/useAxios'
import { showSuccessToastMsg, showErrorToastMsg } from '@utils/showToastMsg';
import { useAccessTokenStore } from '@store/useUserStore'

/**
 * 1. 모든 이슈 받아오기 (프로젝트별)
 * @param {number} projectId
 */
export const fetchAllIssues = async (projectId) => {
  try {
    const token = useAccessTokenStore.getState().accessToken
    if (!token) {
      throw new Error('Access token is not available')
    }

    const response = await api.get('/issue', { 

      params: { 
        project_id: projectId 
      } 
    });
    return response;
  } catch (error) {
    showErrorToastMsg(error);
    throw error;
  }
}

/**
 * 2. 이슈 상세보기 (단일 이슈)
 * @param {number} projectId
 * @param {number} issueNumber
 */
export const fetchIssueDetail = async (projectId, issueNumber) => {
  try {
    const token = useAccessTokenStore.getState().accessToken
    if (!token) {
      throw new Error('Access token is not available')
    }
    const response = await api.get('/issue/detail', {
    
      params: {
        project_id: projectId,
        issue_number: issueNumber
      }
    })
    return response;
  } catch (error) {
    showErrorToastMsg(error);
    throw error;
  }
}
/**
 * 3. 이슈 추가하기
 * @param {object} issueData
 */
export const createIssue = async (issueData) => {
  try {
    const token = useAccessTokenStore.getState().accessToken
    if (!token) {
      throw new Error('Access token is not available')
    }

    const response = await api.post('/issue', issueData)
    showSuccessToastMsg('성공적으로 이슈가 생성되었습니다.')
    return response.data
  } catch (error) {
    showErrorToastMsg(error);
    throw error
  }
}

/**
 * 4. 이슈 수정하기
 * @param {object} issueData
 */
export const updateIssue = async (issueData) => {
  try {
    const token = useAccessTokenStore.getState().accessToken
    if (!token) {
      throw new Error('Access token is not available')
    }

    const response = await api.put('/issue', issueData)
    showSuccessToastMsg('성공적으로 이슈가 수정되었습니다.')
    return response.data
  } catch (error) {
    showErrorToastMsg(error);
    throw error
  }
}

/**
 * 5. 이슈 닫기
 * @param {object} closeData { project_id, issue_number }
 */
export const deleteIssue = async (issueData) => {
  try {
    const token = useAccessTokenStore.getState().accessToken
    if (!token) {
      throw new Error('Access token is not available')
    }

    const response = await api.patch('/issue', issueData)
    showSuccessToastMsg('성공적으로 이슈가 닫혔습니다.')
    return response.data
  } catch (error) {
    showErrorToastMsg(error);
    throw error
  }
}

/**
 * 6. 이슈 현황(갯수) 받아오기
 * @param {number} projectId
 * 
 */
export const fetchIssueSummary = async (projectId) => {
  try {
    const token = useAccessTokenStore.getState().accessToken
    if (!token) {
      throw new Error('Access token is not available')
    }

    const response = await api.get('/issue/summary', {
    
      params: {
        project_id: projectId
      }
    })
    return response;
  } catch (error) {
    showErrorToastMsg(error);
    throw error;
  }
}