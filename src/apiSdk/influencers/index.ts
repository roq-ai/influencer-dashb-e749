import axios from 'axios';
import queryString from 'query-string';
import { InfluencerInterface, InfluencerGetQueryInterface } from 'interfaces/influencer';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getInfluencers = async (
  query?: InfluencerGetQueryInterface,
): Promise<PaginatedInterface<InfluencerInterface>> => {
  const response = await axios.get('/api/influencers', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createInfluencer = async (influencer: InfluencerInterface) => {
  const response = await axios.post('/api/influencers', influencer);
  return response.data;
};

export const updateInfluencerById = async (id: string, influencer: InfluencerInterface) => {
  const response = await axios.put(`/api/influencers/${id}`, influencer);
  return response.data;
};

export const getInfluencerById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/influencers/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteInfluencerById = async (id: string) => {
  const response = await axios.delete(`/api/influencers/${id}`);
  return response.data;
};
