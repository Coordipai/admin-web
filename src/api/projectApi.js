import  api  from '@hooks/useAxios'
import { useAccessTokenStore } from '@store/useUserStore'
import toastMsg from '@utils/toastMsg'

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
    toastMsg(error,'error')
    //showErrortoastMsgMsg(error);
    throw error;
  }
}