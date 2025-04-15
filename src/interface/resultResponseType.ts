interface ResultDataType {
  picture: string;
  _id: string;
  otherPictures: string[];
  businessType: string;
  BusinessName: string;
  BusinessKeywords: string[];
  BusinessDescription: string;
  BusinessLocation: {
    address: string;
    city: string;
    state: string;
    country: string;
    lang: number;
    lat: number;
  };
  BusinessAvgPrice: string;
  isVerified: boolean;
  isTrending: boolean;
  BusinessPhone: string;
  BusinessEmail: string;
  BusinessWebsite: string;
  BusinessSocial: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
  rating: number;
  ratingCount: number;
}

export default ResultDataType;
