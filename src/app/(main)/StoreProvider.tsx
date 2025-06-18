"use client";

import { sessionHandler } from "@/hooks/authslice";
import { useAppDispatch } from "@/hooks/rtkhooks";
import { Session, User } from "lucia";
import { useState } from "react";

interface SessionContext {
  user: User;
  session: Session;
}

export default function SetionProvider({
  value,
  children,
}: React.PropsWithChildren<{ value: SessionContext }>) {
  const dispatch = useAppDispatch();
  const [initialized, setInitilized] = useState(false);

  // Check if we have already dispatched the session
  if (!initialized) {
    setInitilized(true);

    // Dispatch the sessionHandler action with value
    dispatch(
      sessionHandler({
        ...value,
        session: {
          ...value.session,
          expiresAt: value.session.expiresAt.getTime(), // Convert Date to timestamp
        },
      }),
    );
  }

  return <>{children}</>;
}
