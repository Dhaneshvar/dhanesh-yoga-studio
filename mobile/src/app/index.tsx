import { Redirect } from "expo-router";
import { Splash } from "../../App";
import { useAuth } from "../contexts/AuthContext";

export default function IndexRoute() {
  const { session, loading } = useAuth();
  if (loading) return <Splash />;
  return <Redirect href={session ? "/(tabs)" : "/auth"} />;
}
