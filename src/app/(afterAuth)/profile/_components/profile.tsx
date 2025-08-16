"use client";

import { useUserInfo } from "@/queries/auth";

const Profile = () => {
  const { data: userInfo } = useUserInfo();
  return (
    <>
      <div>
        <h3 className="font-semibold">이름</h3>
        <p>{userInfo?.name}</p>
      </div>
      <div>
        <h3 className="font-semibold">매장</h3>
        <p>{userInfo?.company}</p>
      </div>
      <div>
        <h3 className="font-semibold">이메일</h3>
        <p>{userInfo?.email}</p>
      </div>
    </>
  );
};

export default Profile;
