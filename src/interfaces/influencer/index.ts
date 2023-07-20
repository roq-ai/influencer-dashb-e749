import { TransactionInterface } from 'interfaces/transaction';
import { GetQueryInterface } from 'interfaces';

export interface InfluencerInterface {
  id?: string;
  name: string;
  social_media_links: string;
  followers: number;
  location: string;
  language: string;
  genre: string;
  contact_info: string;
  created_at?: any;
  updated_at?: any;
  transaction?: TransactionInterface[];

  _count?: {
    transaction?: number;
  };
}

export interface InfluencerGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  social_media_links?: string;
  location?: string;
  language?: string;
  genre?: string;
  contact_info?: string;
}
