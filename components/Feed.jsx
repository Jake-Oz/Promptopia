"use client";

import { useState, useEffect } from "react";

import PromptCard from "./PromptCard";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const PromptCardList = ({ data, handleTagClick, handleProfileClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
          handleProfileClick={handleProfileClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const router = useRouter();
  const { data: session } = useSession();
  const handleSearchChange = (e) => {
    e.preventDefault();
    setSearchText(e.target.value);
  };

  useEffect(() => {
    handleTextChange();
  }, [searchText]);

  const handleTextChange = () => {
    const filterPosts = posts.filter((post) => {
      return (
        post.prompt.toLowerCase().includes(searchText.toLowerCase()) ||
        post.creator.username.includes(searchText) ||
        post.tag.toLowerCase().includes(searchText.toLowerCase())
      );
    });
    setFilteredPosts(filterPosts);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const revalidate = 10;
      const response = await fetch("/api/prompt", { next: { revalidate } });
      const data = await response.json();
      setPosts(data);
      console.log("Setting Posts Data on Feed Page");
    };

    fetchPosts();
  }, []);

  const handleProfileClick = (post) => {
    if (session?.user.id === post.creator._id) return router.push("/profile");
    router.push(`/profile/${post.creator._id}?name=${post.creator.username}`);
  };

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a prompt, tag or username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      <PromptCardList
        data={searchText ? filteredPosts : posts}
        handleTagClick={setSearchText}
        handleProfileClick={handleProfileClick}
      />
    </section>
  );
};
export default Feed;
