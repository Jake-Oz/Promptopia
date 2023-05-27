"use client";

import { useState, UseEffect, useEffect } from "react";
import { useRouter } from "next/navigation";

import Profile from "@components/Profile";

const OtherProfile = ({ params }) => {
  const [posts, setPosts] = useState([]);

  const router = useRouter();
  const queryName = new URL(document.location).searchParams.get("name");

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${params.id}/posts`);
      const data = await response.json();
      setPosts(data);
    };

    fetchPosts();
  }, []);

  return (
    <Profile
      name={queryName}
      desc={`Welcome to ${queryName}'s personalised profile page. 
      Explore ${queryName}'s exceptional prompts and be inspired
      by the power of their imagination.`}
      data={posts}
    />
  );
};
export default OtherProfile;
