import Image from "@/models/image.model";

interface MemberProfile {
  display_name: string;
  short_display_name: string;
  birthday: string;
  photo: Image;
  programme: string;
  starting_year: number;
  address_street: string;
  address_street2: string | null;
  address_postal_code: string;
  address_city: string;
  address_country: string;
  phone_number: string;
  emergency_contact: string | null;
  emergency_contact_phone_number: string | null;
  show_birthday: boolean;
  website: string | null;
  profile_description: string;
  initials: string | null;
  nickname: string | null;
  display_name_preference: string;
  receive_optin: boolean;
  receive_newsletter: boolean;
  receive_magazine: boolean;
  email_gsuite_only: boolean;
}

export default MemberProfile;
