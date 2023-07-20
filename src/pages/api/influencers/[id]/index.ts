import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { influencerValidationSchema } from 'validationSchema/influencers';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.influencer
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getInfluencerById();
    case 'PUT':
      return updateInfluencerById();
    case 'DELETE':
      return deleteInfluencerById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getInfluencerById() {
    const data = await prisma.influencer.findFirst(convertQueryToPrismaUtil(req.query, 'influencer'));
    return res.status(200).json(data);
  }

  async function updateInfluencerById() {
    await influencerValidationSchema.validate(req.body);
    const data = await prisma.influencer.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteInfluencerById() {
    const data = await prisma.influencer.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
