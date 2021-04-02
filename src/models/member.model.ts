import MemberProfile from "@/models/memberprofile.model";

interface Member {
  pk: number;
  membership_type: string;
  profile: MemberProfile;
  achievements: [];
  societies: [];
}

export default Member;
