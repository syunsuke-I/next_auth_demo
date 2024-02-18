"use client";

import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [user, setUser] = useState<Session["user"] | undefined>(undefined);

  // useSessionはNextAuthのフックで、クライアントサイドでSessionを取得・管理に使います
  // data: 現在のセッション情報。ユーザー情報が含まれる
  // status: セッションの状態（"loading", "authenticated", "unauthenticated"）
  const { data: session, status } = useSession();

  useEffect(() => {
    // sessionを取得したときにユーザー情報をセットする
    setUser(session?.user ?? undefined);
  }, [session?.user]);

  if (user === undefined) {
    if (status === "loading") return <div>Loading</div>;
    return <div>user === undefined</div>;
  }

  return (
    <div className="px-12">
      <div>クライアントサイド</div>
      <div>
        {Object.entries(user).map(([key, value], index) => (
          <div key={index}>
            <strong>{key}:</strong> {value?.toString()}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;