"use client";

import { useRouter } from "next/navigation";

import ModalWrapper from "./ModalWrapper";

interface ModalDismissBtnProps {
  children: React.ReactNode;
  title?: string;
}

export default function InterceptedRouteModal({ children, title }: Readonly<ModalDismissBtnProps>) {
  const router = useRouter();

  return (
    <ModalWrapper isOpen={true} onClose={() => router.back()} title={title}>
      {children}
    </ModalWrapper>
  );
}
