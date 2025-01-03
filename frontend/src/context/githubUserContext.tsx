/* eslint-disable react-refresh/only-export-components */
import React, { useContext } from "react";

interface GithubUserCtx {
  userDetails: UserInformation;
  updateUserDetails: (arg: UserInformation) => void;
}

type UserInformation = {
  login: string;
  [key: string]: unknown;
};

const GithubUserContext = React.createContext<GithubUserCtx | null>(null);

export function GithubUserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userDetails, setUserDetails] = React.useState<UserInformation>({
    login: "",
  });

  return (
    <GithubUserContext.Provider
      value={{
        userDetails,
        updateUserDetails: (data: UserInformation) => {
          setUserDetails(data);
        },
      }}
    >
      {children}
    </GithubUserContext.Provider>
  );
}

export function useGithubUser() {
  const ctx = useContext(GithubUserContext);
  if (!ctx)
    throw new Error("useGithubUser must be within a GithubUserProvider");
  return ctx;
}
