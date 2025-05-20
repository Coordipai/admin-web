import  api  from '@hooks/useAxios'
import { showErrorToastMsg } from '@utils/showToastMsg';
import { useAccessTokenStore } from '@store/useUserStore'

/**
 * 1. 특정 프로젝트 가져오기
 * 
 * @param {number} projectId 
 * @returns 
 */
export const fetchProjectDetail = async (projectId) => {
  try {
    const token = useAccessTokenStore.getState().accessToken
    if (!token) {
      throw new Error('Access token is not available')
    }

    const response = await api.get(`/project/${projectId}`);
    return response;
  } catch (error) {
    showErrorToastMsg(error);
    throw error;
  }
}