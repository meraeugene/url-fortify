"use client";

import { useParams } from "next/navigation";

const page = () => {
  const { offer } = useParams();

  return <div>{offer}</div>;
};

export default page;
