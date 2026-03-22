import { useGetUserProfileQuery } from "@/queries/user-queries";

const HomePage = () => {
  const { data: userProfile, isLoading, isError } = useGetUserProfileQuery();
  console.log("userProfile",userProfile)

  return <div>HomePage</div>;
};

export default HomePage;
