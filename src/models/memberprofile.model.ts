import Image from "@/models/image.model";

interface MemberProfile {
  display_name: string;
  short_display_name: string;
  birthday: string;
  photo: Image;
  programme: string;
  starting_year: number;
  address_street: string | null;
  address_street2: string | null;
  address_postal_code: string | null;
  address_city: string | null;
  address_country: string | null;
  phone_number: string | null;
  emergency_contact: string | null;
  emergency_contact_phone_number: string | null;
  show_birthday: boolean | null;
  website: string | null;
  profile_description: string | null;
  initials: string | null;
  nickname: string | null;
  display_name_preference: string | null;
  receive_optin: boolean | null;
  receive_newsletter: boolean | null;
  receive_magazine: boolean | null;
  email_gsuite_only: boolean | null;
}

export default MemberProfile;
