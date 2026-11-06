import { ProfileDetails } from "../../components/ProfileDetails";
import { MobileFrame } from "../../components/MobileFrame";
import { useAuth } from "../../contexts/AuthContext";

export default function ProfileRoute() { const { profile, user, refreshProfile, signOut } = useAuth(); return <MobileFrame title="Your account"><ProfileDetails profile={profile} email={user?.email ?? ""} onSaved={refreshProfile} onSignOut={signOut} /></MobileFrame>; }
