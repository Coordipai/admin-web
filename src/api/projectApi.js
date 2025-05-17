import { api } from '@hooks/useAxios'
import { showSuccessToastMsg, showErrorToastMsg } from '@utils/showToastMsg';
import { useAccessTokenStore } from '@store/useUserStore'


export const fetchProjectDetail = async (projectId) => {
  try {
    const token = useAccessTokenStore.getState().accessToken
    if (!token) {
      throw new Error('Access token is not available')
    }

    const response = await api.get(`/project/${projectId}`, { 
      headers: {
        Authorization: `Bearer ${token}`
      },
    });

    console.log("pid: ", projectId, "response: ", response.data)
    return response.data.content.data;
  } catch (error) {
    showErrorToastMsg(error);
    throw error;
  }
}