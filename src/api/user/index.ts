import type { ZodNumber } from 'zod';
import httpClient from '../index';

export const createProfileRequest = (values: any) => {
  return httpClient.post({
    url: '/v1/user-profile',
    data: values,
  });
};

export const createGetBrokersRequest = (page: number, take: number) => {
  return httpClient.get({
    url: `/v1/users?type='broker'&page=${page}&take=${take}`,
  });
};

export const createGetAllTopicsRequest = (page: number, take: number) => {
  return httpClient.get({
    url: `/v1/interest-topic?page=${page}&take=${take}&sort={"orderBy":"topic_name","order":"ASC"}`,
  });
  // try {
  //   const res = await httpClient.get({
  //     url: `/v1/interest-topic?page=${page}&take=${take}&sort={"orderBy":"topic_name","order":"ASC"}`,
  //   });
  //   return res;
  // } catch (err) {
  //   console.log(err);
  // }
};
