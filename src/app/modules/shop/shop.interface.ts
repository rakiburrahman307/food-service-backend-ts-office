// Shop Schema Interface
export interface TBankCard {
  cardNumber: string;
  cardHolderName: string;
  expireDate: string;
  cvv: string;
}
export interface TShop extends Document {
  shopName: string;
  shopOwnerName: string;
  shopLicence: string;
  shopLocation: string;
  shopOpenTime: string;
  shopCloseTime: string;
  minOrderPrice: number;
  bankCard: TBankCard;
  minOrderOfferPrice: number;
  shopLogo: string;
  shopBanner: string;
  shopDescription: string;
  turnOffShop: boolean;
}

export type TFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
};
