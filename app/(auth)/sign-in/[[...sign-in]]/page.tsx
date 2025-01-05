import { SignIn } from "@clerk/nextjs";

const CustomSignInPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <SignIn />
    </div>
  );
};

export default CustomSignInPage;
