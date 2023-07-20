import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  Flex,
  Center,
} from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import DatePicker from 'components/date-picker';
import { Error } from 'components/error';
import { FormWrapper } from 'components/form-wrapper';
import { NumberInput } from 'components/number-input';
import { SelectInput } from 'components/select-input';
import { AsyncSelect } from 'components/async-select';
import { TextInput } from 'components/text-input';
import AppLayout from 'layout/app-layout';
import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { FunctionComponent, useState } from 'react';
import * as yup from 'yup';
import useSWR from 'swr';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { getTransactionById, updateTransactionById } from 'apiSdk/transactions';
import { transactionValidationSchema } from 'validationSchema/transactions';
import { TransactionInterface } from 'interfaces/transaction';
import { UserInterface } from 'interfaces/user';
import { InfluencerInterface } from 'interfaces/influencer';
import { getUsers } from 'apiSdk/users';
import { getInfluencers } from 'apiSdk/influencers';

function TransactionEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<TransactionInterface>(
    () => (id ? `/transactions/${id}` : null),
    () => getTransactionById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: TransactionInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateTransactionById(id, values);
      mutate(updated);
      resetForm();
      router.push('/transactions');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<TransactionInterface>({
    initialValues: data,
    validationSchema: transactionValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Transactions',
              link: '/transactions',
            },
            {
              label: 'Update Transaction',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Transaction
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <NumberInput
            label="Credits Spent"
            formControlProps={{
              id: 'credits_spent',
              isInvalid: !!formik.errors?.credits_spent,
            }}
            name="credits_spent"
            error={formik.errors?.credits_spent}
            value={formik.values?.credits_spent}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('credits_spent', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            labelField={'email'}
          />
          <AsyncSelect<InfluencerInterface>
            formik={formik}
            name={'influencer_id'}
            label={'Select Influencer'}
            placeholder={'Select Influencer'}
            fetcher={getInfluencers}
            labelField={'name'}
          />
          <Flex justifyContent={'flex-start'}>
            <Button
              isDisabled={formik?.isSubmitting}
              bg="state.info.main"
              color="base.100"
              type="submit"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              _hover={{
                bg: 'state.info.main',
                color: 'base.100',
              }}
            >
              Submit
            </Button>
            <Button
              bg="neutral.transparent"
              color="neutral.main"
              type="button"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              onClick={() => router.push('/transactions')}
              _hover={{
                bg: 'neutral.transparent',
                color: 'neutral.main',
              }}
            >
              Cancel
            </Button>
          </Flex>
        </FormWrapper>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'transaction',
    operation: AccessOperationEnum.UPDATE,
  }),
)(TransactionEditPage);
