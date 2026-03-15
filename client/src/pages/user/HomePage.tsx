import { useGetUserProfileMQuery } from "@/queries/user-queries";

const HomePage = () => {
  const { data: userProfile, isLoading, isError } = useGetUserProfileMQuery();
  console.log("userProfile",userProfile)

  return <div>HomePage</div>;
};

export default HomePage;
