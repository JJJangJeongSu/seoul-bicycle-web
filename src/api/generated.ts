import { Configuration } from '../../CodeGenerator';
import { 
  AdminApi, 
  AiApi, 
  AuthApi, 
  BoardApi, 
  RentalsApi, 
  RepairsApi, 
  RoutesApi, 
  StationsApi, 
  UsersApi 
} from '../../CodeGenerator';
import { axiosInstance, apiConfig } from './config';

// Inject our custom axios instance (apiClient) to enable interceptors
export const adminApi = new AdminApi(apiConfig, undefined, axiosInstance);
export const aiApi = new AiApi(apiConfig, undefined, axiosInstance);
export const authApi = new AuthApi(apiConfig, undefined, axiosInstance);
export const boardApi = new BoardApi(apiConfig, undefined, axiosInstance);
export const rentalsApi = new RentalsApi(apiConfig, undefined, axiosInstance);
export const repairsApi = new RepairsApi(apiConfig, undefined, axiosInstance);
export const routesApi = new RoutesApi(apiConfig, undefined, axiosInstance);
export const stationsApi = new StationsApi(apiConfig, undefined, axiosInstance);
export const usersApi = new UsersApi(apiConfig, undefined, axiosInstance);
