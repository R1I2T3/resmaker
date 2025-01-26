import React from "react";

const DashBoardLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="h-full w-full flex justify-center items-center flex-grow">
      {children}
    </div>
  );
};

export default DashBoardLayout;
