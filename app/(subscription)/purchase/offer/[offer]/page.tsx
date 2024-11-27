"use client";

import { useParams } from "next/navigation";

const Page = () => {
  const { offer } = useParams();

  return <div>{offer}</div>;
};

export default Page;
