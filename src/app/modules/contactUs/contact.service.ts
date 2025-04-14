import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import PageContentModel from './contact.model';
import Help from './contact.model';
import { IHelpContact } from './contact.interface';
import QueryBuilder from '../../builder/QueryBuilder';

// Get email
const getEmail = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(Help.find({}), query);

  await queryBuilder.filter().sort().paginate().fields().modelQuery;
  const contcatInfo = await Help.find({}).exec();
  if (!contcatInfo) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Page content not found');
  }
  return contcatInfo;
};
// Get email
const getSingleEmail = async (id: string) => {
  const contcatInfo = await Help.findByIdAndUpdate(
    id,
    { read: true },
    { new: true }
  );
  if (!contcatInfo) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Page content not found');
  }
  return contcatInfo;
};

// Send email or create
const sendEmailUser = async (payload: IHelpContact) => {
  const pageContent = await Help.create(payload);
  if (!pageContent) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Faild to send email');
  }
  return pageContent;
};

export const ConatctService = {
  getEmail,
  sendEmailUser,
  getSingleEmail,
};
