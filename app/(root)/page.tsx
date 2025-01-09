"use client";

import { Modal } from "@/components/ui/modal";
import { useOrderModal } from "@/hooks/use-order-modal";
import { useEffect } from "react";

export default function Home() {

  const onOpen = useOrderModal((state) => state.onOpen); 
  const isOpen = useOrderModal((state) => state.isOpen); 

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return (
    <div className="">
      root
    </div>
  );
}
