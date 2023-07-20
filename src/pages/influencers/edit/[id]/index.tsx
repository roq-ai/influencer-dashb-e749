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
import { getInfluencerById, updateInfluencerById } from 'apiSdk/influencers';
import { influencerValidationSchema } from 'validationSchema/influencers';
import { InfluencerInterface } from 'interfaces/influencer';

function InfluencerEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<InfluencerInterface>(
    () => (id ? `/influencers/${id}` : null),
    () => getInfluencerById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: InfluencerInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateInfluencerById(id, values);
      mutate(updated);
      resetForm();
      router.push('/influencers');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<InfluencerInterface>({
    initialValues: data,
    validationSchema: influencerValidationSchema,
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
              label: 'Influencers',
              link: '/influencers',
            },
            {
              label: 'Update Influencer',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Influencer
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <TextInput
            error={formik.errors.name}
            label={'Name'}
            props={{
              name: 'name',
              placeholder: 'Name',
              value: formik.values?.name,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.social_media_links}
            label={'Social Media Links'}
            props={{
              name: 'social_media_links',
              placeholder: 'Social Media Links',
              value: formik.values?.social_media_links,
              onChange: formik.handleChange,
            }}
          />

          <NumberInput
            label="Followers"
            formControlProps={{
              id: 'followers',
              isInvalid: !!formik.errors?.followers,
            }}
            name="followers"
            error={formik.errors?.followers}
            value={formik.values?.followers}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('followers', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <TextInput
            error={formik.errors.location}
            label={'Location'}
            props={{
              name: 'location',
              placeholder: 'Location',
              value: formik.values?.location,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.language}
            label={'Language'}
            props={{
              name: 'language',
              placeholder: 'Language',
              value: formik.values?.language,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.genre}
            label={'Genre'}
            props={{
              name: 'genre',
              placeholder: 'Genre',
              value: formik.values?.genre,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.contact_info}
            label={'Contact Info'}
            props={{
              name: 'contact_info',
              placeholder: 'Contact Info',
              value: formik.values?.contact_info,
              onChange: formik.handleChange,
            }}
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
              onClick={() => router.push('/influencers')}
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
    entity: 'influencer',
    operation: AccessOperationEnum.UPDATE,
  }),
)(InfluencerEditPage);
