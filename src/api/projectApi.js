import { api } from '@hooks/useAxios'
import { showErrorToastMsg } from '@utils/showToastMsg';
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
    return response.data.content.data;
  } catch (error) {
    showErrorToastMsg(error);
    throw error;
  }
}