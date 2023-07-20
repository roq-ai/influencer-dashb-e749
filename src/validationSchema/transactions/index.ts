import * as yup from 'yup';

export const transactionValidationSchema = yup.object().shape({
  credits_spent: yup.number().integer().required(),
  user_id: yup.string().nullable().required(),
  influencer_id: yup.string().nullable().required(),
});
